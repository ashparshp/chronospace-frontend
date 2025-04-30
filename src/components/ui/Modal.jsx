import { Fragment, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  className = "",
  showCloseButton = true,
  closeOnOutsideClick = true,
  disableAnimation = false,
  ...props
}) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const handleBackdropClick = (e) => {
    if (closeOnOutsideClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const sizeStyles = {
    xs: "max-w-xs",
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-xl",
    xl: "max-w-2xl",
    "2xl": "max-w-4xl",
    "3xl": "max-w-5xl",
    "4xl": "max-w-6xl",
    full: "max-w-full mx-4",
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2, delay: 0.1 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 10,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Fragment>
          <motion.div
            className="fixed inset-0 bg-black backdrop-blur-sm z-40"
            onClick={handleBackdropClick}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={disableAnimation ? {} : backdropVariants}
          />

          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0 overflow-y-auto"
            onClick={handleBackdropClick}
          >
            <motion.div
              className={`w-full ${
                sizeStyles[size] || sizeStyles.md
              } bg-white dark:bg-black rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 ${className}`}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={disableAnimation ? {} : modalVariants}
              {...props}
              onClick={(e) => e.stopPropagation()}
            >
              {title && (
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-black/50">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {title}
                  </h3>
                  {showCloseButton && (
                    <motion.button
                      onClick={onClose}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none p-1 rounded-full hover:bg-gray-200 dark:hover:bg-black transition-colors duration-200"
                      aria-label="Close"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="h-5 w-5" />
                    </motion.button>
                  )}
                </div>
              )}

              <div className="px-6 py-4 max-h-[70vh] overflow-y-auto scrollbar-thin">
                {children}
              </div>
            </motion.div>
          </div>
        </Fragment>
      )}
    </AnimatePresence>
  );
};

export default Modal;
