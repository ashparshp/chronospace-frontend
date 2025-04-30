import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const ScrollToTop = ({ threshold = 400, className = "", offset = 8 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { pathname } = useLocation();

  const toggleVisibility = () => {
    if (window.pageYOffset > threshold) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          onClick={scrollToTop}
          className={`fixed bottom-${offset} right-${offset} bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow duration-300 z-30 ${className}`}
          aria-label="Scroll to top"
          whileHover={{
            scale: 1.1,
            rotate: 360,
            transition: { duration: 0.5 },
          }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronUp className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
