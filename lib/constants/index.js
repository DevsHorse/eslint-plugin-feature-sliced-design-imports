const layers = {
  app: 'app',
  pages: 'pages',
  widgets: 'widgets',
  features: 'features',
  entities: 'entities',
  shared: 'shared',
};

const crossEntitiesFolder = '@x';

const rules = {
	app: ['app', 'pages', 'widgets', 'features', 'entities', 'shared'],
	pages: ['widgets', 'features', 'entities', 'shared'],
	widgets: ['features', 'entities', 'shared'],
	features: ['entities', 'shared'],
	entities: ['entities', 'shared'],
	shared: ['shared'],
};


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
