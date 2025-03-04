// src/components/ui/Alert.jsx
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const Alert = ({
  title,
  children,
  variant = "info",
  onClose,
  className = "",
  ...props
}) => {
  // Define variant styles
  const variantStyles = {
    info: "bg-blue-50 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
    success:
      "bg-green-50 text-green-800 dark:bg-green-900/50 dark:text-green-300",
    warning:
      "bg-yellow-50 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
    error: "bg-red-50 text-red-800 dark:bg-red-900/50 dark:text-red-300",
  };

  // Define icon for each variant
  const variantIcon = {
    info: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
    ),
    success: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    ),
    warning: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    ),
    error: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
    ),
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`rounded-lg p-4 ${
          variantStyles[variant] || variantStyles.info
        } ${className}`}
        role="alert"
        {...props}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">{variantIcon[variant]}</div>
          <div className="ml-3 w-full">
            <div className="flex justify-between items-start">
              {title && <p className="text-sm font-medium">{title}</p>}
              {onClose && (
                <button
                  type="button"
                  className="inline-flex rounded-md text-current hover:bg-opacity-20 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-current"
                  onClick={onClose}
                >
                  <span className="sr-only">Close</span>
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            {children && <div className="mt-2 text-sm">{children}</div>}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Alert;
