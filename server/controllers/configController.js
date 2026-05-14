import prisma from "../lib/prisma.js";

const allowedLogoPositions = [
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
  "center",
];

export async function createConfigController(req, res) {
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

  const config = await prisma.config.create({
    data: {
      scaleDown: parsedScaleDown,
      logoPosition,
      logoImagePath: req.file.path,
    },
  });

  return res.status(201).json({
    message: "Configuration created successfully.",
    config,
  });
}

export async function updateConfigController(req, res) {
  const configId = Number(req.params.id);

  const { scaleDown, logoPosition } = req.body;

  const config = await prisma.config.findUnique({
    where: {
      id: configId,
    },
  });

  if (!config) {
    return res.status(404).json({
      message: "Configuration not found.",
    });
  }

  const updatedConfig = await prisma.config.update({
    where: {
      id: configId,
    },
    data: {
      scaleDown: Number(scaleDown),
      logoPosition,
    },
  });

  return res.json({
    message: "Configuration updated successfully.",
    updatedConfig,
  });
}

export async function getConfigsController(req, res) {
  const configs = await prisma.config.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return res.json({
    configs,
  });
}