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
} = require('../helpers');
const { getLayers } = require('../constants');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'This rule enforces that imports within the same entity and layer use relative paths.',
      recommended: false,
      url: null,
    },
    fixable: null,
    schema: [{}],
    messages: {
      shouldBeRelativePath: 'Path should be relative!',
    },
  },

  create(context) {
    const alias = context.settings['feature-sliced-design-imports/alias'] || '';
    const layersConfig =
      context.settings['feature-sliced-design-imports/layers'] || {};

    const layers = getLayers(layersConfig);

    function shouldBeRelative(currectFilePath, importPath) {
      if (isPathRelative(importPath)) return false;

      // entities/Article
      const [importLayer, importSlice] = extractLayerAndSlice(importPath)
      if (!importLayer || !importSlice || !layers[importLayer]) return false;

      // C:\Users\dev\Desktop\project\src\entities\Article
      const [fileLayer, fileSlice] = extractLayerAndSlice(formatCurrentFilePath(currectFilePath));
      if (!fileLayer || !fileSlice || !layers[fileLayer])  return false;

      return importSlice === fileSlice && importLayer === fileLayer;
    }

    return {
      ImportDeclaration(node) {
        try {
          const importPath = removeAliasFromImport(node.source.value, alias);

          if (shouldBeRelative(context.filename, importPath)) {
            context.report({ node, messageId: 'shouldBeRelativePath' });
          }
        } catch (e) {
          console.log(e);
        }
      },
    };
  },
};
