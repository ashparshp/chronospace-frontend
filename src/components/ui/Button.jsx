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
  glossy = false,
  shadowDepth = "normal",
  rounded = true,
  equalWidth = false,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none box-border border border-transparent";

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-primary to-primary-700 hover:from-primary-600 hover:to-primary-800 text-white shadow-[0_4px_0_theme(colors.primary.800),0_6px_10px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_0_theme(colors.primary.800),0_8px_15px_rgba(0,0,0,0.2)] focus:ring-2 focus:ring-primary-500/50 active:translate-y-1 active:shadow-[0_2px_0_theme(colors.primary.800),0_2px_5px_rgba(0,0,0,0.1)]",
    secondary:
      "bg-gradient-to-r from-secondary to-secondary-600 hover:from-secondary-500 hover:to-secondary-700 text-white shadow-[0_4px_0_theme(colors.secondary.800),0_6px_10px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_0_theme(colors.secondary.800),0_8px_15px_rgba(0,0,0,0.2)] focus:ring-2 focus:ring-secondary-500/50 active:translate-y-1 active:shadow-[0_2px_0_theme(colors.secondary.800),0_2px_5px_rgba(0,0,0,0.1)]",
    accent:
      "bg-gradient-to-r from-accent to-accent-600 hover:from-accent-500 hover:to-accent-700 text-white shadow-[0_4px_0_theme(colors.accent.800),0_6px_10px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_0_theme(colors.accent.800),0_8px_15px_rgba(0,0,0,0.2)] focus:ring-2 focus:ring-accent-500/50 active:translate-y-1 active:shadow-[0_2px_0_theme(colors.accent.800),0_2px_5px_rgba(0,0,0,0.1)]",
    outline:
      "border-2 border-primary text-primary dark:text-white hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:border-primary-600 dark:hover:border-primary-400 shadow-[0_2px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_3px_5px_rgba(0,0,0,0.1)] focus:ring-2 focus:ring-primary-500/50 active:translate-y-0.5 active:shadow-none",
    ghost:
      "text-primary hover:bg-primary-50 dark:hover:bg-primary-900/30 focus:ring-2 focus:ring-primary-500/50 active:scale-95",
    danger:
      "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-700 text-white shadow-[0_4px_0_theme(colors.red.800),0_6px_10px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_0_theme(colors.red.800),0_8px_15px_rgba(0,0,0,0.2)] focus:ring-2 focus:ring-red-500/50 active:translate-y-1 active:shadow-[0_2px_0_theme(colors.red.800),0_2px_5px_rgba(0,0,0,0.1)]",
    success:
      "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-700 text-white shadow-[0_4px_0_theme(colors.green.800),0_6px_10px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_0_theme(colors.green.800),0_8px_15px_rgba(0,0,0,0.2)] focus:ring-2 focus:ring-green-500/50 active:translate-y-1 active:shadow-[0_2px_0_theme(colors.green.800),0_2px_5px_rgba(0,0,0,0.1)]",
    gradient:
      "bg-gradient-to-r from-primary-600 via-accent-600 to-secondary-600 hover:from-primary-500 hover:via-accent-500 hover:to-secondary-500 text-white shadow-[0_4px_0_theme(colors.secondary.800),0_6px_10px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_0_theme(colors.secondary.800),0_8px_15px_rgba(0,0,0,0.2)] focus:ring-2 focus:ring-primary-500/50 active:translate-y-1 active:shadow-[0_2px_0_theme(colors.secondary.800),0_2px_5px_rgba(0,0,0,0.1)]",
    transparent:
      "bg-white/10 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10 text-gray-800 dark:text-white shadow-sm hover:bg-white/20 dark:hover:bg-white/10 focus:ring-2 focus:ring-white/30 active:translate-y-0.5 active:shadow-none",
    white:
      "bg-white hover:bg-gray-50 text-gray-900 shadow-[0_4px_0_theme(colors.gray.200),0_6px_10px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_0_theme(colors.gray.200),0_8px_15px_rgba(0,0,0,0.15)] focus:ring-2 focus:ring-gray-200 active:translate-y-1 active:shadow-[0_2px_0_theme(colors.gray.200),0_2px_5px_rgba(0,0,0,0.05)]",

    orange:
      "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-700 text-white shadow-[0_4px_0_theme(colors.orange.800),0_6px_10px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_0_theme(colors.orange.800),0_8px_15px_rgba(0,0,0,0.2)] focus:ring-2 focus:ring-orange-500/50 active:translate-y-1 active:shadow-[0_2px_0_theme(colors.orange.800),0_2px_5px_rgba(0,0,0,0.1)]",

    black:
      "bg-gray-900 hover:bg-black text-white shadow-[0_4px_0_theme(colors.gray.950),0_6px_10px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_0_theme(colors.gray.950),0_8px_15px_rgba(0,0,0,0.4)] focus:ring-2 focus:ring-gray-500/50 active:translate-y-1 active:shadow-[0_2px_0_theme(colors.gray.950),0_2px_5px_rgba(0,0,0,0.2)]",
  };

  // Consistent size styles with identical padding
  const sizeStyles = {
    xs: "px-2 py-1 text-xs min-h-[1.75rem]",
    sm: "px-3 py-1.5 text-sm min-h-[2.25rem]",
    md: "px-4 py-2 text-base min-h-[2.5rem]",
    lg: "px-6 py-3 text-lg min-h-[3.125rem]",
    xl: "px-8 py-4 text-xl min-h-[3.75rem]",
  };

  const shadowDepthStyles = {
    shallow: "shadow-sm hover:shadow-md",
    normal: "",
    deep: "shadow-lg hover:shadow-xl",
  };

  const roundedStyles = rounded ? "rounded-lg" : "rounded-none";

  // Adjust glossy style to respect rounded corners setting
  const glossyStyle = glossy
    ? `before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/20 before:to-transparent ${
        rounded ? "before:rounded-lg" : ""
      } before:pointer-events-none`
    : "";

  const stateStyles =
    disabled || isLoading
      ? "opacity-50 cursor-not-allowed shadow-none hover:shadow-none active:transform-none"
      : "";

  // Equal width style for button groups
  const equalWidthStyle = equalWidth ? "w-full md:w-auto md:min-w-[160px]" : "";

  const buttonStyles = `
    ${baseStyles}
    ${variantStyles[variant] || variantStyles.primary}
    ${sizeStyles[size] || sizeStyles.md}
    ${shadowDepthStyles[shadowDepth] || ""}
    ${roundedStyles}
    ${glossyStyle}
    ${stateStyles}
    ${equalWidthStyle}
    relative overflow-hidden
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

  const motionSettings =
    !disabled && !isLoading
      ? {
          whileHover: { scale: 1.02 },
          whileTap: { scale: 0.98 },
        }
      : {};

  if (href) {
    return (
      <motion.div {...motionSettings}>
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
      {...motionSettings}
      {...props}
    >
      {buttonContent}
    </motion.button>
  );
};

export default Button;
