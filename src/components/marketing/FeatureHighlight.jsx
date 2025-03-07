// src/components/marketing/FeatureHighlight.jsx
import { motion } from "framer-motion";

const FeatureHighlight = ({
  title,
  description,
  icon,
  image,
  direction = "right",
  color = "primary",
  className = "",
  ...props
}) => {
  const colorVariants = {
    primary: {
      bg: "from-primary-500/10 to-primary-500/5",
      accent: "bg-primary-500",
      text: "text-primary-600 dark:text-primary-400",
      border: "border-primary-200 dark:border-primary-800/30",
    },
    secondary: {
      bg: "from-secondary-500/10 to-secondary-500/5",
      accent: "bg-secondary-500",
      text: "text-secondary-600 dark:text-secondary-400",
      border: "border-secondary-200 dark:border-secondary-800/30",
    },
    accent: {
      bg: "from-accent-500/10 to-accent-500/5",
      accent: "bg-accent-500",
      text: "text-accent-600 dark:text-accent-400",
      border: "border-accent-200 dark:border-accent-800/30",
    },
  };

  const currentColor = colorVariants[color] || colorVariants.primary;

  const containerVariants = {
    offscreen: {
      opacity: 0,
      y: 50,
    },
    onscreen: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8,
        delay: 0.1,
      },
    },
  };

  const imageVariants = {
    offscreen: {
      opacity: 0,
      x: direction === "right" ? 50 : -50,
    },
    onscreen: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8,
        delay: 0.3,
      },
    },
  };

  const contentOrder = direction === "right" ? "order-first" : "order-last";
  const imageOrder = direction === "right" ? "order-last" : "order-first";

  return (
    <motion.div
      className={`overflow-hidden rounded-2xl border ${currentColor.border} bg-gradient-to-br ${currentColor.bg} ${className}`}
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
      {...props}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center p-8 md:p-12">
        {/* Content section */}
        <div className={`space-y-6 ${contentOrder}`}>
          {/* Icon */}
          {icon && (
            <div
              className={`w-12 h-12 rounded-xl ${currentColor.accent} flex items-center justify-center text-white shadow-lg`}
            >
              {icon}
            </div>
          )}

          {/* Title */}
          <h3 className={`text-2xl font-bold ${currentColor.text}`}>{title}</h3>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Image section */}
        <motion.div
          className={`${imageOrder} flex justify-center`}
          variants={imageVariants}
        >
          {image && (
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>

              {/* Main image */}
              <div className="relative bg-white dark:bg-gray-800 p-2 rounded-xl shadow-xl">
                {image}
              </div>

              {/* Animated dots */}
              <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-secondary-500"></div>
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary-500 opacity-70"></div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

// Sub-component for creating a list of features with icons
FeatureHighlight.List = ({
  features = [],
  columns = 3,
  animate = true,
  colorful = false,
  className = "",
  ...props
}) => {
  // Define grid classes based on columns
  const gridClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  // Colors for features if colorful is true
  const colors = [
    "primary",
    "secondary",
    "accent",
    "primary",
    "secondary",
    "accent",
  ];

  return (
    <motion.div
      className={`grid gap-6 ${
        gridClasses[columns] || gridClasses[3]
      } ${className}`}
      initial={animate ? "hidden" : false}
      whileInView={animate ? "visible" : false}
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
      {...props}
    >
      {features.map((feature, index) => (
        <motion.div
          key={index}
          className={`p-6 rounded-xl border ${
            colorful
              ? `border-${colors[index % colors.length]}-200 dark:border-${
                  colors[index % colors.length]
                }-800/30`
              : "border-gray-200 dark:border-gray-800"
          } bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300`}
          variants={animate ? itemVariants : {}}
        >
          {feature.icon && (
            <div
              className={`w-10 h-10 rounded-lg ${
                colorful
                  ? `bg-${colors[index % colors.length]}-500`
                  : "bg-primary-500"
              } flex items-center justify-center text-white mb-4`}
            >
              {feature.icon}
            </div>
          )}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {feature.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {feature.description}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default FeatureHighlight;
