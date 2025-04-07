import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTop from "../ui/ScrollToTop";
import { useTheme } from "../../context/ThemeContext";

const MainLayout = () => {
  const { darkMode } = useTheme();

  // Update meta theme color based on dark mode
  useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", darkMode ? "#0F172A" : "#F9FAFB");
    }
  }, [darkMode]);

  // Page transition variants
  const pageVariants = {
    initial: {
      opacity: 0,
    },
    in: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    out: {
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white transition-colors duration-300 scrollbar-thin">
      <ScrollToTop />
      <Header />

      {/* Animated Background Noise Effect */}
      <div className="fixed inset-0 -z-10 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-noise"></div>
      </div>

      {/* Subtle Gradient Overlay */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-purple-900/10 via-black/20 to-indigo-900/10 opacity-50 pointer-events-none"></div>

      <AnimatePresence mode="wait">
        <motion.main
          key="main-content"
          className="flex-grow container-custom py-6 sm:py-10"
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default MainLayout;
