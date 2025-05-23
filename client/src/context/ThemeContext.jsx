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
  darkMode: false, // Initial context default, actual state managed by Provider
  systemTheme: false,
  toggleTheme: () => {},
  setThemePreference: () => {},
  theme: "light",
  logoSize: {},
});

// Custom hook for easier context consumption
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Helper to get initial preference, defaulting to 'dark'
  const getInitialPreference = () => {
    const savedPreference = localStorage.getItem("themePreference");
    if (
      savedPreference === "light" ||
      savedPreference === "dark" ||
      savedPreference === "system"
    ) {
      return savedPreference;
    }
    // Default to 'dark' if no valid preference is stored
    // and persist this default choice.
    localStorage.setItem("themePreference", "dark");
    return "dark";
  };

  const initialPreference = getInitialPreference();

  // Track if we're following system preference
  const [systemTheme, setSystemTheme] = useState(
    initialPreference === "system",
  );

  // Track the actual dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    if (initialPreference === "dark") {
      return true;
    }
    if (initialPreference === "light") {
      return false;
    }
    // If initialPreference is 'system'
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Update the UI when dark mode changes
  useEffect(() => {
    updateFavicon(darkMode);
    // Store the actual current theme state (dark or light)
    localStorage.setItem("theme", darkMode ? "dark" : "light");

    const applyThemeClass = () => {
      if (darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    // Apply immediately and also after a tiny delay
    applyThemeClass();
    const timeoutId = setTimeout(applyThemeClass, 0);

    return () => clearTimeout(timeoutId);
  }, [darkMode]);

  // Listen for system theme changes
  useEffect(() => {
    if (!systemTheme) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e) => {
      setDarkMode(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      mediaQuery.addListener(handleChange); // For older browsers
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        mediaQuery.removeListener(handleChange); // For older browsers
      }
    };
  }, [systemTheme]);

  // Toggle between light and dark mode
  const toggleTheme = useCallback(() => {
    setSystemTheme(false); // Manual toggle means not following system
    setDarkMode((prevDarkMode) => {
      const newDarkMode = !prevDarkMode;
      // Update the preference to the explicitly chosen theme
      localStorage.setItem(
        "themePreference",
        newDarkMode ? "dark" : "light",
      );
      return newDarkMode;
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
