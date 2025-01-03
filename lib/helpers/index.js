const path = require('path');

function isPathRelative(importPath) {
  return (
    importPath === '.' ||
    importPath.startsWith('./') ||
    importPath.startsWith('../')
  );
}

function formatCurrentFilePath(filePath, full = false) {
  const normilizedPath = path.toNamespacedPath(filePath).replace(/\\/g, '/');

  if (full) {
    return normilizedPath;
  }

  return normilizedPath.split('src')[1];
}

function removeAliasFromImport(importPath, alias) {
  return alias ? importPath.replace(`${alias}/`, '') : importPath;
}

function extractLayerAndSlice(fullPath, segmented = false) {
  const pathArray = fullPath?.split('/').filter((s) => !!s);

  if (!pathArray) return [];

  if (segmented) {
    return pathArray;
  }
	
  return [pathArray[0], pathArray[1]];
}

module.exports = {
  isPathRelative,
  formatCurrentFilePath,
  removeAliasFromImport,
  extractLayerAndSlice,
};
