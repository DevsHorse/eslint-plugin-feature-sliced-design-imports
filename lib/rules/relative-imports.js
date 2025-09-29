/**
 * @fileoverview This rule enforces that imports within the same entity and layer use relative paths.
 * @author Vladislav
 */
'use strict';

const {
  isPathRelative,
  formatCurrentFilePath,
  removeAliasFromImport,
  extractLayerAndSlice,
  isPathMatchAnyPattern,
  isRelativePathCrossSlice,
} = require('../helpers');
const { getLayers } = require('../constants');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'This rule enforces that imports within the same entity and layer use relative paths.',
      recommended: false,
      url: null,
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          ignoreImportsPattern: {
            type: 'array',
            items: { type: 'string' },
          },
          ignoreFilesPattern: {
            type: 'array',
            items: { type: 'string' },
          },
        },
      },
    ],
    messages: {
      shouldBeRelativePath: 'Path should be relative!',
      crossSliceRelativeImport:
        'Relative import should not cross layer or slice boundaries. Use absolute import instead.',
    },
  },

  create(context) {
    // Extract configuration options
    const options = context.options[0] || {};
    const localIgnoreImports = options.ignoreImportsPattern ?? [];
    const localIgnoreFiles = options.ignoreFilesPattern ?? [];
    const alias = context.settings['feature-sliced-design-imports/alias'] || '';
    const globalIgnoreFiles =
      context.settings['feature-sliced-design-imports/ignoreFiles'] || [];
    const globalIgnoreImports =
      context.settings['feature-sliced-design-imports/ignoreImports'] || [];
    const layersConfig =
      context.settings['feature-sliced-design-imports/layers'] || {};

    const layers = getLayers(layersConfig); // Layer name mappings

    /**
     * Determines if an import should be relative and returns appropriate error message ID
     * @param {string} filePath - Current file path (Example: C:\Users\dev\Desktop\project\src\entities\Article) 
     * @param {string} importPath - Import path to check (Example: entities/Article)
     * @returns {string|false} Error message ID or false if no error
     */
    function shouldBeRelative(filePath, importPath) {
      const currentFilePath = formatCurrentFilePath(filePath);

      // Skip if paths are invalid
      if (!importPath || !currentFilePath) return false;

      // Check ignore patterns
      const isFileIgnored = isPathMatchAnyPattern(currentFilePath, [
        ...globalIgnoreFiles,
        ...localIgnoreFiles,
      ]);
      const isImportIgnored = isPathMatchAnyPattern(importPath, [
        ...globalIgnoreImports,
        ...localIgnoreImports,
      ]);

      if (isImportIgnored || isFileIgnored) return false;

      // Handle relative imports - check for cross-layer/cross-slice violations
      if (isPathRelative(importPath)) {
        const isCrossRelativeImport = isRelativePathCrossSlice(
          currentFilePath,
          importPath,
          layers,
          layersConfig
        );

        if (isCrossRelativeImport) return 'crossSliceRelativeImport';

        return false; // Valid relative import within same layer/slice
      }

      // Handle absolute imports - check if they should be relative
      const [importLayer, importSlice] = extractLayerAndSlice(importPath);
      const [fileLayer, fileSlice] = extractLayerAndSlice(currentFilePath);

      // Check if we have all required layer/slice info and both layers exist in configuration
      const hasInvalidLayerOrSliceInfo =
        !importLayer ||
        !importSlice ||
        !layers[importLayer] ||
        !fileLayer ||
        !fileSlice ||
        !layers[fileLayer];

      if (hasInvalidLayerOrSliceInfo) return false;

      // Check if absolute import should be relative (same layer and slice)
      const shouldBeRelative =
        fileLayer === importLayer && fileSlice === importSlice;

      if (shouldBeRelative) {
        return 'shouldBeRelativePath';
      }

      return false;
    }

    return {
      ImportDeclaration(node) {
        try {
          // Remove alias and check if import should be relative
          const importPath = removeAliasFromImport(node.source.value, alias);
          const importShouldBeRelative = shouldBeRelative(
            context.filename,
            importPath
          );

          // Report violation if import should be relative or crosses boundaries
          if (importShouldBeRelative) {
            context.report({ node, messageId: importShouldBeRelative });
          }
        } catch (e) {
          console.log(e);
        }
      },
    };
  },
};
