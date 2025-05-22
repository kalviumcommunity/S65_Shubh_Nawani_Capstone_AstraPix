import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { updateFavicon } from "../utils/themeUtils";

// Create context with default values
export const ThemeContext = createContext({
  darkMode: false,
  systemTheme: false,
  toggleTheme: () => {},
  setThemePreference: () => {},
  theme: "light",
  logoSize: {},
});

// Custom hook for easier context consumption
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Track if we're following system preference
  const [systemTheme, setSystemTheme] = useState(() => {
    const savedTheme = localStorage.getItem("themePreference");
    return savedTheme === null || savedTheme === "system";
  });

  // Track the actual dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("themePreference");
    const savedMode = localStorage.getItem("theme");

    if (
      savedTheme === "dark" ||
      (savedTheme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches) ||
      savedMode === "dark"
    ) {
      return true;
    }
    if (savedTheme === "light") {
      return false;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Update the UI when dark mode changes
  useEffect(() => {
    updateFavicon(darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");

    // Use a brief timeout to avoid flash of incorrect theme
    const applyTheme = () => {
      if (darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    // Apply immediately and also after a tiny delay to ensure it works
    applyTheme();
    const timeoutId = setTimeout(applyTheme, 0);

    return () => clearTimeout(timeoutId);
  }, [darkMode]);

  // Listen for system theme changes
  useEffect(() => {
    if (!systemTheme) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    // Update theme when system preference changes
    const handleChange = (e) => {
      setDarkMode(e.matches);
    };

    // Add listener with proper compatibility for older browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      // For older browsers
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        // For older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [systemTheme]);

  // Toggle between light and dark mode
  const toggleTheme = useCallback(() => {
    setSystemTheme(false);
    setDarkMode((prev) => {
      const newValue = !prev;
      localStorage.setItem("themePreference", newValue ? "dark" : "light");
      return newValue;
    });
  }, []);

  // Set theme to a specific value (light, dark, or system)
  const setThemePreference = useCallback((preference) => {
    localStorage.setItem("themePreference", preference);

    if (preference === "system") {
      setSystemTheme(true);
      setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    } else {
      setSystemTheme(false);
      setDarkMode(preference === "dark");
    }
  }, []);

  // Calculate current theme string
  const theme = darkMode ? "dark" : "light";

  // Define responsive logo sizes
  const logoSize = {
    sm: {
      height: "48px",
      width: "48px",
    },
    md: {
      height: "64px",
      width: "64px",
    },
    lg: {
      height: "96px",
      width: "96px",
    },
  };

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        systemTheme,
        toggleTheme,
        setThemePreference,
        theme,
        logoSize,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
