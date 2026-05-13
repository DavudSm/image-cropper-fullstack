let configs = [];
let nextConfigId = 1;

export function createConfig({ scaleDown, logoPosition, logoImagePath }) {
  const config = {
    id: nextConfigId,
    scaleDown,
    logoPosition,
    logoImagePath,
  };

  configs.push(config);
  nextConfigId++;

  return config;
}

export function findConfigById(id) {
  return configs.find((config) => config.id === id);
}

export function getLatestConfig() {
  return configs[configs.length - 1];
}
