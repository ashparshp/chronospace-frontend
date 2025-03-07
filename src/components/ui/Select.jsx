// src/components/ui/Select.jsx
import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const Select = forwardRef(
  (
    {
      label,
      name,
      options = [],
      placeholder,
      error,
      className = "",
      required = false,
      disabled = false,
      helper,
      icon,
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
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">
              {icon}
            </div>
          )}

          <div className="relative">
            <motion.select
              ref={ref}
              id={name}
              name={name}
              disabled={disabled}
              className={`w-full px-4 py-2 pr-10 rounded-lg border appearance-none ${
                error
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 dark:border-gray-700 focus:ring-primary-500/50 focus:border-primary-500"
              } bg-white dark:bg-black text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
                icon ? "pl-10" : ""
              } ${className}`}
              animate={error ? "error" : "animate"}
              variants={containerVariants}
              {...props}
            >
              {placeholder && (
                <option value="" disabled>
                  {placeholder}
                </option>
              )}
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </motion.select>

            {/* Custom dropdown icon */}
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
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

Select.displayName = "Select";

export default Select;
