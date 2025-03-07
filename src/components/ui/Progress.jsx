// src/components/ui/Progress.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Progress = ({
  value = 0,
  max = 100,
  size = "md",
  variant = "primary",
  showValue = false,
  valuePosition = "right", // right, inside, none
  animate = true,
  striped = false,
  indeterminate = false,
  label,
  className = "",
  ...props
}) => {
  // Calculate percentage
  const percentage =
    max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  // State for animated value
  const [animatedValue, setAnimatedValue] = useState(0);

  // Animation effect
  useEffect(() => {
    if (animate) {
      // Set a small delay to ensure the component is mounted
      const timeout = setTimeout(() => {
        setAnimatedValue(percentage);
      }, 50);

      return () => clearTimeout(timeout);
    } else {
      setAnimatedValue(percentage);
    }
  }, [percentage, animate]);

  // Variant styles for the progress bar
  const variantStyles = {
    primary: "bg-primary-600 dark:bg-primary-500",
    secondary: "bg-secondary-600 dark:bg-secondary-500",
    accent: "bg-accent-600 dark:bg-accent-500",
    success: "bg-green-600 dark:bg-green-500",
    warning: "bg-yellow-600 dark:bg-yellow-500",
    danger: "bg-red-600 dark:bg-red-500",
    info: "bg-blue-600 dark:bg-blue-500",
    gradient:
      "bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-500 dark:to-secondary-500",
  };

  // Size styles
  const sizeStyles = {
    xs: "h-1",
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3",
    xl: "h-4",
  };

  // Animation variants
  const progressVariants = {
    initial: { width: "0%" },
    animate: {
      width: `${animatedValue}%`,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  // Indeterminate animation
  const indeterminateVariants = {
    initial: {
      x: "-100%",
      width: "50%",
    },
    animate: {
      x: "100%",
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: "easeInOut",
      },
    },
  };

  // Striped effect styles
  const stripedStyles = striped
    ? "bg-stripes bg-[length:20px_20px] animate-[move-stripes_1s_linear_infinite]"
    : "";

  return (
    <div className={`w-full ${className}`} {...props}>
      {/* Label and value display */}
      {(label || (showValue && valuePosition === "right")) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </span>
          )}

          {showValue && valuePosition === "right" && (
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {value} / {max}
            </span>
          )}
        </div>
      )}

      {/* Progress container */}
      <div
        className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${
          sizeStyles[size] || sizeStyles.md
        }`}
      >
        {indeterminate ? (
          <motion.div
            className={`h-full rounded-full ${
              variantStyles[variant] || variantStyles.primary
            }`}
            initial="initial"
            animate="animate"
            variants={indeterminateVariants}
          />
        ) : (
          <div className="relative w-full h-full">
            <motion.div
              className={`h-full rounded-full ${
                variantStyles[variant] || variantStyles.primary
              } ${stripedStyles}`}
              initial="initial"
              animate="animate"
              variants={progressVariants}
            >
              {/* Value inside the progress bar */}
              {showValue && valuePosition === "inside" && percentage >= 20 && (
                <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
                  {`${Math.round(percentage)}%`}
                </span>
              )}
            </motion.div>
          </div>
        )}
      </div>

      {/* Value below the progress bar */}
      {showValue && valuePosition === "below" && (
        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
          {`${Math.round(percentage)}%`}
        </div>
      )}
    </div>
  );
};

// Add utility for creating stripe pattern
const styles = `
@keyframes move-stripes {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 20px 0;
  }
}

.bg-stripes {
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.15) 75%,
    transparent 75%,
    transparent
  );
}
`;

// Add styles to document
if (typeof document !== "undefined") {
  const styleEl = document.createElement("style");
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);
}

export default Progress;
