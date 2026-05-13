const ActionButtons = ({
  onPreview,
  onGenerate,
  onDownload,
  generatedImage,
}) => {
  return (
    <section className="button-group">
      <button onClick={onPreview}>Show Preview</button>

      <button onClick={onGenerate}>Generate</button>

      {generatedImage && <button onClick={onDownload}>Download Image</button>}
    </section>
  );
};

export default ActionButtons;
