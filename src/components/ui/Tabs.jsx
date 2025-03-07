// src/components/ui/Tabs.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Tabs = ({
  tabs = [],
  defaultTab = 0,
  onChange,
  variant = "underline", // underline, pills, bordered
  size = "md", // sm, md, lg
  fullWidth = false,
  className = "",
  tabClassName = "",
  contentClassName = "",
  ...props
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [indicatorWidth, setIndicatorWidth] = useState(0);
  const [indicatorLeft, setIndicatorLeft] = useState(0);
  const [tabRefs, setTabRefs] = useState([]);

  // Initialize refs for measuring tab widths
  useEffect(() => {
    setTabRefs(
      Array(tabs.length)
        .fill()
        .map(() => React.createRef())
    );
  }, [tabs.length]);

  // Handle tab changes
  const handleTabChange = (index) => {
    setActiveTab(index);
    if (onChange) {
      onChange(index);
    }
  };

  // Update indicator positions when active tab changes or tabs change
  useEffect(() => {
    if (variant === "underline" && tabRefs[activeTab]?.current) {
      const activeTabRef = tabRefs[activeTab].current;
      setIndicatorWidth(activeTabRef.offsetWidth);
      setIndicatorLeft(activeTabRef.offsetLeft);
    }
  }, [activeTab, tabRefs, variant, tabs]);

  // Size styles
  const sizeStyles = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  // Variant styles
  const variantStyles = {
    underline: {
      nav: "border-b border-gray-200 dark:border-gray-700",
      tab: `whitespace-nowrap py-2 px-1 font-medium border-b-2 border-transparent ${
        fullWidth ? "flex-1 text-center" : ""
      }`,
      activeTab: "text-primary-600 dark:text-primary-400 border-transparent",
      inactiveTab:
        "text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-700",
    },
    pills: {
      nav: "flex p-1 space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg",
      tab: `whitespace-nowrap py-2 px-3 font-medium rounded-md ${
        fullWidth ? "flex-1 text-center" : ""
      }`,
      activeTab:
        "bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm",
      inactiveTab:
        "text-gray-500 hover:text-gray-700 hover:bg-white/50 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700/50",
    },
    bordered: {
      nav: "flex p-1 space-x-1 border border-gray-200 dark:border-gray-700 rounded-lg",
      tab: `whitespace-nowrap py-2 px-3 font-medium rounded-md ${
        fullWidth ? "flex-1 text-center" : ""
      }`,
      activeTab:
        "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 border-primary-200 dark:border-primary-800",
      inactiveTab:
        "text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800",
    },
  };

  const currentVariant = variantStyles[variant] || variantStyles.underline;

  // Animation variants for the content
  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <div className={`${className}`} {...props}>
      <div className={currentVariant.nav}>
        <nav
          className={`flex ${fullWidth ? "w-full" : "space-x-8"}`}
          aria-label="Tabs"
        >
          {tabs.map((tab, index) => (
            <button
              key={index}
              ref={tabRefs[index]}
              onClick={() => handleTabChange(index)}
              className={`${currentVariant.tab} ${
                activeTab === index
                  ? currentVariant.activeTab
                  : currentVariant.inactiveTab
              } ${
                sizeStyles[size] || sizeStyles.md
              } transition-all duration-200 ${tabClassName}`}
              aria-current={activeTab === index ? "page" : undefined}
            >
              {tab.icon && <span className="mr-2">{tab.icon}</span>}
              {tab.label}
              {tab.badge && <span className="ml-2">{tab.badge}</span>}
            </button>
          ))}
        </nav>

        {/* Animated underline indicator for underline variant */}
        {variant === "underline" && (
          <motion.div
            className="h-0.5 bg-primary-600 dark:bg-primary-400 mt-[-1px]"
            initial={false}
            animate={{
              width: indicatorWidth,
              left: indicatorLeft,
            }}
            transition={{ duration: 0.2 }}
            style={{
              position: "relative",
            }}
          />
        )}
      </div>

      {/* Tab content */}
      <div className={`mt-4 ${contentClassName}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {tabs[activeTab]?.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Tabs;
