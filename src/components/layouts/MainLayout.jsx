// src/components/layouts/MainLayout.jsx
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
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-300 scrollbar-thin">
      <ScrollToTop />
      <Header />

      {/* Background effect for visual interest */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -right-[30%] w-[80%] h-[80%] rounded-full bg-gradient-to-b from-primary-100/30 to-transparent dark:from-primary-900/10 blur-3xl"></div>
        <div className="absolute -bottom-[40%] -left-[30%] w-[80%] h-[80%] rounded-full bg-gradient-to-t from-secondary-100/30 to-transparent dark:from-secondary-900/10 blur-3xl"></div>
      </div>

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
