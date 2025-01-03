/**
 * @fileoverview This rule enforces strict import order between defined architectural layers.
 * @author Vladislav
 */
'use strict';

const micromatch = require('micromatch');
const { getRules, getLayers, crossEntitiesFolder } = require('../constants');
const {
  isPathRelative,
  extractLayerAndSlice,
  formatCurrentFilePath,
  removeAliasFromImport,
} = require('../helpers');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'This rule enforces strict import order between defined architectural layers.',
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
          },
        },
      },
    ],
    messages: {
      incorrectLayerImport:
        'Import from {{importLayer}} is not allowed in {{fileLayer}}',
      incorrectEntityImports: 
        "Imports between entities should be via @x folder. \n" +
        "Valid: 'entities/{{fromEntityName}}/@x/{{toEntityName}}' \n " +
        "Example: \n" +
          "Import from 'entities/user/@x/message' \n" +
          "Import to 'entities/message/model/Type' \n"
      ,
    },
  },

  create(context) {
    const ignoreImportsPattern = context.options[0]?.ignoreImportsPattern ?? [];
    const alias = context.settings['feature-sliced-design-imports/alias'] || '';
    const layersConfig =
      context.settings['feature-sliced-design-imports/layers'] ?? {};

    const rules = getRules(layersConfig);
    const layers = getLayers(layersConfig);
    const allowedLayers = getLayers(layersConfig, true);

    return {
      ImportDeclaration(node) {
        try {
          const importPath = removeAliasFromImport(node.source.value, alias);

          if (isPathRelative(importPath)) return;

          const importPathSegments = extractLayerAndSlice(importPath, true);
          const filePathSegments = extractLayerAndSlice(
            formatCurrentFilePath(context.filename)
          );

          const [fileLayer, fileSlice] = filePathSegments;
          const [importLayer, importSlice, importSegment, importSegmentItem] =
            importPathSegments;

          if (!layers[importLayer] || !layers[fileLayer]) return;

          const isIgnoredByPattern = ignoreImportsPattern.some((pattern) =>
            micromatch.isMatch(importPath, pattern)
          );

          if (isIgnoredByPattern) return;

          const isCrossEntitiesImport =
            importLayer === allowedLayers.entities &&
            fileLayer === allowedLayers.entities;

          const isIncorrectXPattern =
            importPathSegments.length < 4 ||
            importSegment !== crossEntitiesFolder ||
            importSegmentItem !== fileSlice;

          if (isCrossEntitiesImport && isIncorrectXPattern) {
            context.report({
              node,
              messageId: 'incorrectEntityImports',
              data: {
                fromEntityName: importSlice ?? 'message',
                toEntityName: fileSlice ?? 'user',
              },
            });
          }

          const isImportAllowed = rules[fileLayer].includes(importLayer);

          if (isImportAllowed) return;

          context.report({
            node,
            messageId: 'incorrectLayerImport',
            data: { importLayer, fileLayer },
          });
        } catch (e) {
          console.log(e);
        }
      },
    };
  },
};
