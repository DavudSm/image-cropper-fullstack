const ActionButtons = ({
  onPreview,
  onGenerate,
  onDownload,
  generatedImage,
}) => {
  return (
    <section style={{ marginBottom: "20px" }}>
      <button onClick={onPreview}>Show Preview</button>

      <button onClick={onGenerate} style={{ marginLeft: "10px" }}>
        Generate
      </button>

      {generatedImage && (
        <button onClick={onDownload} style={{ marginLeft: "10px" }}>
          Download Image
        </button>
      )}
    </section>
  );
};

export default ActionButtons;
