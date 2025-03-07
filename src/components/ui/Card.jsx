// src/components/ui/Card.jsx
import { motion } from "framer-motion";

const Card = ({
  children,
  className = "",
  animate = false,
  onClick,
  variant = "default",
  hoverEffect = true,
  delay = 0,
  ...props
}) => {
  // Base styles for all card variants
  const baseStyles = "rounded-xl overflow-hidden transition-all duration-300";

  // Different card style variants
  const variantStyles = {
    default:
      "bg-surface-light dark:bg-surface-dark shadow-custom border border-gray-100 dark:border-gray-800",
    gradient:
      "card-gradient bg-surface-light dark:bg-surface-dark shadow-custom border border-gray-100 dark:border-gray-800",
    outline:
      "bg-transparent border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-400",
    glass: "glass-effect backdrop-blur-md",
    elevated:
      "bg-surface-light dark:bg-surface-dark shadow-custom-lg border border-gray-100 dark:border-gray-800",
  };

  // Hover animation settings
  const hoverAnimations = hoverEffect
    ? {
        whileHover: {
          y: -5,
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
          transition: { duration: 0.2 },
        },
        whileTap: { y: 0 },
      }
    : {};

  // If animate is true, render with motion div
  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: delay,
          ease: "easeOut",
        }}
        className={`${baseStyles} ${
          variantStyles[variant] || variantStyles.default
        } ${className}`}
        onClick={onClick}
        {...hoverAnimations}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  // If not animating entry but want hover effects
  if (hoverEffect && !animate) {
    return (
      <motion.div
        className={`${baseStyles} ${
          variantStyles[variant] || variantStyles.default
        } ${className}`}
        onClick={onClick}
        {...hoverAnimations}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  // Basic card with no animations
  return (
    <div
      className={`${baseStyles} ${
        variantStyles[variant] || variantStyles.default
      } ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

// Card sub-components for better organization
Card.Header = ({ children, className = "", ...props }) => (
  <div className={`p-4 sm:p-6 ${className}`} {...props}>
    {children}
  </div>
);

Card.Body = ({ children, className = "", ...props }) => (
  <div className={`p-4 sm:p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

Card.Footer = ({ children, className = "", ...props }) => (
  <div
    className={`p-4 sm:p-6 border-t border-gray-100 dark:border-gray-800 ${className}`}
    {...props}
  >
    {children}
  </div>
);

Card.Image = ({ src, alt, className = "", ...props }) => (
  <div className="w-full aspect-video overflow-hidden">
    <img
      src={src}
      alt={alt}
      className={`w-full h-full object-cover transition-transform duration-500 hover:scale-105 ${className}`}
      {...props}
    />
  </div>
);

export default Card;
