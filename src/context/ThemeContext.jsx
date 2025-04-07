import { createContext, useState, useEffect, useContext } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [themeLoaded, setThemeLoaded] = useState(false);

  useEffect(() => {
    const initializeTheme = () => {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        setDarkMode(savedTheme === "dark");
      } else {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setDarkMode(prefersDark);
        localStorage.setItem("theme", prefersDark ? "dark" : "light");
      }
      setThemeLoaded(true);
    };

    initializeTheme();

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      if (!localStorage.getItem("theme")) {
        setDarkMode(e.matches);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  useEffect(() => {
    if (!themeLoaded) return;
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", darkMode ? "#0F172A" : "#F9FAFB");
    }
  }, [darkMode, themeLoaded]);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  const setTheme = (isDark) => {
    setDarkMode(isDark);
  };

  const isDarkMode = () => darkMode;

  const value = {
    darkMode,
    toggleTheme,
    setTheme,
    isDarkMode,
    themeLoaded,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
