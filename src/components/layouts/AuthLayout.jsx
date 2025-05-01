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
  sideBackground = "gradient",
  sidePosition = "right",
  footerLinks = [],
  className = "",
  ...props
}) => {
  // Function to determine the background of the side panel
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
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-indigo-600"></div>
        );
      case "none":
        return (
          <div className="absolute inset-0 bg-gray-50 dark:bg-gray-900"></div>
        );
      case "gradient":
      default:
        return (
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-indigo-600">
            {/* Background decoration */}
            <motion.div
              className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            ></motion.div>
            <motion.div
              className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            ></motion.div>
            
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5 bg-grid-pattern"></div>
          </div>
        );
    }
  };

  // Determine order of content and side panel based on side position
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
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900">
      <motion.div
        className={`flex-1 flex items-center justify-center p-6 sm:p-12 ${contentOrder} ${className} bg-white dark:bg-gray-900 relative overflow-hidden`}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        {...props}
      >
        {/* Subtle background decoration for the form side */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/70 to-white/70 dark:from-gray-900/70 dark:to-gray-800/70 backdrop-blur-sm"></div>
        
        <div className="relative z-10 w-full max-w-md">
          <div className="mb-6 flex justify-between items-center">
            {showBackButton ? (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link
                  to="/"
                  className="flex items-center text-gray-600 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 transition-colors duration-200 font-montserrat text-sm"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back to home
                </Link>
              </motion.div>
            ) : (
              <div></div>
            )}
            <ThemeToggle.ThemeToggleMini />
          </div>

          {showLogo && (
            <motion.div className="text-center mb-8" variants={itemVariants}>
              <Link to="/" className="inline-block">
                <h1 className="text-3xl font-bold font-playfair bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">
                  ChronoSpace
                </h1>
              </Link>
            </motion.div>
          )}

          {(title || subtitle) && (
            <motion.div className="text-center mb-8" variants={itemVariants}>
              {title && (
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-playfair">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-gray-600 dark:text-gray-400 mt-2 font-montserrat">
                  {subtitle}
                </p>
              )}
            </motion.div>
          )}

          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 shadow-md rounded-xl border border-gray-100 dark:border-gray-700 p-6"
          >
            {children}
          </motion.div>

          {footerLinks.length > 0 && (
            <motion.div
              className="mt-8 text-center text-gray-600 dark:text-gray-400 font-montserrat"
              variants={itemVariants}
            >
              {footerLinks.map((link, index) => (
                <span key={index}>
                  {index > 0 && " • "}
                  {link.to ? (
                    <Link
                      to={link.to}
                      className="text-violet-600 dark:text-violet-400 hover:underline font-medium"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="text-violet-600 dark:text-violet-400 hover:underline font-medium"
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
        className={`hidden lg:flex lg:flex-1 relative overflow-hidden ${sideOrder}`}
        initial={{ opacity: 0, x: sidePosition === "right" ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {getSideBackground()}

        <div className="relative z-10 w-full flex items-center justify-center p-12">
          <div className="max-w-md">
            {sideContent ? (
              sideContent
            ) : (
              <div className="space-y-6 text-white">
                <motion.h2 
                  className="text-3xl font-bold font-playfair"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Welcome to ChronoSpace
                </motion.h2>
                
                <motion.p 
                  className="text-lg opacity-90 font-montserrat leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Your space for timeless content. Discover high-quality
                  articles, share your thoughts, and connect with a community of
                  passionate writers.
                </motion.p>

                <motion.div 
                  className="space-y-6 pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
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
                      <h3 className="text-white font-medium font-playfair">
                        Personalized Experience
                      </h3>
                      <p className="text-white/80 text-sm font-montserrat">
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
                      <h3 className="text-white font-medium font-playfair">
                        Engage with the Community
                      </h3>
                      <p className="text-white/80 text-sm font-montserrat">
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
                      <h3 className="text-white font-medium font-playfair">
                        Become a Creator
                      </h3>
                      <p className="text-white/80 text-sm font-montserrat">
                        Share your knowledge and passion with the world
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Button
                    variant="white"
                    className="mt-6 bg-white/10 border-white/30 text-white hover:bg-white/20 transition-colors shadow-lg"
                    href="/"
                    shadowDepth="deep"
                  >
                    Learn More
                  </Button>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
