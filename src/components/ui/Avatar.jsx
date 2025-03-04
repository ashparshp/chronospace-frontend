// src/components/ui/Avatar.jsx
const Avatar = ({ src, alt, size = "md", className = "", ...props }) => {
  // Define size styles
  const sizeStyles = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
    "2xl": "w-20 h-20",
  };

  const initials = alt
    ? alt
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "U";

  if (!src) {
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-primary-500 text-white font-medium ${
          sizeStyles[size] || sizeStyles.md
        } ${className}`}
        {...props}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`rounded-full object-cover ${
        sizeStyles[size] || sizeStyles.md
      } ${className}`}
      {...props}
    />
  );
};

export default Avatar;
