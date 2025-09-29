/**
 * @fileoverview This rule enforces that imports from other layers should only access the public API of those modules.
 * @author Vladislav
 */
'use strict';

const { getLayers, crossEntitiesFolder } = require('../constants');
const {
  isPathRelative,
  removeAliasFromImport,
  extractLayerAndSlice,
  formatCurrentFilePath,
  isPathMatchAnyPattern,
} = require('../helpers');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'This rule enforces that imports from other layers should only access the public API of those modules.',
      recommended: false,
      url: null,
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          testFilePatterns: {
            type: 'array',
            items: { type: 'string' },
          },
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
      notPublicApiImport: 'Import should be from public api',
      notTestingPublicApiImport:
        'Import should be from public api for testing (public-api/testing.{js,ts})',
    },
  },

  create(context) {
    // Extract configuration options
    const options = context.options[0] || {};
    const testFilePatterns = options.testFilePatterns ?? [];
    const localIgnoreImports = options.ignoreImportsPattern ?? [];
    const localIgnoreFiles = options.ignoreFilesPattern ?? [];
    const alias = context.settings['feature-sliced-design-imports/alias'] || '';
    const globalIgnoreFiles =
      context.settings['feature-sliced-design-imports/ignoreFiles'] || [];
    const globalIgnoreImports =
      context.settings['feature-sliced-design-imports/ignoreImports'] || [];
    const layersConfig =
      context.settings['feature-sliced-design-imports/layers'] ?? {};

    return {
      ImportDeclaration(node) {
        try {
          // Remove alias and normalize paths
          const importPath = removeAliasFromImport(node.source.value, alias);
          const currentFilePath = formatCurrentFilePath(context.filename);

          // Skip if paths are invalid
          if (!importPath || !currentFilePath) return;

          // Check ignore patterns
          const isFileIgnored = isPathMatchAnyPattern(
            currentFilePath,
            [...globalIgnoreFiles, ...localIgnoreFiles]
          );
          const isImportIgnored = isPathMatchAnyPattern(
            importPath,
            [...globalIgnoreImports, ...localIgnoreImports]
          );

          // Skip validation for ignored files/imports and relative imports
          if (isImportIgnored || isFileIgnored || isPathRelative(importPath)) return;

          // Get layers that require public API validation (excluding app and shared)
          const layersToCheck = { ...getLayers(layersConfig, true) };
          delete layersToCheck.app;
          delete layersToCheck.shared;

          // Extract layer and slice information
          const importPathSegments = extractLayerAndSlice(importPath, true);
          const [fileLayer] = extractLayerAndSlice(currentFilePath);

          const [importLayer, , importSegment] = importPathSegments;

          // Skip if importing from layer that doesn't require public API validation
          if (!layersToCheck[importLayer]) return;

          // Check special cases for allowed imports
          const isCrossEntitiesImport =
            importLayer === layersToCheck.entities &&
            fileLayer === layersToCheck.entities &&
            importSegment === crossEntitiesFolder &&
            importPathSegments.length === 4;

          const publicImport = importPathSegments.length <= 2; // e.g., 'entities/user'
          const isTestingPublicApi =
            importSegment === 'testing' && importPathSegments.length < 4;

          // Check if import violates public API rule
          const notPublicApiImport =
            !publicImport && !isTestingPublicApi && !isCrossEntitiesImport;

          if (notPublicApiImport) {
            context.report({
              node,
              messageId: 'notPublicApiImport',
            });
          }

          // Special validation for testing API imports
          if (!isTestingPublicApi) return;

          const filePath = formatCurrentFilePath(context.filename, true);
          const isCurrentFileAllowedByTestPattern = isPathMatchAnyPattern(filePath, testFilePatterns);

          if (isCurrentFileAllowedByTestPattern) return;

          // Report violation: testing API used in non-test file
          context.report({
            node,
            messageId: 'notTestingPublicApiImport',
          });
        } catch (e) {
          console.log(e);
        }
      },
    };
  },
};
