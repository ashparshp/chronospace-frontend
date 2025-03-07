// src/components/layouts/AuthLayout.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import Button from "../ui/Button";
import ThemeToggle from "../ui/ThemeToggle";

const AuthLayout = ({
  children,
  title,
  subtitle,
  showLogo = true,
  showBackButton = true,
  sideContent,
  sideImage,
  sideBackground = "gradient", // gradient, image, none
  sidePosition = "right", // left, right
  footerLinks = [],
  className = "",
  ...props
}) => {
  // Background for the side panel
  const getSideBackground = () => {
    switch (sideBackground) {
      case "image":
        return sideImage ? (
          <div className="absolute inset-0">
            <img
              src={sideImage}
              alt="Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/40"></div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-secondary-600"></div>
        );
      case "none":
        return (
          <div className="absolute inset-0 bg-gray-50 dark:bg-black"></div>
        );
      case "gradient":
      default:
        return (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-secondary-600"></div>
        );
    }
  };

  // Layout structure based on side position
  const contentOrder = sidePosition === "left" ? "order-last" : "order-first";
  const sideOrder = sidePosition === "left" ? "order-first" : "order-last";

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className=" flex flex-col md:flex-row bg-white dark:bg-black">
      {/* Main content */}
      <motion.div
        className={`flex-1 flex items-center justify-center p-6 sm:p-12 ${contentOrder} ${className}`}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        {...props}
      >
        <div className="w-full max-w-md">
          {/* Theme toggle on mobile */}
          <div className="mb-6 flex justify-between items-center">
            {showBackButton ? (
              <Link
                to="/"
                className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to home
              </Link>
            ) : (
              <div></div>
            )}
            <ThemeToggle.ThemeToggleMini />
          </div>

          {/* Logo */}
          {showLogo && (
            <motion.div className="text-center mb-8" variants={itemVariants}>
              <Link to="/" className="inline-block mb-6">
                <h1 className="text-3xl font-bold bg-gradient-primary text-transparent bg-clip-text">
                  ChronoSpace
                </h1>
              </Link>
            </motion.div>
          )}

          {/* Title & Subtitle */}
          {(title || subtitle) && (
            <motion.div className="text-center mb-8" variants={itemVariants}>
              {title && (
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {subtitle}
                </p>
              )}
            </motion.div>
          )}

          {/* Main content */}
          <motion.div variants={itemVariants}>{children}</motion.div>

          {/* Footer links */}
          {footerLinks.length > 0 && (
            <motion.div
              className="mt-8 text-center text-gray-600 dark:text-gray-400"
              variants={itemVariants}
            >
              {footerLinks.map((link, index) => (
                <span key={index}>
                  {index > 0 && " • "}
                  {link.to ? (
                    <Link
                      to={link.to}
                      className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                    >
                      {link.label}
                    </a>
                  )}
                </span>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Side panel */}
      <motion.div
        className={`hidden md:flex md:flex-1 bg-gray-100 dark:bg-black relative overflow-hidden ${sideOrder}`}
        initial={{ opacity: 0, x: sidePosition === "right" ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {getSideBackground()}

        <div className="relative z-10 w-full flex items-center justify-center p-12">
          <div className="max-w-md text-white">
            {sideContent ? (
              sideContent
            ) : (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">Welcome to ChronoSpace</h2>
                <p className="text-lg opacity-90">
                  Your space for timeless content. Discover high-quality
                  articles, share your thoughts, and connect with a community of
                  passionate writers.
                </p>

                <div className="space-y-6 pt-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 bg-white/20 rounded-full flex items-center justify-center mr-3">
                      <svg
                        className="h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-medium">
                        Personalized Experience
                      </h3>
                      <p className="text-white/80 text-sm">
                        Discover content tailored to your interests
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 bg-white/20 rounded-full flex items-center justify-center mr-3">
                      <svg
                        className="h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-medium">
                        Engage with the Community
                      </h3>
                      <p className="text-white/80 text-sm">
                        Comment, like, and share your favorite posts
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 bg-white/20 rounded-full flex items-center justify-center mr-3">
                      <svg
                        className="h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-medium">
                        Become a Creator
                      </h3>
                      <p className="text-white/80 text-sm">
                        Share your knowledge and passion with the world
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="mt-4 bg-white/10 border-white/30 text-white hover:bg-white/20 transition-colors"
                  href="/"
                >
                  Learn More
                </Button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
