// src/components/ui/Input.jsx
import { forwardRef } from "react";
import { motion } from "framer-motion";

const Input = forwardRef(
  (
    {
      label,
      name,
      type = "text",
      placeholder,
      error,
      className = "",
      required = false,
      disabled = false,
      helper,
      icon,
      iconPosition = "left",
      ...props
    },
    ref
  ) => {
    // Input container animations
    const containerVariants = {
      initial: { opacity: 0, y: 10 },
      animate: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.2,
          ease: "easeOut",
        },
      },
      error: {
        x: [-5, 5, -3, 3, 0],
        transition: {
          duration: 0.4,
          ease: "easeInOut",
        },
      },
    };

    return (
      <motion.div
        className="w-full"
        initial="initial"
        animate="animate"
        variants={containerVariants}
      >
        {label && (
          <motion.label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {label} {required && <span className="text-red-500">*</span>}
          </motion.label>
        )}

        <div className="relative">
          {icon && iconPosition === "left" && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">
              {icon}
            </div>
          )}

          <motion.input
            ref={ref}
            type={type}
            id={name}
            name={name}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full px-4 py-2 rounded-lg border ${
              error
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 dark:border-gray-700 focus:ring-primary-500/50 focus:border-primary-500"
            } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
              icon && iconPosition === "left" ? "pl-10" : ""
            } ${icon && iconPosition === "right" ? "pr-10" : ""} ${className}`}
            animate={error ? "error" : "animate"}
            variants={containerVariants}
            {...props}
          />

          {icon && iconPosition === "right" && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">
              {icon}
            </div>
          )}
        </div>

        {helper && !error && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {helper}
          </p>
        )}

        {error && (
          <motion.p
            className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.2 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </motion.p>
        )}
      </motion.div>
    );
  }
);

Input.displayName = "Input";

export default Input;
