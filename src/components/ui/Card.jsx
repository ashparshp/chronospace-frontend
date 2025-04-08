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
  const baseStyles = "rounded-xl overflow-hidden transition-all duration-300";

  const variantStyles = {
    default:
      "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm dark:shadow-gray-900/10",
    gradient:
      "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm dark:shadow-gray-900/10 relative before:absolute before:inset-0 before:rounded-xl before:p-[1px] before:bg-gradient-to-r before:from-primary-200 before:to-secondary-200 dark:before:from-primary-800/40 dark:before:to-secondary-800/40 before:-z-10 before:opacity-70",
    outline:
      "bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-500 shadow-none",
    glass:
      "bg-white/70 dark:bg-gray-800/70 backdrop-blur-md backdrop-saturate-150 border border-white/20 dark:border-gray-700/20 shadow-lg shadow-gray-200/50 dark:shadow-black/20",
    elevated:
      "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-md hover:shadow-lg dark:shadow-gray-900/10",
  };

  const hoverAnimations = hoverEffect
    ? {
        whileHover: {
          y: -4,
          boxShadow: "0 12px 24px rgba(0, 0, 0, 0.08)",
          transition: { duration: 0.25, ease: "easeOut" },
        },
        whileTap: { y: -2, transition: { duration: 0.15 } },
      }
    : {};

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
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

Card.Header = ({ children, className = "", ...props }) => (
  <div className={`p-5 ${className}`} {...props}>
    {children}
  </div>
);

Card.Body = ({ children, className = "", ...props }) => (
  <div className={`px-5 pb-5 ${className}`} {...props}>
    {children}
  </div>
);

Card.Footer = ({ children, className = "", ...props }) => (
  <div
    className={`p-5 border-t border-gray-100 dark:border-gray-800 mt-auto ${className}`}
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
      className={`w-full h-full object-cover transition-all duration-700 hover:scale-105 hover:filter hover:brightness-105 ${className}`}
      {...props}
    />
  </div>
);

export default Card;
