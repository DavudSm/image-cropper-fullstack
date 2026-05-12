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

    if (!selectedFile) {
      return;
    }

    setImage(selectedFile);

    /*
      URL.createObjectURL pravi privremeni lokalni URL za odabrani fajl.
      To nije upload na backend; to je samo lokalni preview u browseru.
    */
    const previewUrl = URL.createObjectURL(selectedFile);
    setImagePreview(previewUrl);

    /*
      Kada korisnik izabere novu sliku, resetujemo stare rezultate.
    */
    setPreviewResult(null);
    setGeneratedImage(null);

    /*
      Postavljamo početni crop na 50% slike.
    */
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
    } catch (error) {
      alert(error.message);
    }
  }



 async function handlePreview() {
   if (!image) {
     alert("Prvo odaberi sliku.");
     return;
   }

const realCrop = getRealCrop(imageElement, crop);
   if (!realCrop) {
     alert("Prvo označi crop područje.");
     return;
   }

   try {
     const formData = createImageFormData(image, realCrop);
     const imageBlob = await previewImage(formData);

     const imageUrl = URL.createObjectURL(imageBlob);
     setPreviewResult(imageUrl);
   } catch (error) {
     alert(error.message);
   }
 }

 async function handleGenerate() {
   if (!image) {
     alert("Prvo odaberi sliku.");
     return;
   }

const realCrop = getRealCrop(imageElement, crop);
   if (!realCrop) {
     alert("Prvo označi crop područje.");
     return;
   }

   try {
     const formData = createImageFormData(image, realCrop);
     const imageBlob = await generateImage(formData);

     const imageUrl = URL.createObjectURL(imageBlob);
     setGeneratedImage(imageUrl);
   } catch (error) {
     alert(error.message);
   }
 }

 function handleDownload() {
   if (!generatedImage) {
     alert("Prvo generiši sliku.");
     return;
   }

   const link = document.createElement("a");
   link.href = generatedImage;
   link.download = "cropped-image.png";
   link.click();
 }

  return (
    <main style={{ padding: "24px", fontFamily: "Arial, sans-serif" }}>
      <h1>Image Cropper App</h1>

      <ConfigForm onSaveConfig={handleSaveConfig} />

      {configMessage && <p>{configMessage}</p>}

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
        width="150px"
      />

      <ResultPreview
        title="Generated Image"
        image={generatedImage}
        width="400px"
      />
    </main>
  );
}

export default App;
