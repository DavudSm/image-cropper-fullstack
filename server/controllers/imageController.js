import sharp from "sharp";
import fs from "fs";

import { validateCropRequest, validateCropBounds } from "../utils/cropUtils.js";

import prisma from "../lib/prisma.js";

import { getLogoPosition } from "../utils/logoUtils.js";

export async function previewImageController(req, res) {
  try {
    const { cropData, error } = validateCropRequest(req);

    if (error) {
      return res.status(error.status).json({
        message: error.message,
      });
    }

    const boundsValidation = await validateCropBounds(req.file.path, cropData);

    if (boundsValidation.error) {
      return res
        .status(boundsValidation.error.status)
        .json(boundsValidation.error);
    }

    const croppedImage = await sharp(req.file.path)
      .extract({
        left: cropData.x,
        top: cropData.y,
        width: cropData.width,
        height: cropData.height,
      })
      .resize({
        width: Math.round(cropData.width * 0.05),
        height: Math.round(cropData.height * 0.05),
      })
      .png()
      .toBuffer();

    res.set("Content-Type", "image/png");

    return res.send(croppedImage);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Error while generating preview image.",
    });
  } finally {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
}

export async function generateImageController(req, res) {
  try {
    const { cropData, error } = validateCropRequest(req);

    if (error) {
      return res.status(error.status).json({
        message: error.message,
      });
    }

    const boundsValidation = await validateCropBounds(req.file.path, cropData);

    if (boundsValidation.error) {
      return res
        .status(boundsValidation.error.status)
        .json(boundsValidation.error);
    }

    
const { configId } = req.body;

let config;

const userId = req.auth.payload.sub;

if (configId) {
  config = await prisma.config.findFirst({
    where: {
      id: Number(configId),
      userId,
    },
  });
} else {
  config = await prisma.config.findFirst({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
    if (!config) {
      return res.status(400).json({
        message: "Configuration has not been created.",
      });
    }

    const croppedImage = await sharp(req.file.path)
      .extract({
        left: cropData.x,
        top: cropData.y,
        width: cropData.width,
        height: cropData.height,
      })
      .png()
      .toBuffer();

    const croppedMetadata = await sharp(croppedImage).metadata();

    const logoWidth = Math.round(croppedMetadata.width * config.scaleDown);

    const resizedLogoBuffer = await sharp(config.logoImagePath)
      .resize({
        width: logoWidth,
      })
      .png()
      .toBuffer();

    const logoMetadata = await sharp(resizedLogoBuffer).metadata();

    const logoMargin = 20;

    const { left, top } = getLogoPosition({
      logoPosition: config.logoPosition,
      croppedMetadata,
      logoMetadata,
      logoMargin,
    });

    const finalImage = await sharp(croppedImage)
      .composite([
        {
          input: resizedLogoBuffer,
          left,
          top,
        },
      ])
      .png()
      .toBuffer();

    res.set("Content-Type", "image/png");

    return res.send(finalImage);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Error while generating final image.",
    });
  } finally {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
}
