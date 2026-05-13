export function getLogoPosition({
  logoPosition,
  croppedMetadata,
  logoMetadata,
  logoMargin,
}) {
  let left;
  let top;

  if (logoPosition === "top-left") {
    left = logoMargin;
    top = logoMargin;
  }

  if (logoPosition === "top-right") {
    left = croppedMetadata.width - logoMetadata.width - logoMargin;
    top = logoMargin;
  }

  if (logoPosition === "bottom-left") {
    left = logoMargin;
    top = croppedMetadata.height - logoMetadata.height - logoMargin;
  }

  if (logoPosition === "bottom-right") {
    left = croppedMetadata.width - logoMetadata.width - logoMargin;
    top = croppedMetadata.height - logoMetadata.height - logoMargin;
  }

  if (logoPosition === "center") {
    left = Math.round((croppedMetadata.width - logoMetadata.width) / 2);
    top = Math.round((croppedMetadata.height - logoMetadata.height) / 2);
  }

  return { left, top };
}
