// src/components/ui/Card.jsx
import { motion } from "framer-motion";

const Card = ({
  children,
  className = "",
  animate = false,
  onClick,
  ...props
}) => {
  const baseStyles =
    "bg-white dark:bg-gray-800 rounded-lg shadow-custom overflow-hidden";

  if (animate) {
    return (
      <motion.div
        className={`${baseStyles} ${className}`}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        whileTap={{ y: 0 }}
        onClick={onClick}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${baseStyles} ${className}`} onClick={onClick} {...props}>
      {children}
    </div>
  );
};

export default Card;
