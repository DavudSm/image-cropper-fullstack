const ImageUploader = ({ onImageChange }) => {
  return (
    <section className="card">
      <h2>Upload Image</h2>

      <div className="form-row">
        <label>
          Select image:
          <input type="file" accept="image/*" onChange={onImageChange} />
        </label>
      </div>
    </section>
  );
};

export default ImageUploader;
