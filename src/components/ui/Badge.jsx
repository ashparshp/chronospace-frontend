// src/components/ui/Badge.jsx
const Badge = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  // Define variant styles
  const variantStyles = {
    primary:
      "bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300",
    secondary:
      "bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-300",
    accent:
      "bg-accent-100 text-accent-800 dark:bg-accent-900 dark:text-accent-300",
    success:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    warning:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    danger: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  };

  // Define size styles
  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-0.5 text-sm",
    lg: "px-3 py-1 text-base",
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${
        variantStyles[variant] || variantStyles.primary
      } ${sizeStyles[size] || sizeStyles.md} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
