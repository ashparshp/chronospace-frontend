import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const GradientButton = ({
  children,
  gradientFrom = "from-primary-600",
  gradientTo = "to-secondary-600",
  hoverFrom = "hover:from-primary-700",
  hoverTo = "hover:to-secondary-700",
  textColor = "text-white",
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
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500/50";

  const sizeStyles = {
    xs: "px-2 py-1 text-xs",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
    xl: "px-8 py-4 text-xl",
  };

  const gradientStyles = `bg-gradient-to-r ${gradientFrom} ${gradientTo} ${hoverFrom} ${hoverTo} ${textColor}`;

  const buttonStyles = `
    ${baseStyles}
    ${gradientStyles}
    ${sizeStyles[size] || sizeStyles.md}
    ${disabled || isLoading ? "opacity-50 cursor-not-allowed" : ""}
    ${className}
  `;

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

  const animationProps =
    !disabled && !isLoading
      ? {
          whileHover: { scale: 1.05, y: -2 },
          whileTap: { scale: 0.95 },
          transition: { type: "spring", stiffness: 400, damping: 15 },
        }
      : {};

  if (href) {
    return (
      <motion.div {...animationProps}>
        <Link to={href} className={buttonStyles} {...props}>
          {buttonContent}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      type={type}
      className={buttonStyles}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...animationProps}
      {...props}
    >
      {buttonContent}
    </motion.button>
  );
};

export default GradientButton;
