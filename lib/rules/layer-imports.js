/**
 * @fileoverview This rule enforces strict import order between defined architectural layers.
 * @author Vladislav
 */
'use strict';

const { getRules, getLayers, crossEntitiesFolder } = require('../constants');
const {
  isPathRelative,
  extractLayerAndSlice,
  formatCurrentFilePath,
  removeAliasFromImport,
  isPathMatchAnyPattern,
} = require('../helpers');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'This rule enforces strict import order between defined architectural layers.',
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
      incorrectLayerImport:
        'Import from {{importLayer}} is not allowed in {{fileLayer}}',
      incorrectEntityImports:
        'Imports between entities should be via @x folder. \n' +
        "Valid: 'entities/{{fromEntityName}}/@x/{{toEntityName}}' \n " +
        'Example: \n' +
        "Import from 'entities/user/@x/message' \n" +
        "Import to 'entities/message/model/Type' \n",
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
      context.settings['feature-sliced-design-imports/layers'] ?? {};

    // Get layer rules and configurations
    const rules = getRules(layersConfig); // Import rules between layers
    const layers = getLayers(layersConfig); // Layer name mappings
    const allowedLayers = getLayers(layersConfig, true); // Layer names only

    return {
      ImportDeclaration(node) {
        try {
          // Remove alias and normalize paths
          const importPath = removeAliasFromImport(node.source.value, alias);
          const currentFilePath = formatCurrentFilePath(context.filename);

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
          if (
            isImportIgnored ||
            isFileIgnored ||
            isPathRelative(importPath)
          )
            return;

          // Extract layer and slice information
          const importPathSegments = extractLayerAndSlice(importPath, true);
          const filePathSegments = extractLayerAndSlice(currentFilePath);

          const [fileLayer, fileSlice] = filePathSegments;
          const [importLayer, importSlice, importSegment, importSegmentItem] =
            importPathSegments;

          // Skip validation if either layer is not defined in configuration
          const hasUndefinedLayers = !layers[importLayer] || !layers[fileLayer];
          if (hasUndefinedLayers) return;

          // Special handling for cross-entity imports (entities -> entities)
          const isCrossEntitiesImport =
            importLayer === allowedLayers.entities &&
            fileLayer === allowedLayers.entities;

          // Check if cross-entity import follows @x pattern
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

          // Check if import is allowed according to layer hierarchy rules
          const isImportAllowed = rules[fileLayer].includes(importLayer);

          if (isImportAllowed) return;

          // Report violation of layer import rules
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
