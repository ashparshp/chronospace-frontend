// src/components/ui/AnimatedElement.jsx
import { motion } from "framer-motion";

// Animation presets
const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  fadeInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  fadeInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  zoomIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  },
  zoomOut: {
    initial: { opacity: 0, scale: 1.1 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.1 },
  },
  slideUp: {
    initial: { y: "100%" },
    animate: { y: 0 },
    exit: { y: "100%" },
  },
  slideDown: {
    initial: { y: "-100%" },
    animate: { y: 0 },
    exit: { y: "-100%" },
  },
  slideLeft: {
    initial: { x: "100%" },
    animate: { x: 0 },
    exit: { x: "100%" },
  },
  slideRight: {
    initial: { x: "-100%" },
    animate: { x: 0 },
    exit: { x: "-100%" },
  },
  pulse: {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "loop",
      },
    },
  },
  bounce: {
    animate: {
      y: ["0%", "-15%", "0%"],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "loop",
      },
    },
  },
  float: {
    animate: {
      y: ["0%", "-10%", "0%"],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
      },
    },
  },
};

// Default transition
const defaultTransition = {
  duration: 0.4,
  ease: "easeOut",
};

// Component for animated elements
const AnimatedElement = ({
  children,
  animation = "fadeIn", // Animation preset name
  duration, // Override duration
  delay = 0, // Delay before animation starts
  ease, // Override easing function
  once = false, // Animation happens only once when in view
  amount = 0.2, // How much of element needs to be in view
  transition, // Override entire transition object
  as = "div", // HTML element or component to render
  whileHover, // Hover animation
  whileTap, // Tap/click animation
  className = "",
  ...props
}) => {
  // Get selected animation preset
  const selectedAnimation = animations[animation] || animations.fadeIn;

  // Create transition with overrides
  const animationTransition = {
    ...defaultTransition,
    delay,
    ...(duration ? { duration } : {}),
    ...(ease ? { ease } : {}),
    ...(transition || {}),
  };

  // Create final variants with transition applied
  const variants = {
    ...selectedAnimation,
    animate: {
      ...selectedAnimation.animate,
      transition: animationTransition,
    },
    exit: selectedAnimation.exit
      ? {
          ...selectedAnimation.exit,
          transition: {
            ...animationTransition,
            delay: 0, // No delay on exit animations
          },
        }
      : undefined,
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      whileHover={whileHover}
      whileTap={whileTap}
      viewport={once ? { once: true, amount } : undefined}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedElement;
