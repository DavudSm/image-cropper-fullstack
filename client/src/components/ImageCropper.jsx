import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const ImageCropper = ({ imagePreview, crop, setCrop, setImageElement }) => {
  if (!imagePreview) return null;

  return (
    <section className="card">
      <h2>Select crop area</h2>

      <div
        className="crop-wrapper"
        style={{
          width: "650px",
          maxWidth: "100%",
          margin: "0 auto",
        }}
      >
        <ReactCrop
          crop={crop}
          onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
        >
          <img
            src={imagePreview}
            alt="Selected preview"
            onLoad={(event) => setImageElement(event.currentTarget)}
            className="cropper-image"
          />
        </ReactCrop>
      </div>

      <p className="crop-info">
        Crop: x={Math.round(crop.x)}%, y={Math.round(crop.y)}%, width=
        {Math.round(crop.width)}%, height={Math.round(crop.height)}%
      </p>
    </section>
  );
};

export default ImageCropper;
