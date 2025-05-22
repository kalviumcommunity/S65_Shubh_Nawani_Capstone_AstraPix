import LogoDark from "../assets/AstraPix_Logo_Dark.jpg";
import LogoLight from "../assets/AstraPix_Logo_Light.jpg";

export const updateFavicon = (isDarkMode) => {
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }

  // Create a temporary canvas to round the corners of the favicon
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = new Image();

  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw rounded rectangle
    ctx.beginPath();
    const radius = 8; // Adjust this value for more/less rounding
    ctx.roundRect(0, 0, canvas.width, canvas.height, radius);
    ctx.closePath();
    ctx.clip();

    // Draw the image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Update favicon with rounded image
    link.type = "image/png";
    link.href = canvas.toDataURL();
  };

  img.src = isDarkMode ? LogoDark : LogoLight;
};

export const getLogoSrc = (isDarkMode) => {
  return isDarkMode ? LogoDark : LogoLight;
};
