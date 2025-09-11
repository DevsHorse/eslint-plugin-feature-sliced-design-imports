const path = require('path');
const micromatch = require('micromatch');

/**
 * Checks if import path is relative
 */
function isPathRelative(importPath) {
  return (
    importPath === '.' ||
    importPath.startsWith('./') ||
    importPath.startsWith('../')
  );
}

/**
 * Formats file path to FSD format, extracting path after 'src' folder
 * @param {boolean} full - If true, returns full path, otherwise path after 'src'
 */
function formatCurrentFilePath(filePath, full = false) {
  const normilizedPath = path.toNamespacedPath(filePath).replace(/\\/g, '/');

  if (full) {
    return normilizedPath;
  }

  return normilizedPath.split('src')[1];
}

/**
 * Removes alias prefix from import path (e.g., '@/shared/ui' -> 'shared/ui')
 */
function removeAliasFromImport(importPath, alias) {
  return alias ? importPath.replace(`${alias}/`, '') : importPath;
}

/**
 * Extracts layer and slice from FSD path
 * @param {boolean} segmented - If true, returns all path segments, otherwise [layer, slice]
 * @returns {Array} [layer, slice] or all path segments
 */
function extractLayerAndSlice(fullPath, segmented = false) {
  const pathArray = fullPath?.split('/').filter((s) => !!s);

  if (!pathArray) return [];

  if (segmented) {
    return pathArray;
  }
	
  return [pathArray[0], pathArray[1]];
}

/**
 * Checks if path matches any of the provided glob patterns using micromatch
 */
function isPathMatchAnyPattern(path, patterns) {
  return patterns.some((pattern) => micromatch.isMatch(path, pattern));
}

/**
 * Determines if a relative import crosses layer or slice boundaries in Feature-Sliced Design architecture.
 * 
 * This function validates relative imports according to FSD rules:
 * - Relative imports within the same layer/slice are allowed
 * - Cross-layer relative imports are forbidden (should use absolute imports)
 * - Cross-slice relative imports within structured layers are forbidden
 * - shared and app layers can use relative imports only within themselves
 * 
 * @param {string} currentFilePath - The normalized file path where the import is used (e.g., "/shared/ui/Button")
 * @param {string} relativePath - The relative import path (e.g., "../../config/theme", "../model/Type")
 * @param {Object} layers - Transformed layers object from getLayers() (e.g., {"shared-layer": "shared-layer", "app": "app"})
 * @param {Object} layersConfig - Original layer configuration from settings (e.g., {"shared": "shared-layer"})
 * 
 * @returns {boolean} True if the relative import violates FSD rules (crosses boundaries), false if allowed
 * 
 * @example
 * // Valid: relative import within same layer
 * isRelativePathCrossSlice("/shared/ui/Button", "../config/theme", layers, {}) // false
 * 
 * // Invalid: cross-layer relative import
 * isRelativePathCrossSlice("/shared/ui/Button", "../../entities/user/model", layers, {}) // true
 * 
 * // Invalid: cross-slice relative import  
 * isRelativePathCrossSlice("/entities/user/ui/Form", "../../article/model/Type", layers, {}) // true
 */
function isRelativePathCrossSlice(currentFilePath, relativePath, layers, layersConfig = {}) {
  // Extract the current layer and slice from the file path
  const [currentLayer, currentSlice] = extractLayerAndSlice(currentFilePath);

  // Early exit if we can't determine the current layer
  if (!currentLayer) return false;
  
  // Get all layer values from the transformed layers configuration
  const layerValues = Object.values(layers || {});
  
  // Determine the actual layer names for shared and app from the original configuration
  // This handles custom layer names like {shared: "shared-layer", app: "application"}
  const sharedLayerName = layersConfig.shared || layers.shared;
  const appLayerName = layersConfig.app || layers.app;
  
  // Simulate relative path resolution by manually processing the path components
  // Start with the current directory (excluding the filename)
  const currentDir = currentFilePath.split('/').slice(0, -1).filter(part => part !== '');
  const pathParts = [...currentDir]; // Create a copy to manipulate
  const relativeParts = relativePath.split('/');
  
  // Process each part of the relative path
  for (const part of relativeParts) {
    if (part === '..') {
      // Go up one directory level
      if (pathParts.length > 0) {
        pathParts.pop();
      }
    } else if (part !== '.' && part !== '') {
      // Add directory or file name (ignore current directory '.' and empty parts)
      pathParts.push(part);
    }
  }
  
  // Special handling for shared and app layers:
  // These layers often have relative imports that don't start with a layer name,
  // so we need to add the current layer prefix to resolve the path correctly
  const isInSharedOrAppLayer = (currentLayer === sharedLayerName || currentLayer === appLayerName);
  const pathResolvedToRoot = pathParts.length === 0;
  const hasPathParts = pathParts.length > 0;
  
  if (pathResolvedToRoot && isInSharedOrAppLayer) {
    // If path resolved to root and we're in shared/app, assume it stays in the same layer
    pathParts.push(currentLayer);
  } else if (hasPathParts && isInSharedOrAppLayer) {
    // If we're in shared/app layer and the resolved path doesn't start with a known layer name,
    // prepend the current layer name to maintain the correct context
    const firstPart = pathParts[0];
    const firstPartIsNotKnownLayer = !layerValues.includes(firstPart);
    
    if (firstPartIsNotKnownLayer) {
      pathParts.unshift(currentLayer);
    }
  }
  
  // Join the resolved path parts and extract the target layer and slice
  const resolvedPath = pathParts.join('/');
  const [resolvedLayer, resolvedSlice] = extractLayerAndSlice(resolvedPath);
  
  // Early exit if we can't determine the resolved layer
  if (!resolvedLayer) return false;
  
  // Allow relative imports within the same shared or app layer
  // For these layers, slice boundaries don't matter - only the layer matters
  const isWithinSameSharedLayer = (currentLayer === sharedLayerName && resolvedLayer === sharedLayerName);
  const isWithinSameAppLayer = (currentLayer === appLayerName && resolvedLayer === appLayerName);
  const isWithinSameSpecialLayer = isWithinSameSharedLayer || isWithinSameAppLayer;
  
  if (isWithinSameSpecialLayer) {
    return false;
  }
  
  // For structured layers (entities, features, widgets, pages):
  // Forbid relative imports that cross boundaries:
  // 1. Cross-layer imports (different layers) - should use absolute imports
  // 2. Cross-slice imports (same layer, different slice) - should use absolute imports
  const isCrossLayerImport = (resolvedLayer !== currentLayer);
  const isCrossSliceImport = (resolvedLayer === currentLayer && resolvedSlice !== currentSlice);
  const crossesBoundaries = isCrossLayerImport || isCrossSliceImport;
  
  return crossesBoundaries;
}

module.exports = {
  isPathRelative,
  formatCurrentFilePath,
  removeAliasFromImport,
  extractLayerAndSlice,
  isPathMatchAnyPattern,
  isRelativePathCrossSlice,
};
