import express from "express";
import upload from "../middleware/uploads.js";

import {
  createConfigController,
  updateConfigController,
} from "../controllers/configController.js";

const router = express.Router();

router.post("/", upload.single("logoImage"), createConfigController);

router.put("/:id", updateConfigController);

export default router;
