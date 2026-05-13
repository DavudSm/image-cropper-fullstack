const ResultPreview = ({ title, image, className = "result-image" }) => {
  if (!image) {
    return null;
  }

  return (
    <section className="card">
      <h2>{title}</h2>

      <img
        src={image}
        alt={title}
        className={className}
        style={{
          maxWidth: className === "backend-preview-image" ? "150px" : "650px",
          width: "100%",
          height: "auto",
          display: "block",
          margin: "18px auto 0",
          borderRadius: "14px",
        }}
      />
    </section>
  );
};

export default ResultPreview;
