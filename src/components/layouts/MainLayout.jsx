// src/components/layouts/MainLayout.jsx
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
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
      metaThemeColor.setAttribute("content", darkMode ? "#111827" : "#FFFFFF");
    }
  }, [darkMode]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <ScrollToTop />
      <Header />
      <main className="flex-grow container-custom py-6 sm:py-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
