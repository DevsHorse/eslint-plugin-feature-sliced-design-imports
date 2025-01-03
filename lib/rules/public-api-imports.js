/**
 * @fileoverview This rule enforces that imports from other layers should only access the public API of those modules.
 * @author Vladislav
 */
'use strict';

const micromatch = require('micromatch');
const { getLayers, crossEntitiesFolder } = require('../constants');
const {
  isPathRelative,
  removeAliasFromImport,
  extractLayerAndSlice,
  formatCurrentFilePath,
} = require('../helpers');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'This rule enforces that imports from other layers should only access the public API of those modules.',
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
    const testFilePatterns = context.options[0]?.testFilePatterns ?? [];
    const alias = context.settings['feature-sliced-design-imports/alias'] || '';
    const layersConfig =
      context.settings['feature-sliced-design-imports/layers'] ?? {};

    return {
      ImportDeclaration(node) {
        try {
          const importPath = removeAliasFromImport(node.source.value, alias);

          if (isPathRelative(importPath)) return;

          const layersToCheck = getLayers(layersConfig, true);

          // Exclude app and shared layers
          delete layersToCheck.app;
          delete layersToCheck.shared;

          const importPathSegments = extractLayerAndSlice(importPath, true);
          const [fileLayer] = extractLayerAndSlice(
            formatCurrentFilePath(context.filename)
          );

          const [importLayer, , importSegment] = importPathSegments;

          if (!layersToCheck[importLayer]) return;

          const isCrossEntitiesImport =
            importLayer === layersToCheck.entities &&
            fileLayer === layersToCheck.entities &&
            importSegment === crossEntitiesFolder &&
            importPathSegments.length === 4;

          const publicImport = importPathSegments.length <= 2;

          const isTestingPublicApi =
            importSegment === 'testing' && importPathSegments.length < 4;


          const notPublicApiImport = !publicImport && !isTestingPublicApi && !isCrossEntitiesImport;

          if (notPublicApiImport) {
            context.report({
              node,
              messageId: 'notPublicApiImport',
            });
          }

          if (!isTestingPublicApi) return;

          const filePath = formatCurrentFilePath(context.filename, true);
          const isCurrentFileAllowedByPattern = testFilePatterns.some(
            (pattern) => micromatch.isMatch(filePath, pattern)
          );

          if (isCurrentFileAllowedByPattern) return;

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
