import { useState } from "react";
import { toast } from "react-toastify";

const ConfigForm = ({ onSaveConfig }) => {
  const [logoImage, setLogoImage] = useState(null);
  const [scaleDown, setScaleDown] = useState(0.2);
  const [logoPosition, setLogoPosition] = useState("bottom-right");

  function handleSubmit(event) {
    event.preventDefault();

    if (!logoImage) {
       toast.error("Please select an logo image first.");
      return;
    }

    onSaveConfig({
      logoImage,
      scaleDown,
      logoPosition,
    });
  }

  return (
    <section className="card">
      <h2>Logo configuration</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label>
            Logo image:
            <input
              type="file"
              accept="image/png"
              onChange={(event) => {
                setLogoImage(event.target.files[0]);
                toast.success("Logo image uploaded successfully.");
              }}
            />
          </label>
        </div>

        <div className="form-row">
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

        <div className="form-row">
          <label>
            Logo position:
            <select
              value={logoPosition}
              onChange={(event) => setLogoPosition(event.target.value)}
              style={{
                backgroundColor: "#1e293b",
                color: "white",
                padding: "10px 12px",
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
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
