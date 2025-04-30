import { motion } from "framer-motion";
import Button from "./Button";
import { useState, useEffect } from "react";

const EmptyState = ({
  title,
  description,
  icon,
  image,
  actionText,
  actionLink,
  actionClick,
  secondaryActionText,
  secondaryActionLink,
  secondaryActionClick,
  className = "",
  ...props
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <motion.div
      className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      {...props}
    >
      {isLoading ? (
        <motion.div className="flex items-center justify-center" variants={itemVariants}>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </motion.div>
      ) : (
        <>
          {icon && (
            <motion.div
              className="text-gray-400 dark:text-gray-500 mb-6"
              variants={itemVariants}
            >
              {icon}
            </motion.div>
          )}

          {image && (
            <motion.div className="mb-6 max-w-xs" variants={itemVariants}>
              <img
                src={image}
                alt={title || "Empty state illustration"}
                className="w-full h-auto"
              />
            </motion.div>
          )}

          {title && (
            <motion.h3
              className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2"
              variants={itemVariants}
            >
              {title}
            </motion.h3>
          )}

          {description && (
            <motion.p
              className="text-gray-600 dark:text-gray-400 mb-8 max-w-md"
              variants={itemVariants}
            >
              {description}
            </motion.p>
          )}

          <motion.div
            className="flex flex-col sm:flex-row gap-3"
            variants={itemVariants}
          >
            {actionText && actionLink && (
              <Button href={actionLink} variant="primary" size="md" animate>
                {actionText}
              </Button>
            )}

            {actionText && actionClick && (
              <Button onClick={actionClick} variant="primary" size="md" animate>
                {actionText}
              </Button>
            )}

            {secondaryActionText && secondaryActionLink && (
              <Button
                href={secondaryActionLink}
                variant="outline"
                size="md"
                animate
              >
                {secondaryActionText}
              </Button>
            )}

            {secondaryActionText && secondaryActionClick && (
              <Button
                onClick={secondaryActionClick}
                variant="outline"
                size="md"
                animate
              >
                {secondaryActionText}
              </Button>
            )}
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default EmptyState;
