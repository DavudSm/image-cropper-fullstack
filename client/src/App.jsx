import { useState } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

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

  /*
    Ova funkcija se pokreće kada korisnik izabere glavnu sliku.
  */
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

  /*
    ReactCrop radi nad prikazanom slikom u browseru.
    Backend, međutim, cropuje originalnu sliku.

    Zato moramo procente iz croppera pretvoriti u stvarne piksele originalne slike.
    Ako je crop.width = 50, to znači 50% originalne širine slike.
  */
  function getRealCrop() {
    if (!imageElement || !crop.width || !crop.height) {
      return null;
    }

    return {
      x: Math.round((crop.x / 100) * imageElement.naturalWidth),
      y: Math.round((crop.y / 100) * imageElement.naturalHeight),
      width: Math.round((crop.width / 100) * imageElement.naturalWidth),
      height: Math.round((crop.height / 100) * imageElement.naturalHeight),
    };
  }

  /*
    Ova pomoćna funkcija pravi FormData objekat.
    FormData koristimo zato što šaljemo i fajl i obične tekstualne podatke.
    To je isto ono što smo ručno radili u Postmanu kroz form-data.
  */
  function createImageFormData(realCrop) {
    const formData = new FormData();

    formData.append("image", image);
    formData.append("x", realCrop.x);
    formData.append("y", realCrop.y);
    formData.append("width", realCrop.width);
    formData.append("height", realCrop.height);

    return formData;
  }

  /*
    Poziva backend preview endpoint.
    Backend vraća malu cropovanu PNG sliku, skaliranu na 5%.
  */
  async function handlePreview() {
    if (!image) {
      alert("Prvo odaberi sliku.");
      return;
    }

    const realCrop = getRealCrop();

    if (!realCrop) {
      alert("Prvo označi crop područje.");
      return;
    }

    const formData = createImageFormData(realCrop);

    const response = await fetch("http://localhost:5000/api/image/preview", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(errorData.message || "Greška pri preview obradi slike.");
      return;
    }

    const imageBlob = await response.blob();
    const imageUrl = URL.createObjectURL(imageBlob);

    setPreviewResult(imageUrl);
  }

  /*
    Poziva backend generate endpoint.
    Backend vraća finalnu cropovanu PNG sliku, u punoj kvaliteti, sa logo overlay-em.
    Važno: prije ovoga mora biti kreirana konfiguracija na /api/config.
  */
  async function handleGenerate() {
    if (!image) {
      alert("Prvo odaberi sliku.");
      return;
    }

    const realCrop = getRealCrop();

    if (!realCrop) {
      alert("Prvo označi crop područje.");
      return;
    }

    const formData = createImageFormData(realCrop);

    const response = await fetch("http://localhost:5000/api/image/generate", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(errorData.message || "Greška pri generisanju slike.");
      return;
    }

    const imageBlob = await response.blob();
    const imageUrl = URL.createObjectURL(imageBlob);

    setGeneratedImage(imageUrl);
  }

  /*
    Download funkcija pravi privremeni <a> element i programatski klikne na njega.
    Tako korisnik može preuzeti finalnu generisanu sliku.
  */
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

      <section style={{ marginBottom: "20px" }}>
        <label>
          Upload image:{" "}
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>
      </section>

      {imagePreview && (
        <section style={{ marginBottom: "20px" }}>
          <h2>Select crop area</h2>

          <ReactCrop
            crop={crop}
            onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
          >
            <img
              ref={(img) => setImageElement(img)}
              src={imagePreview}
              alt="Selected preview"
              style={{
                maxWidth: "500px",
                marginTop: "10px",
                display: "block",
              }}
            />
          </ReactCrop>

          <p>
            Crop: x={Math.round(crop.x)}%, y={Math.round(crop.y)}%, width=
            {Math.round(crop.width)}%, height={Math.round(crop.height)}%
          </p>
        </section>
      )}

      <section style={{ marginBottom: "20px" }}>
        <button onClick={handlePreview}>Show Preview</button>
        <button onClick={handleGenerate} style={{ marginLeft: "10px" }}>
          Generate
        </button>
      </section>

      {previewResult && (
        <section style={{ marginBottom: "20px" }}>
          <h2>Backend Preview</h2>
          <img
            src={previewResult}
            alt="Backend preview"
            style={{
              width: "150px",
              border: "1px solid #ccc",
            }}
          />
        </section>
      )}

      {generatedImage && (
        <section>
          <h2>Generated Image</h2>
          <img
            src={generatedImage}
            alt="Generated result"
            style={{
              maxWidth: "400px",
              display: "block",
              marginBottom: "10px",
            }}
          />

          <button onClick={handleDownload}>Download Image</button>
        </section>
      )}
    </main>
  );
}

export default App;
