const ImageUploader = ({ onImageChange }) => {
  return (
    <section style={{ marginBottom: "20px" }}>
      <label>
        Upload image:{" "}
        <input type="file" accept="image/*" onChange={onImageChange} />
      </label>
    </section>
  );
};

export default ImageUploader;
