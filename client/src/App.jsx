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
  getConfigs,
  updateConfig,
} from "./api/imageApi";
import { getRealCrop } from "./utils/cropUtils";
import ConfigForm from "./components/ConfigForm";
import "./index.css";
import { ToastContainer, toast } from "react-toastify";

import { useState, useEffect } from "react";

import { useAuth0 } from "@auth0/auth0-react";

function App() {

  const {
    loginWithRedirect,
    logout,
    isAuthenticated,
    user,
    isLoading,
    getAccessTokenSilently,
  } = useAuth0();

  

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

  const [configs, setConfigs] = useState([]);
  const [selectedConfigId, setSelectedConfigId] = useState("");


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
    const token = await getAccessTokenSilently();

    let result;

    if (selectedConfigId) {
      result = await updateConfig(selectedConfigId, configData, token);

      setConfigMessage(`Config updated. ID: ${result.config.id}`);
      toast.success("Config updated successfully.");
    } else {
      const formData = createConfigFormData(configData);
      result = await saveConfig(formData, token);

      setSelectedConfigId(String(result.config.id));
      setConfigMessage(`Config saved. ID: ${result.config.id}`);
      toast.success("Logo config saved successfully.");
    }

    await loadConfigs();
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
   const token = await getAccessTokenSilently();

   const imageBlob = await previewImage(formData, token);

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
    const formData = createImageFormData(image, realCrop, selectedConfigId);
    const token = await getAccessTokenSilently();

    const imageBlob = await generateImage(formData, token);

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


async function loadConfigs() {
  try {
    const token = await getAccessTokenSilently();
    const data = await getConfigs(token);

    setConfigs(data.configs);
  } catch (error) {
    toast.error(error.message);
  }
}

  useEffect(() => {
    if (isAuthenticated) {
      loadConfigs();
    }
  }, [isAuthenticated]);

    if (isLoading) {
      return <p>Loading authentication...</p>;
    }

if (!isAuthenticated) {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-badge">Fullstack Image Tool</div>

        <h1 className="auth-title">Image Cropper App</h1>

        <p className="auth-description">
          Upload, crop, preview and generate branded images with saved logo
          configurations.
        </p>

        <div className="auth-preview">
          <div className="preview-frame">
            <div className="preview-image-shape">
              <span>Crop Area</span>
            </div>

            <div className="logo-chip">Logo</div>
          </div>
        </div>

        <div className="auth-stack">
          React • Express • Prisma • PostgreSQL • Docker
        </div>

        <button
          className="auth-login-button"
          onClick={() => loginWithRedirect()}
        >
          Login with Auth0
        </button>
      </section>
    </main>
  );
}



  return (
    <main className="app">
      <h1 className="app-title">Image Cropper App</h1>
      <div style={{ marginBottom: "20px" }}>
        <p>Logged in as: {user?.name}</p>

        <button
          onClick={() =>
            logout({
              logoutParams: {
                returnTo: window.location.origin,
              },
            })
          }
        >
          Logout
        </button>
      </div>
      <ConfigForm
        onSaveConfig={handleSaveConfig}
        configs={configs}
        selectedConfigId={selectedConfigId}
        setSelectedConfigId={setSelectedConfigId}
      />

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
