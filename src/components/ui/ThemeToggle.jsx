import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { Sun, Moon, Monitor } from "lucide-react";

const ThemeToggleMini = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <motion.button 
      onClick={toggleTheme} 
      className={`w-14 h-8 rounded-full overflow-hidden relative transition-colors duration-200 ${
        darkMode ? 'bg-gray-800' : 'bg-blue-300'
      } border-2 ${darkMode ? 'border-gray-600' : 'border-blue-400'} shadow-sm`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      <motion.div 
        className="absolute transform"
        animate={{
          translateX: darkMode ? '3rem' : '0.5rem',
          translateY: darkMode ? '-2rem' : '0.25rem',
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="w-5 h-5 rounded-full bg-yellow-400"></div>
      </motion.div>
      
      <motion.div 
        className="absolute transform"
        animate={{
          translateX: darkMode ? '0.5rem' : '4rem',
          translateY: '0.25rem',
          opacity: darkMode ? 1 : 0
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="w-4 h-4 rounded-full bg-gray-200"></div>
      </motion.div>
      
      <motion.div 
        className="absolute top-2 left-2"
        animate={{
          opacity: darkMode ? 1 : 0
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="w-1 h-1 rounded-full bg-white"></div>
      </motion.div>
      
      <motion.div 
        className="absolute top-6 left-9"
        animate={{
          opacity: darkMode ? 1 : 0
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="w-1 h-1 rounded-full bg-white"></div>
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

ThemeToggle.ThemeToggleMini = ThemeToggleMini;

export default ThemeToggle;
