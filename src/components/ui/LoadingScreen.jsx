import { motion } from "framer-motion";

const LoadingScreen = () => {
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const circleVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const pulseVariants = {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const textVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5,
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const shadowDots = Array(5).fill(null);
  const dotVariants = {
    initial: { y: 0 },
    animate: (index) => ({
      y: [0, -10, 0],
      transition: {
        delay: index * 0.1,
        duration: 0.6,
        repeat: Infinity,
        repeatType: "mirror",
      },
    }),
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
      <motion.div
        className="flex flex-col items-center"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <motion.div
          className="relative w-24 h-24 mb-8"
          variants={circleVariants}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-500 rounded-full opacity-30"
            variants={pulseVariants}
          />
          <motion.div
            className="absolute inset-3 bg-background-light dark:bg-background-dark rounded-full"
            variants={circleVariants}
          />
          <motion.div
            className="absolute inset-6 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
            variants={pulseVariants}
            custom={1}
          />
          <motion.div
            className="absolute inset-9 bg-background-light dark:bg-background-dark rounded-full"
            variants={circleVariants}
          />
          <motion.div
            className="absolute inset-11 bg-gradient-to-r from-accent-500 to-secondary-500 rounded-full"
            variants={pulseVariants}
            custom={2}
          />
        </motion.div>

        <div className="flex space-x-2 justify-center mb-8">
          {shadowDots.map((_, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={dotVariants}
              animate="animate"
              initial="initial"
              className="w-2 h-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
            />
          ))}
        </div>

        <motion.h2
          className="text-xl font-medium gradient-heading"
          variants={textVariants}
        >
          Loading...
        </motion.h2>
        <motion.p
          className="mt-2 text-gray-600 dark:text-gray-400 text-center max-w-sm px-4"
          variants={textVariants}
        >
          Please wait while we prepare your experience
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
