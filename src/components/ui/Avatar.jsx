// src/components/ui/Avatar.jsx
import { useState } from "react";
import { motion } from "framer-motion";

const Avatar = ({
  src,
  alt,
  size = "md",
  status,
  className = "",
  animate = false,
  onClick,
  ...props
}) => {
  const [imageError, setImageError] = useState(false);

  // Handle image loading error
  const handleError = () => {
    setImageError(true);
  };

  // Define size styles
  const sizeStyles = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
    "2xl": "w-20 h-20 text-xl",
    "3xl": "w-24 h-24 text-2xl",
  };

  // Status styles (online, away, busy, offline)
  const statusStyles = {
    online: "bg-green-500",
    away: "bg-yellow-500",
    busy: "bg-red-500",
    offline: "bg-gray-500",
  };

  // Status size based on avatar size
  const statusSizeStyles = {
    xs: "w-1.5 h-1.5",
    sm: "w-2 h-2",
    md: "w-2.5 h-2.5",
    lg: "w-3 h-3",
    xl: "w-3.5 h-3.5",
    "2xl": "w-4 h-4",
    "3xl": "w-5 h-5",
  };

  // Get initials from the alt text
  const initials = alt
    ? alt
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "U";

  // Generate a consistent color based on the name
  const getAvatarColor = (name) => {
    const colors = [
      "bg-primary-500",
      "bg-secondary-500",
      "bg-accent-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-blue-500",
      "bg-teal-500",
      "bg-emerald-500",
      "bg-amber-500",
      "bg-orange-500",
    ];

    if (!name) return colors[0];

    // Simple hash function
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Use hash to pick a color
    return colors[Math.abs(hash) % colors.length];
  };

  // Get color based on name
  const avatarColor = getAvatarColor(alt);

  // Component with conditional motion
  const Component = animate ? motion.div : "div";

  // Animation props
  const animationProps = animate
    ? {
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 },
        transition: { duration: 0.2 },
      }
    : {};

  const baseClassName = `relative inline-flex rounded-full ${
    sizeStyles[size] || sizeStyles.md
  } ${onClick ? "cursor-pointer" : ""} ${className}`;

  // Render initials avatar if no image or error loading image
  if (!src || imageError) {
    return (
      <Component
        className={`${baseClassName} ${avatarColor} text-white font-medium items-center justify-center`}
        onClick={onClick}
        {...animationProps}
        {...props}
      >
        {initials}
        {status && (
          <span
            className={`absolute bottom-0 right-0 block rounded-full ring-2 ring-white dark:ring-gray-800 ${
              statusStyles[status] || statusStyles.offline
            } ${statusSizeStyles[size] || statusSizeStyles.md}`}
          />
        )}
      </Component>
    );
  }

  // Render image avatar
  return (
    <Component
      className={baseClassName}
      onClick={onClick}
      {...animationProps}
      {...props}
    >
      <img
        src={src}
        alt={alt}
        onError={handleError}
        className="w-full h-full object-cover rounded-full"
      />
      {status && (
        <span
          className={`absolute bottom-0 right-0 block rounded-full ring-2 ring-white dark:ring-gray-800 ${
            statusStyles[status] || statusStyles.offline
          } ${statusSizeStyles[size] || statusSizeStyles.md}`}
        />
      )}
    </Component>
  );
};

export default Avatar;
