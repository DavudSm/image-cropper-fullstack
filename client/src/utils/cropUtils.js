export const getRealCrop = (imageElement, crop) => {
  if (!imageElement || !crop.width || !crop.height) {
    return null;
  }

  return {
    x: Math.round((crop.x / 100) * imageElement.naturalWidth),
    y: Math.round((crop.y / 100) * imageElement.naturalHeight),
    width: Math.round((crop.width / 100) * imageElement.naturalWidth),
    height: Math.round((crop.height / 100) * imageElement.naturalHeight),
  };
};
