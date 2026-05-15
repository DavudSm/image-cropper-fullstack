import express from "express";
import upload from "../middleware/uploads.js";
import { checkJwt } from "../middleware/auth.js";

import {
  previewImageController,
  generateImageController,
} from "../controllers/imageController.js";

const router = express.Router();

router.post(
  "/preview",
  checkJwt,
  upload.single("image"),
  previewImageController,
);

router.post(
  "/generate",
  checkJwt,
  upload.single("image"),
  generateImageController,
);

export default router;
