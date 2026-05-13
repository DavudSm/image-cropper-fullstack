import { useState } from "react";
import ImageUploader from "./components/ImageUploader";
import ImageCropper from "./components/ImageCropper";
import ActionButtons from "./components/ActionButtons";
import ResultPreview from "./components/ResultPreview";
import {
  createImageFormData,
  previewImage,
  generateImage,
  createConfigFormData,
  saveConfig,
} from "./api/imageApi";
import { getRealCrop } from "./utils/cropUtils";
import ConfigForm from "./components/ConfigForm";
import "./index.css";
import { ToastContainer, toast } from "react-toastify";

function App() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [previewResult, setPreviewResult] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [imageElement, setImageElement] = useState(null);

  const [crop, setCrop] = useState({
    unit: "%",
    x: 0,
    y: 0,
    width: 50,
    height: 50,
  });

  const [configMessage, setConfigMessage] = useState("");

  function handleImageChange(event) {
    const selectedFile = event.target.files[0];

    if (!selectedFile) return;

    setImage(selectedFile);

    const previewUrl = URL.createObjectURL(selectedFile);
    setImagePreview(previewUrl);
    toast.success("Image uploaded successfully.");

    setPreviewResult(null);
    setGeneratedImage(null);

    setCrop({
      unit: "%",
      x: 0,
      y: 0,
      width: 50,
      height: 50,
    });
  }

async function handleSaveConfig(configData) {
  try {
    const formData = createConfigFormData(configData);
    const result = await saveConfig(formData);

    setConfigMessage(`Config saved. ID: ${result.config.id}`);
    toast.success("Logo config saved successfully.");
  } catch (error) {
    toast.error(error.message);
  }
}

async function handlePreview() {
  if (!image) {
    toast.error("Please select an image first.");
    return;
  }

  const realCrop = getRealCrop(imageElement, crop);

  if (!realCrop) {
    toast.error("Please select a crop area first.");
    return;
  }

  try {
    const formData = createImageFormData(image, realCrop);
    const imageBlob = await previewImage(formData);

    const imageUrl = URL.createObjectURL(imageBlob);
    setPreviewResult(imageUrl);
    toast.success("Preview generated successfully.");
  } catch (error) {
    toast.error(error.message);
  }
}

async function handleGenerate() {
  if (!image) {
    toast.error("Please select an image first.");
    return;
  }

  const realCrop = getRealCrop(imageElement, crop);

  if (!realCrop) {
    toast.error("Please select a crop area first.");
    return;
  }

  try {
    const formData = createImageFormData(image, realCrop);
    const imageBlob = await generateImage(formData);

    const imageUrl = URL.createObjectURL(imageBlob);
    setGeneratedImage(imageUrl);
    toast.success("Image generated successfully.");
  } catch (error) {
    toast.error(error.message);
  }
}
function handleDownload() {
  if (!generatedImage) {
    toast.error("Please generate an image first.");
    return;
  }

  const link = document.createElement("a");
  link.href = generatedImage;
  link.download = "cropped-image.png";
  link.click();

  toast.success("Image downloaded successfully.");
}
  return (
    <main className="app">
      <h1 className="app-title">Image Cropper App</h1>

      <ConfigForm onSaveConfig={handleSaveConfig} />

      {configMessage && <p className="status-message">{configMessage}</p>}

      <ImageUploader onImageChange={handleImageChange} />

      <ImageCropper
        imagePreview={imagePreview}
        crop={crop}
        setCrop={setCrop}
        setImageElement={setImageElement}
      />

      <ActionButtons
        onPreview={handlePreview}
        onGenerate={handleGenerate}
        onDownload={handleDownload}
        generatedImage={generatedImage}
      />

      <ResultPreview
        title="Backend Preview"
        image={previewResult}
        className="backend-preview-image"
      />

      <ResultPreview
        title="Generated Image"
        image={generatedImage}
        className="result-image"
      />

      <ToastContainer position="top-right" theme="dark" />
    </main>
  );
}

export default App;
