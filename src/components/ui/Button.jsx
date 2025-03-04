// src/components/ui/Button.jsx
import { Link } from "react-router-dom";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  isLoading = false,
  type = "button",
  href,
  onClick,
  ...props
}) => {
  // Define base styles
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  // Define variant styles
  const variantStyles = {
    primary:
      "bg-primary hover:bg-primary-700 text-white focus:ring-primary-500",
    secondary:
      "bg-secondary hover:bg-secondary-600 text-white focus:ring-secondary-500",
    accent: "bg-accent hover:bg-accent-600 text-white focus:ring-accent-500",
    outline:
      "border border-primary text-primary hover:bg-primary-50 dark:hover:bg-primary-900 focus:ring-primary-500",
    ghost:
      "text-primary hover:bg-primary-50 dark:hover:bg-primary-900 focus:ring-primary-500",
    danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500",
  };

  // Define size styles
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  // Combine styles
  const buttonStyles = `
    ${baseStyles}
    ${variantStyles[variant] || variantStyles.primary}
    ${sizeStyles[size] || sizeStyles.md}
    ${disabled || isLoading ? "opacity-50 cursor-not-allowed" : ""}
    ${className}
  `;

  // If href is provided, render a Link component
  if (href) {
    return (
      <Link to={href} className={buttonStyles} {...props}>
        {isLoading ? (
          <span className="mr-2">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </span>
        ) : null}
        {children}
      </Link>
    );
  }

  // Otherwise, render a button
  return (
    <button
      type={type}
      className={buttonStyles}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <span className="mr-2">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </span>
      ) : null}
      {children}
    </button>
  );
};

export default Button;
