import prisma from "../lib/prisma.js";

let configs = [];
let nextConfigId = 1;

const config = await prisma.config.create({
  data: {
    scaleDown: parsedScaleDown,
    logoPosition,
    logoImagePath: req.file.path,
  },
});

export function findConfigById(id) {
  return configs.find((config) => config.id === id);
}

export function getLatestConfig() {
  return configs[configs.length - 1];
}
