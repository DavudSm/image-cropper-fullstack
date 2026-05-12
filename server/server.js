import express from "express";
import cors from "cors";
import multer from "multer";
import sharp from "sharp";
import fs from "fs";

const app = express();
const PORT = 5000;

const upload = multer({ dest: "uploads/" });

let configs = [];
let nextConfigId = 1;

const allowedLogoPositions = [
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
  "center",
];

app.use(cors());
app.use(express.json());

/* =========================================================
   HELPER FUNKCIJE
========================================================= */

function validateCropRequest(req) {
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
        message: "Slika nije poslana.",
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
        message: "Koordinate moraju biti brojevi.",
      },
    };
  }

  if (cropData.width <= 0 || cropData.height <= 0) {
    return {
      error: {
        status: 400,
        message: "Width i height moraju biti veći od 0.",
      },
    };
  }

  if (cropData.x < 0 || cropData.y < 0) {
    return {
      error: {
        status: 400,
        message: "X i Y ne mogu biti negativni.",
      },
    };
  }

  return {
    cropData,
  };
}

async function validateCropBounds(imagePath, cropData) {
  const metadata = await sharp(imagePath).metadata();

  if (
    cropData.x + cropData.width > metadata.width ||
    cropData.y + cropData.height > metadata.height
  ) {
    return {
      error: {
        status: 400,
        message: "Crop područje izlazi van granica slike.",
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

/* =========================================================
   CONFIG ROUTE
========================================================= */

app.post("/api/config", upload.single("logoImage"), (req, res) => {
  const { scaleDown, logoPosition } = req.body;

  const parsedScaleDown = Number(scaleDown);

  if (Number.isNaN(parsedScaleDown)) {
    return res.status(400).json({
      message: "scaleDown mora biti broj.",
    });
  }

  if (parsedScaleDown <= 0 || parsedScaleDown > 0.25) {
    return res.status(400).json({
      message: "scaleDown mora biti između 0 i 0.25.",
    });
  }

  if (!allowedLogoPositions.includes(logoPosition)) {
    return res.status(400).json({
      message: "Neispravna logo pozicija.",
      allowedPositions: allowedLogoPositions,
    });
  }

  if (!req.file) {
    return res.status(400).json({
      message: "Logo slika je obavezna.",
    });
  }

  const config = {
    id: nextConfigId,
    scaleDown: parsedScaleDown,
    logoPosition,
    logoImagePath: req.file.path,
  };

  configs.push(config);

  nextConfigId++;

  return res.status(201).json({
    message: "Konfiguracija je kreirana.",
    config,
  });
});

/* =========================================================
   UPDATE CONFIG
========================================================= */

app.put("/api/config/:id", (req, res) => {
  const configId = Number(req.params.id);

  const { scaleDown, logoPosition } = req.body;

  const config = configs.find((c) => c.id === configId);

  if (!config) {
    return res.status(404).json({
      message: "Konfiguracija nije pronađena.",
    });
  }

  config.scaleDown = Number(scaleDown);
  config.logoPosition = logoPosition;

  return res.json({
    message: "Konfiguracija je ažurirana.",
    config,
  });
});

/* =========================================================
   PREVIEW
========================================================= */

app.post("/api/image/preview", upload.single("image"), async (req, res) => {
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
      message: "Greška pri obradi preview slike.",
    });
  } finally {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
});

/* =========================================================
   GENERATE
========================================================= */

app.post("/api/image/generate", upload.single("image"), async (req, res) => {
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

    const config = configs[configs.length - 1];

    if (!config) {
      return res.status(400).json({
        message: "Konfiguracija nije kreirana.",
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

    let left;
    let top;

    if (config.logoPosition === "top-left") {
      left = logoMargin;
      top = logoMargin;
    }

    if (config.logoPosition === "top-right") {
      left = croppedMetadata.width - logoMetadata.width - logoMargin;

      top = logoMargin;
    }

    if (config.logoPosition === "bottom-left") {
      left = logoMargin;

      top = croppedMetadata.height - logoMetadata.height - logoMargin;
    }

    if (config.logoPosition === "bottom-right") {
      left = croppedMetadata.width - logoMetadata.width - logoMargin;

      top = croppedMetadata.height - logoMetadata.height - logoMargin;
    }

    if (config.logoPosition === "center") {
      left = Math.round((croppedMetadata.width - logoMetadata.width) / 2);

      top = Math.round((croppedMetadata.height - logoMetadata.height) / 2);
    }

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
      message: "Greška pri obradi generate slike.",
    });
  } finally {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
