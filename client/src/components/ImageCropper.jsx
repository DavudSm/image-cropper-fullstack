import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const ImageCropper = ({ imagePreview, crop, setCrop, setImageElement }) => {
  if (!imagePreview) {
    return null;
  }

  return (
    <section style={{ marginBottom: "20px" }}>
      <h2>Select crop area</h2>

      <div style={{ display: "inline-block" }}>
        <ReactCrop
          crop={crop}
          onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
        >
          <img
            src={imagePreview}
            alt="Selected preview"
            onLoad={(event) => setImageElement(event.currentTarget)}
            style={{
              maxWidth: "500px",
              display: "block",
            }}
          />
        </ReactCrop>
      </div>

      <p>
        Crop: x={Math.round(crop.x)}%, y={Math.round(crop.y)}%, width=
        {Math.round(crop.width)}%, height={Math.round(crop.height)}%
      </p>
    </section>
  );
};

export default ImageCropper;
