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

// Use minimatch for glob pattern matching (common in ESLint ecosystem)
let minimatch;
try {
  minimatch = require('minimatch');
} catch (e) {
  // Fallback to a simple glob implementation if minimatch is not available
  console.log('Using fallback glob matcher');
  minimatch = (path, pattern) => {
    // Simple glob implementation supporting * and **
    const regexPattern = pattern
      .replace(/\*\*/g, '.*')
      .replace(/\*/g, '[^/]*')
      .replace(/\?/g, '.')
      .replace(/\./g, '\\.');
    return new RegExp(`^${regexPattern}$`).test(path);
  };
}

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
    schema: [
      {
        type: 'object',
        properties: {
          ignores: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'Array of glob patterns to ignore'
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      shouldBeRelativePath: 'Path should be relative!',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const alias = context.settings['feature-sliced-design-imports/alias'] || '';
    const layersConfig =
      context.settings['feature-sliced-design-imports/layers'] || {};
    
    // Get ignores from rule options (preferred) or fallback to settings
    const ignorePatterns = options.ignores || 
      context.settings['feature-sliced-design-imports/layers']?.ignores || 
      [];

    const layers = getLayers(layersConfig);

    function shouldBeRelative(currentFilePath, importPath) {
      // Check if the current file (where the import is happening) matches any ignore pattern
      if (ignorePatterns.length > 0) {
        const isFileIgnored = ignorePatterns.some(pattern => {
          try {
            if (typeof pattern === 'string') {
              // Normalize the file path for pattern matching
              const normalizedFilePath = currentFilePath.replace(/\\/g, '/');
              const relativePath = normalizedFilePath.replace(/^.*\/kmbs-front\//, '');
              
              // Use glob matching to check if file should be ignored
              return minimatch(relativePath, pattern);
            } else if (pattern && typeof pattern.test === 'function') {
              // Legacy regex support
              return pattern.test(currentFilePath);
            }
            return false;
          } catch (e) {
            console.warn(`Invalid ignore pattern: ${pattern}`, e);
            return false;
          }
        });
        
        if (isFileIgnored) {
          return false;
        }
      }

      if (isPathRelative(importPath)) return false;

      // entities/Article
      const [importLayer, importSlice] = extractLayerAndSlice(importPath)

      if (!importLayer || !importSlice || !layers[importLayer]) return false;

      const [fileLayer, fileSlice] = extractLayerAndSlice(formatCurrentFilePath(currentFilePath));

      if (!fileLayer || !fileSlice || !layers[fileLayer])  return false;

      return importSlice === fileSlice && importLayer === fileLayer;
    }

    return {
      ImportDeclaration(node) {
        try {
          const importPath = removeAliasFromImport(node.source.value, alias);

          if (shouldBeRelative(context.filename || context.getFilename(), importPath)) {
            context.report({ node, messageId: 'shouldBeRelativePath' });
          }
        } catch (e) {
          console.log(e);
        }
      },
    };
  },
};
