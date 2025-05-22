import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { getLogoSrc } from "../../utils/themeUtils";

const Logo = ({
  className = "",
  width = "3rem",
  height = "3rem",
  alt = "AstraPix Logo",
}) => {
  const { darkMode, logoSize } = useContext(ThemeContext);

  // Determine responsive size if no width/height provided
  const responsiveWidth =
    width === "3rem" ? (window.innerWidth < 640 ? "2rem" : "3rem") : width;
  const responsiveHeight =
    height === "3rem" ? (window.innerWidth < 640 ? "2rem" : "3rem") : height;

  return (
    <img
      src={getLogoSrc(darkMode)}
      alt={alt}
      className={`rounded-lg transition-all duration-300 ${className}`}
      style={{
        width: responsiveWidth,
        height: responsiveHeight,
        filter: darkMode ? "brightness(1.1)" : "none",
        objectFit: "contain",
      }}
      loading="lazy"
    />
  );
};

export default Logo;
