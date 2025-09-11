// Default FSD layer names
const layers = {
  app: 'app',
  pages: 'pages',
  widgets: 'widgets',
  features: 'features',
  entities: 'entities',
  shared: 'shared',
};

// Special folder name for cross-entity imports
const crossEntitiesFolder = '@x';

// FSD layer import hierarchy rules - each layer can import from layers listed in its array
const rules = {
	app: ['app', 'pages', 'widgets', 'features', 'entities', 'shared'], // App can import from all layers
	pages: ['widgets', 'features', 'entities', 'shared'], // Pages can't import from app, pages
	widgets: ['features', 'entities', 'shared'], // Widgets can't import from app, pages, widgets
	features: ['entities', 'shared'], // Features can't import from app, pages, widgets, features
	entities: ['entities', 'shared'], // Entities can't import from app, pages, widgets, features
	shared: ['shared'], // Shared can only import from itself
};

/**
 * Transforms default layers based on user configuration
 * @param {Object} config - User layer configuration (e.g., {shared: 'shared-layer'})
 * @param {boolean} valueOnly - If true, returns only layer names, not mappings
 * @returns {Object} Transformed layer mappings
 */
function getLayers(config = {}, valueOnly = false) {
	if (Object.keys(config).length === 0) {
		return layers;
	}

	const transformedLayers = {};

  for (const [key, value] of Object.entries(layers)) {
    const newKey = valueOnly ? key : (config[key] || key);
    transformedLayers[newKey] = config[value] || value;
  }

  return transformedLayers;
}

/**
 * Transforms default import rules based on user layer configuration
 * @param {Object} config - User layer configuration
 * @returns {Object} Transformed import rules with custom layer names
 */
function getRules(config = {}) {
	if (Object.keys(config).length === 0) {
		return rules;
	}

  const transformedRules = {};

  for (const [key, values] of Object.entries(rules)) {
    const newKey = config[key] || key;
    transformedRules[newKey] = values.map(value => config[value] || value);
  }

  return transformedRules;
}

module.exports = { getLayers, getRules, crossEntitiesFolder };
