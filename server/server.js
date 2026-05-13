import express from "express";
import cors from "cors";

import upload from "./middleware/uploads.js";

import {
  createConfigController,
  updateConfigController,
} from "./controllers/configController.js";

import {
  previewImageController,
  generateImageController,
} from "./controllers/imageController.js";

import configRoutes from "./routes/configRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/api/config", configRoutes);

app.use("/api/image", imageRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
