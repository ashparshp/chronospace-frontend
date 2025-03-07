// src/pages/NotFoundPage.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/ui/Button";

const NotFoundPage = () => {
  const navigate = useNavigate();

  // Auto-redirect after 10 seconds
  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      navigate("/", { replace: true });
    }, 10000);

    return () => clearTimeout(redirectTimer);
  }, [navigate]);

  // SVG animation variants
  const svgVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const pathVariants = {
    hidden: {
      opacity: 0,
      pathLength: 0,
    },
    visible: {
      opacity: 1,
      pathLength: 1,
      transition: {
        duration: 1.5,
        ease: "easeInOut",
      },
    },
  };

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "loop",
      ease: "easeInOut",
    },
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* 404 Animation */}
        <motion.div
          className="w-full h-56 relative mb-6"
          animate={floatingAnimation}
        >
          <motion.svg
            viewBox="0 0 400 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            initial="hidden"
            animate="visible"
            variants={svgVariants}
            className="w-full h-full"
          >
            {/* 4 */}
            <motion.path
              d="M80 40v80h40v40H80v40h-40v-40H0v-40l60-80h20zm-40 80V80l-30 40h30z"
              fill="url(#paint0_linear)"
              variants={pathVariants}
            />
            {/* 0 */}
            <motion.path
              d="M180 40c29.5 0 40 23.33 40 60v40c0 36.67-10.5 60-40 60s-40-23.33-40-60v-40c0-36.67 10.5-60 40-60zm0 40c-5.33 0-10 5.33-10 20v40c0 14.67 4.67 20 10 20s10-5.33 10-20v-40c0-14.67-4.67-20-10-20z"
              fill="url(#paint1_linear)"
              variants={pathVariants}
            />
            {/* 4 */}
            <motion.path
              d="M320 40v80h40v40h-40v40h-40v-40h-40v-40l60-80h20zm-40 80V80l-30 40h30z"
              fill="url(#paint2_linear)"
              variants={pathVariants}
            />

            {/* Decorative elements */}
            <motion.circle
              cx="350"
              cy="30"
              r="10"
              fill="url(#paint3_linear)"
              variants={pathVariants}
            />
            <motion.circle
              cx="30"
              cy="170"
              r="15"
              fill="url(#paint4_linear)"
              variants={pathVariants}
            />
            <motion.path
              d="M340 160l15 15M345 160l-15 15"
              stroke="url(#paint5_linear)"
              strokeWidth="5"
              strokeLinecap="round"
              variants={pathVariants}
            />

            {/* Define gradients */}
            <defs>
              <linearGradient
                id="paint0_linear"
                x1="0"
                y1="40"
                x2="120"
                y2="200"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4F46E5" />
                <stop offset="1" stopColor="#10B981" />
              </linearGradient>
              <linearGradient
                id="paint1_linear"
                x1="140"
                y1="40"
                x2="220"
                y2="200"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4F46E5" />
                <stop offset="1" stopColor="#06B6D4" />
              </linearGradient>
              <linearGradient
                id="paint2_linear"
                x1="240"
                y1="40"
                x2="360"
                y2="200"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#06B6D4" />
                <stop offset="1" stopColor="#10B981" />
              </linearGradient>
              <linearGradient
                id="paint3_linear"
                x1="340"
                y1="20"
                x2="360"
                y2="40"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4F46E5" />
                <stop offset="1" stopColor="#06B6D4" />
              </linearGradient>
              <linearGradient
                id="paint4_linear"
                x1="15"
                y1="155"
                x2="45"
                y2="185"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#10B981" />
                <stop offset="1" stopColor="#06B6D4" />
              </linearGradient>
              <linearGradient
                id="paint5_linear"
                x1="325"
                y1="160"
                x2="355"
                y2="175"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4F46E5" />
                <stop offset="1" stopColor="#10B981" />
              </linearGradient>
            </defs>
          </motion.svg>
        </motion.div>

        <motion.h1
          className="text-4xl font-bold gradient-heading"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Page Not Found
        </motion.h1>

        <motion.p
          className="text-lg text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          Oops! We couldn't find the page you're looking for. It might have been
          moved, deleted, or never existed.
        </motion.p>

        <motion.div
          className="pt-6 flex flex-col sm:flex-row justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <Button
            variant="gradient"
            size="lg"
            onClick={() => navigate("/")}
            className="px-8"
          >
            Go to Homepage
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate(-1)}
            className="px-8"
          >
            Go Back
          </Button>
        </motion.div>

        <motion.div
          className="text-sm text-gray-500 dark:text-gray-500 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.5 }}
        >
          You'll be automatically redirected to the homepage in 10 seconds
        </motion.div>

        {/* Auto-redirect progress */}
        <motion.div
          className="w-full bg-gray-100 dark:bg-gray-800 h-1 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-secondary"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 10, ease: "linear" }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;
