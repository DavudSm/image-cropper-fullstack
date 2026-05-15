export const createImageFormData = (image, crop, configId) => {
  const formData = new FormData();

  formData.append("image", image);
  formData.append("x", crop.x);
  formData.append("y", crop.y);
  formData.append("width", crop.width);
  formData.append("height", crop.height);

  if (configId) {
    formData.append("configId", configId);
  }

  return formData;
};

export const previewImage = async (formData, token) => {
  const response = await fetch("http://localhost:5000/api/image/preview", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error while generating preview.");
  }

  return await response.blob();
};

export const generateImage = async (formData, token) => {
  const response = await fetch("http://localhost:5000/api/image/generate", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error while generating image.");
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

export const saveConfig = async (formData, token) => {
  const response = await fetch("http://localhost:5000/api/config", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error while saving configuration.");
  }

  return await response.json();
};

export const updateConfig = async (configId, configData, token) => {
  const response = await fetch(`http://localhost:5000/api/config/${configId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      scaleDown: configData.scaleDown,
      logoPosition: configData.logoPosition,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error while updating configuration.");
  }

  return await response.json();
};

export const getConfigs = async (token) => {
  const response = await fetch("http://localhost:5000/api/config", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error while loading configurations.");
  }

  return await response.json();
};

