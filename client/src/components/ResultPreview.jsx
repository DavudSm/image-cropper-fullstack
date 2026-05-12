const ResultPreview = ({ title, image, width }) => {
  if (!image) {
    return null;
  }

  return (
    <section style={{ marginBottom: "20px" }}>
      <h2>{title}</h2>

      <img
        src={image}
        alt={title}
        style={{
          width: width || "400px",
          border: "1px solid #ccc",
          display: "block",
        }}
      />
    </section>
  );
};

export default ResultPreview;
