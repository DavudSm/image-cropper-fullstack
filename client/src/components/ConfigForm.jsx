import { useState } from "react";

const ConfigForm = ({ onSaveConfig }) => {
  const [logoImage, setLogoImage] = useState(null);
  const [scaleDown, setScaleDown] = useState(0.2);
  const [logoPosition, setLogoPosition] = useState("bottom-right");

  function handleSubmit(event) {
    event.preventDefault();

    if (!logoImage) {
      alert("Prvo odaberi logo sliku.");
      return;
    }

    onSaveConfig({
      logoImage,
      scaleDown,
      logoPosition,
    });
  }

  return (
    <section style={{ marginBottom: "20px" }}>
      <h2>Logo configuration</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Logo image:{" "}
            <input
              type="file"
              accept="image/png"
              onChange={(event) => setLogoImage(event.target.files[0])}
            />
          </label>
        </div>

        <div>
          <label>
            Scale down:
            <input
              type="number"
              step="0.01"
              min="0.01"
              max="0.25"
              value={scaleDown}
              onChange={(event) => setScaleDown(event.target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            Logo position:
            <select
              value={logoPosition}
              onChange={(event) => setLogoPosition(event.target.value)}
            >
              <option value="top-left">Top left</option>
              <option value="top-right">Top right</option>
              <option value="bottom-left">Bottom left</option>
              <option value="bottom-right">Bottom right</option>
              <option value="center">Center</option>
            </select>
          </label>
        </div>

        <button type="submit">Save Config</button>
      </form>
    </section>
  );
};

export default ConfigForm;
