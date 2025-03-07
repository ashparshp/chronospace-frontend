// src/components/ui/ThemeToggle.jsx
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { Sun, Moon, Monitor } from "lucide-react";

const ThemeToggleMini = () => {
  const { darkMode, toggleTheme } = useTheme();

  const variants = {
    light: { rotate: 0 },
    dark: { rotate: 180 },
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className={`p-2 rounded-full transition-colors duration-300 ${
        darkMode
          ? "bg-primary-900/30 text-yellow-400"
          : "bg-primary-100/50 text-primary-600"
      }`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={darkMode ? "dark" : "light"}
        variants={variants}
        transition={{ duration: 0.5, type: "spring" }}
      >
        {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </motion.div>
    </motion.button>
  );
};

const ThemeToggle = ({ className = "" }) => {
  const { darkMode, toggleTheme, setTheme } = useTheme();

  const variants = {
    light: { rotate: 0 },
    dark: { rotate: 180 },
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <button
        onClick={() => setTheme(false)}
        className={`p-2 rounded-full ${
          !darkMode
            ? "bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300"
            : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-black"
        } transition-all duration-200`}
        aria-label="Light mode"
        title="Light mode"
      >
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Sun className="h-5 w-5" />
        </motion.div>
      </button>

      <button
        onClick={() => {
          // Check system preference
          const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
          ).matches;
          setTheme(prefersDark);
        }}
        className={`p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-black transition-all duration-200`}
        aria-label="System preference"
        title="System preference"
      >
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Monitor className="h-5 w-5" />
        </motion.div>
      </button>

      <button
        onClick={() => setTheme(true)}
        className={`p-2 rounded-full ${
          darkMode
            ? "bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300"
            : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-black"
        } transition-all duration-200`}
        aria-label="Dark mode"
        title="Dark mode"
      >
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Moon className="h-5 w-5" />
        </motion.div>
      </button>
    </div>
  );
};

// Attach ThemeToggleMini as a property of ThemeToggle
ThemeToggle.ThemeToggleMini = ThemeToggleMini;

export default ThemeToggle;
