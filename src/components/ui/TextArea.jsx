// src/components/ui/TextArea.jsx
import { forwardRef } from "react";

const TextArea = forwardRef(
  (
    {
      label,
      name,
      placeholder,
      error,
      className = "",
      required = false,
      disabled = false,
      rows = 4,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={name}
          name={name}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          className={`w-full px-4 py-2 rounded-lg border ${
            error
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 dark:border-gray-700 focus:ring-primary-500 focus:border-primary-500"
          } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";

export default TextArea;
