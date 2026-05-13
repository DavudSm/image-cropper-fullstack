import { createConfig, findConfigById } from "../data/configStore.js";

const allowedLogoPositions = [
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
  "center",
];

export function createConfigController(req, res) {
  const { scaleDown, logoPosition } = req.body;

  const parsedScaleDown = Number(scaleDown);

  if (Number.isNaN(parsedScaleDown)) {
    return res.status(400).json({
      message: "scaleDown must be a number.",
    });
  }

  if (parsedScaleDown <= 0 || parsedScaleDown > 0.25) {
    return res.status(400).json({
      message: "scaleDown must be between 0 and 0.25.",
    });
  }

  if (!allowedLogoPositions.includes(logoPosition)) {
    return res.status(400).json({
      message: "Invalid logo position.",
      allowedPositions: allowedLogoPositions,
    });
  }

  if (!req.file) {
    return res.status(400).json({
      message: "Logo image is required.",
    });
  }

  const config = createConfig({
    scaleDown: parsedScaleDown,
    logoPosition,
    logoImagePath: req.file.path,
  });

  return res.status(201).json({
    message: "Configuration created successfully.",
    config,
  });
}

export function updateConfigController(req, res) {
  const configId = Number(req.params.id);

  const { scaleDown, logoPosition } = req.body;

  const config = findConfigById(configId);

  if (!config) {
    return res.status(404).json({
      message: "Configuration not found.",
    });
  }

  config.scaleDown = Number(scaleDown);
  config.logoPosition = logoPosition;

  return res.json({
    message: "Configuration updated successfully.",
    config,
  });
}
