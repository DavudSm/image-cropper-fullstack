export const createImageFormData = (image, crop) => {
  const formData = new FormData();

  formData.append("image", image);
  formData.append("x", crop.x);
  formData.append("y", crop.y);
  formData.append("width", crop.width);
  formData.append("height", crop.height);

  return formData;
};

export const previewImage = async (formData) => {
  const response = await fetch("http://localhost:5000/api/image/preview", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(errorData.message || "Greška pri preview obradi.");
  }

  return await response.blob();
};

export const generateImage = async (formData) => {
  const response = await fetch("http://localhost:5000/api/image/generate", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(errorData.message || "Greška pri generate obradi.");
  }

  return await response.blob();
};

export const createConfigFormData = ({
  logoImage,
  scaleDown,
  logoPosition,
}) => {
  const formData = new FormData();

  formData.append("logoImage", logoImage);
  formData.append("scaleDown", scaleDown);
  formData.append("logoPosition", logoPosition);

  return formData;
};

export const saveConfig = async (formData) => {
  const response = await fetch("http://localhost:5000/api/config", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(errorData.message || "Greška pri čuvanju konfiguracije.");
  }

  return await response.json();
};
