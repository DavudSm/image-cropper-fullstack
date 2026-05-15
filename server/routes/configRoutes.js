import express from "express";
import upload from "../middleware/uploads.js";

import {
  createConfigController,
  updateConfigController,
  getConfigsController,
} from "../controllers/configController.js";

import { checkJwt } from "../middleware/auth.js";

const router = express.Router();



router.get("/", checkJwt, getConfigsController);

router.post("/", checkJwt, upload.single("logoImage"), createConfigController);

router.put("/:id", checkJwt, updateConfigController);

export default router;
