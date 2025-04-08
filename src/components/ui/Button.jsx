// src/components/ui/Button.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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
  icon,
  iconPosition = "left",
  ...props
}) => {
  // Define base styles
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2";

  // Define variant styles
  const variantStyles = {
    primary:
      "bg-gradient-to-r from-primary to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-md hover:shadow-lg focus:ring-primary-500/50",
    secondary:
      "bg-gradient-to-r from-secondary to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white shadow-md hover:shadow-lg focus:ring-secondary-500/50",
    accent:
      "bg-gradient-to-r from-accent to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white shadow-md hover:shadow-lg focus:ring-accent-500/50",
    outline:
      "border border-primary text-primary dark:text-white hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:border-primary-600 dark:hover:border-primary-400 focus:ring-primary-500/50",
    ghost:
      "text-primary hover:bg-primary-50 dark:hover:bg-primary-900/30 focus:ring-primary-500/50",
    danger:
      "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-lg focus:ring-red-500/50",
    success:
      "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md hover:shadow-lg focus:ring-green-500/50",
    gradient:
      "bg-gradient-to-r from-primary-600 via-accent-600 to-secondary-600 hover:from-primary-700 hover:via-accent-700 hover:to-secondary-700 text-white shadow-md hover:shadow-lg focus:ring-primary-500/50",
  };

  // Define size styles
  const sizeStyles = {
    xs: "px-2 py-1 text-xs",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
    xl: "px-8 py-4 text-xl",
  };

  // Combine styles
  const buttonStyles = `
    ${baseStyles}
    ${variantStyles[variant] || variantStyles.primary}
    ${sizeStyles[size] || sizeStyles.md}
    ${
      disabled || isLoading
        ? "opacity-50 cursor-not-allowed"
        : "transform hover:-translate-y-0.5 active:translate-y-0"
    }
    ${className}
  `;

  // Loading spinner component
  const LoadingSpinner = () => (
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
  );

  // Button content
  const buttonContent = (
    <>
      {isLoading && <LoadingSpinner />}
      {icon && iconPosition === "left" && !isLoading && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
      {icon && iconPosition === "right" && !isLoading && (
        <span className="ml-2">{icon}</span>
      )}
    </>
  );

  // If href is provided, render a Link component
  if (href) {
    return (
      <motion.div
        whileHover={!disabled && !isLoading ? { scale: 1.05 } : {}}
        whileTap={!disabled && !isLoading ? { scale: 0.95 } : {}}
      >
        <Link to={href} className={buttonStyles} {...props}>
          {buttonContent}
        </Link>
      </motion.div>
    );
  }

  // Otherwise, render a button
  return (
    <motion.button
      type={type}
      className={buttonStyles}
      disabled={disabled || isLoading}
      onClick={onClick}
      whileHover={!disabled && !isLoading ? { scale: 1.05 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.95 } : {}}
      {...props}
    >
      {buttonContent}
    </motion.button>
  );
};

export default Button;
