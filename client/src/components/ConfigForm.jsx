import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ConfigForm = ({
  onSaveConfig,
  configs,
  selectedConfigId,
  setSelectedConfigId,
}) => {
  const [logoImage, setLogoImage] = useState(null);
  const [scaleDown, setScaleDown] = useState(0.2);
  const [logoPosition, setLogoPosition] = useState("bottom-right");

  useEffect(() => {
    if (!selectedConfigId) {
      setScaleDown(0.2);
      setLogoPosition("bottom-right");
      setLogoImage(null);
      return;
    }

    const selectedConfig = configs.find(
      (config) => String(config.id) === String(selectedConfigId),
    );

    if (!selectedConfig) return;

    setScaleDown(selectedConfig.scaleDown);
    setLogoPosition(selectedConfig.logoPosition);
    setLogoImage(null);
  }, [selectedConfigId, configs]);

  function handleSubmit(event) {
    event.preventDefault();

    if (!selectedConfigId && !logoImage) {
      toast.error("Please select a logo image first.");
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

      {configs.length > 0 && (
        <div className="form-row">
          <label>
            Existing configs:
            <select
              value={selectedConfigId}
              onChange={(event) => setSelectedConfigId(event.target.value)}
              style={{
                backgroundColor: "#1e293b",
                color: "white",
                padding: "10px 12px",
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <option value="">Create new config / Use latest config</option>

              {configs.map((config) => (
                <option key={config.id} value={config.id}>
                  {config.logoPosition} | scale {config.scaleDown}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {!selectedConfigId && (
          <div className="form-row">
            <label>
              Logo image:
              <input
                type="file"
                accept="image/png"
                onChange={(event) => {
                  const file = event.target.files[0];

                  if (!file) return;

                  setLogoImage(file);
                  toast.success("Logo image uploaded successfully.");
                }}
              />
            </label>
          </div>
        )}

        {selectedConfigId && (
          <p className="status-message">
            Updating selected config. Existing logo will be kept.
          </p>
        )}

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

        <button type="submit">
          {selectedConfigId ? "Update Config" : "Save Config"}
        </button>
      </form>
    </section>
  );
};

export default ConfigForm;
