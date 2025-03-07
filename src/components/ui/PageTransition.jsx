// src/components/ui/PageTransition.jsx
import { motion } from "framer-motion";

const PageTransition = ({
  children,
  transition = "fade", // fade, slideUp, slideLeft, zoom, none
  duration = 0.5,
  delay = 0,
  className = "",
  mode = "wait", // wait, sync
  ...props
}) => {
  // Define transition presets
  const transitions = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    },
    slideDown: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
    },
    slideLeft: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 },
    },
    slideRight: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20 },
    },
    zoom: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.05 },
    },
    zoomOut: {
      initial: { opacity: 0, scale: 1.05 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
    },
    none: {
      initial: {},
      animate: {},
      exit: {},
    },
  };

  // Get selected transition
  const selectedTransition = transitions[transition] || transitions.fade;

  // Create transition timing
  const timing = {
    duration,
    delay,
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={{
        initial: selectedTransition.initial,
        animate: {
          ...selectedTransition.animate,
          transition: {
            ...timing,
            when: "beforeChildren",
            staggerChildren: 0.1,
          },
        },
        exit: {
          ...selectedTransition.exit,
          transition: {
            ...timing,
            when: "afterChildren",
            staggerChildren: 0.05,
            staggerDirection: -1,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Child component for staggered animations
PageTransition.Item = ({
  children,
  delay = 0,
  duration = 0.3,
  transition = "fade", // fade, slideUp, slideLeft, zoom
  className = "",
  ...props
}) => {
  // Define transition presets for items
  const itemTransitions = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
    },
    slideLeft: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20 },
    },
    zoom: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.9 },
    },
  };

  // Get selected transition
  const selectedTransition =
    itemTransitions[transition] || itemTransitions.fade;

  return (
    <motion.div
      variants={{
        initial: selectedTransition.initial,
        animate: {
          ...selectedTransition.animate,
          transition: { duration, delay },
        },
        exit: {
          ...selectedTransition.exit,
          transition: { duration: duration / 2, delay: 0 },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Example usage:
/*
<PageTransition transition="slideUp">
  <PageTransition.Item>
    <h1>This will animate in first</h1>
  </PageTransition.Item>
  <PageTransition.Item>
    <p>This will animate in second</p>
  </PageTransition.Item>
</PageTransition>
*/

export default PageTransition;
