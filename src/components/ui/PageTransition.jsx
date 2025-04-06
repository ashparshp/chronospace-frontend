import { motion } from "framer-motion";

const PageTransition = ({
  children,
  transition = "fade",
  duration = 0.5,
  delay = 0,
  className = "",
  mode = "wait",
  ...props
}) => {
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

  const selectedTransition = transitions[transition] || transitions.fade;

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

PageTransition.Item = ({
  children,
  delay = 0,
  duration = 0.3,
  transition = "fade",
  className = "",
  ...props
}) => {
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

export default PageTransition;
