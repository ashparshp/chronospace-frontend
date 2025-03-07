// src/components/ui/Badge.jsx
import { motion } from "framer-motion";

const Badge = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  animate = false,
  dot = false,
  ...props
}) => {
  // Define variant styles
  const variantStyles = {
    primary: {
      bg: "bg-primary-100 dark:bg-primary-900/30",
      text: "text-primary-800 dark:text-primary-300",
      border: "border-primary-200 dark:border-primary-800/50",
    },
    secondary: {
      bg: "bg-secondary-100 dark:bg-secondary-900/30",
      text: "text-secondary-800 dark:text-secondary-300",
      border: "border-secondary-200 dark:border-secondary-800/50",
    },
    accent: {
      bg: "bg-accent-100 dark:bg-accent-900/30",
      text: "text-accent-800 dark:text-accent-300",
      border: "border-accent-200 dark:border-accent-800/50",
    },
    success: {
      bg: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-800 dark:text-green-300",
      border: "border-green-200 dark:border-green-800/50",
    },
    warning: {
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
      text: "text-yellow-800 dark:text-yellow-300",
      border: "border-yellow-200 dark:border-yellow-800/50",
    },
    danger: {
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-800 dark:text-red-300",
      border: "border-red-200 dark:border-red-800/50",
    },
    info: {
      bg: "bg-blue-100 dark:bg-blue-900/30",
      text: "text-blue-800 dark:text-blue-300",
      border: "border-blue-200 dark:border-blue-800/50",
    },
    neutral: {
      bg: "bg-gray-100 dark:bg-gray-800/50",
      text: "text-gray-800 dark:text-gray-300",
      border: "border-gray-200 dark:border-gray-700/50",
    },
    gradient: {
      bg: "bg-gradient-to-r from-primary-500/10 to-secondary-500/10 dark:from-primary-500/20 dark:to-secondary-500/20",
      text: "text-primary-800 dark:text-primary-300",
      border: "border-primary-200/50 dark:border-primary-700/30",
    },
  };

  // Get selected style or fallback to primary
  const style = variantStyles[variant] || variantStyles.primary;

  // Define size styles
  const sizeStyles = {
    xs: "px-1.5 py-0.5 text-xs",
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1 text-base",
  };

  // Decide whether to use motion.span or regular span
  const Component = animate ? motion.span : "span";

  // Animation props (only applied when animate is true)
  const animationProps = animate
    ? {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.3 },
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 },
      }
    : {};

  return (
    <Component
      className={`inline-flex items-center font-medium rounded-full ${
        style.bg
      } ${style.text} border ${style.border} ${
        sizeStyles[size] || sizeStyles.md
      } ${className}`}
      {...animationProps}
      {...props}
    >
      {dot && (
        <span
          className={`mr-1.5 h-2 w-2 rounded-full ${
            variant === "primary"
              ? "bg-primary-500"
              : variant === "secondary"
              ? "bg-secondary-500"
              : variant === "accent"
              ? "bg-accent-500"
              : variant === "success"
              ? "bg-green-500"
              : variant === "warning"
              ? "bg-yellow-500"
              : variant === "danger"
              ? "bg-red-500"
              : variant === "info"
              ? "bg-blue-500"
              : "bg-gray-500"
          }`}
        />
      )}
      {children}
    </Component>
  );
};

export default Badge;
