// src/context/ThemeContext.jsx
import { createContext, useState, useEffect, useContext } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [themeLoaded, setThemeLoaded] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    // Function to set the theme based on saved preference or system preference
    const initializeTheme = () => {
      const savedTheme = localStorage.getItem("theme");

      if (savedTheme) {
        // If there's a saved theme preference, use it
        setDarkMode(savedTheme === "dark");
      } else {
        // Otherwise, check system preference
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        setDarkMode(prefersDark);
        // Save this initial preference
        localStorage.setItem("theme", prefersDark ? "dark" : "light");
      }

      // Mark theme as loaded
      setThemeLoaded(true);
    };

    // Initialize theme
    initializeTheme();

    // Listen for system preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      // Only update if there's no user preference saved
      if (!localStorage.getItem("theme")) {
        setDarkMode(e.matches);
      }
    };

    // Add event listener with compatibility for older browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      // For older browsers
      mediaQuery.addListener(handleChange);
    }

    // Cleanup listener
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        // For older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  // Update document classes and localStorage when theme changes
  useEffect(() => {
    if (!themeLoaded) return; // Skip initial render until theme is loaded

    // Apply theme to document
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Save theme preference
    localStorage.setItem("theme", darkMode ? "dark" : "light");

    // Optional: update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", darkMode ? "#0F172A" : "#F9FAFB");
    }
  }, [darkMode, themeLoaded]);

  // Toggle theme
  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  // Set specific theme
  const setTheme = (isDark) => {
    setDarkMode(isDark);
  };

  // Check if dark mode is active
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
