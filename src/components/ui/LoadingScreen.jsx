// src/components/ui/LoadingScreen.jsx
import { motion } from "framer-motion";

const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="w-20 h-20 relative"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-500 rounded-full opacity-70"></div>
          <div className="absolute inset-2 bg-background-light dark:bg-background-dark rounded-full"></div>
          <div className="absolute inset-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"></div>
        </motion.div>
        <motion.h2
          className="mt-6 text-xl font-medium text-text-light dark:text-text-dark"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Loading...
        </motion.h2>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
