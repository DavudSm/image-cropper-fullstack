import express from "express";
import upload from "../middleware/uploads.js";

import {
  previewImageController,
  generateImageController,
} from "../controllers/imageController.js";

const router = express.Router();

router.post("/preview", upload.single("image"), previewImageController);

router.post("/generate", upload.single("image"), generateImageController);

export default router;
