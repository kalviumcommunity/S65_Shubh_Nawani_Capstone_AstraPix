import { createContext, useState, useEffect } from 'react';
import { updateFavicon } from '../utils/themeUtils';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    updateFavicon(darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  // Define default logo sizes
  const logoSize = {
    height: '64px',
    width: '64px'
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme, logoSize }}>
      {children}
    </ThemeContext.Provider>
  );
};