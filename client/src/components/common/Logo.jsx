import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { getLogoSrc } from '../../utils/themeUtils';

const Logo = ({ className = "", width = "3rem", height = "3rem", alt = "AstraPix Logo" }) => {
  const { darkMode } = useContext(ThemeContext);
  
  return (
    <img 
      src={getLogoSrc(darkMode)}
      alt={alt}
      className={`rounded-lg transition-all duration-300 ${className}`}
      style={{ 
        width, 
        height,
        filter: darkMode ? 'brightness(1.1)' : 'none',
        objectFit: 'contain'
      }}
    />
  );
};

export default Logo;