import sharp from "sharp";

export function validateCropRequest(req) {
  const { x, y, width, height } = req.body;

  const cropData = {
    x: Math.round(Number(x)),
    y: Math.round(Number(y)),
    width: Math.round(Number(width)),
    height: Math.round(Number(height)),
  };

  if (!req.file) {
    return {
      error: {
        status: 400,
        message: "Image was not provided.",
      },
    };
  }

  if (
    Number.isNaN(cropData.x) ||
    Number.isNaN(cropData.y) ||
    Number.isNaN(cropData.width) ||
    Number.isNaN(cropData.height)
  ) {
    return {
      error: {
        status: 400,
        message: "Crop coordinates must be numbers.",
      },
    };
  }

  if (cropData.width <= 0 || cropData.height <= 0) {
    return {
      error: {
        status: 400,
        message: "Width and height must be greater than 0.",
      },
    };
  }

  if (cropData.x < 0 || cropData.y < 0) {
    return {
      error: {
        status: 400,
        message: "X and Y cannot be negative.",
      },
    };
  }

  return { cropData };
}

export async function validateCropBounds(imagePath, cropData) {
  const metadata = await sharp(imagePath).metadata();

  if (
    cropData.x + cropData.width > metadata.width ||
    cropData.y + cropData.height > metadata.height
  ) {
    return {
      error: {
        status: 400,
        message: "Crop area is outside image bounds.",
        imageSize: {
          width: metadata.width,
          height: metadata.height,
        },
        requestedCrop: cropData,
      },
    };
  }

  return { metadata };
}
