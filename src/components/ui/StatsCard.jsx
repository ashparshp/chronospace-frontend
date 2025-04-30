import React from "react";
import { motion } from "framer-motion";

const StatCard = ({
  icon,
  title,
  value,
  trend = null,
  subStats = null,
  action = null,
  delay = 0,
  iconBgColor = "bg-violet-500/20",
  iconColor = "text-violet-600 dark:text-violet-400",
  trendColor = "text-green-600 dark:text-green-400",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700/20 shadow-sm dark:bg-gray-800/90"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-700 dark:text-gray-300 text-sm font-montserrat">
            {title}
          </p>
          <h3 className="text-gray-900 dark:text-white font-playfair text-2xl font-bold">
            {typeof value === "number" ? value.toLocaleString() : value}
          </h3>
          {trend && (
            <div
              className={`flex items-center mt-1 ${trendColor} text-xs font-montserrat`}
            >
              {trend.icon}
              <span>{trend.text}</span>
            </div>
          )}
        </div>
        <div className={`${iconBgColor} rounded-lg p-2.5`}>
          {React.cloneElement(icon, { className: `h-6 w-6 ${iconColor}` })}
        </div>
      </div>

      {(subStats || action) && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700/30 flex justify-between text-xs">
          {subStats ? (
            <>
              {subStats.map((stat, index) => (
                <div key={index} className={index > 0 ? "text-right" : ""}>
                  <p className="text-gray-500 dark:text-gray-400 font-montserrat">
                    {stat.label}
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white font-montserrat mt-0.5">
                    {typeof stat.value === "number"
                      ? stat.value.toLocaleString()
                      : stat.value}
                  </p>
                </div>
              ))}
            </>
          ) : action ? (
            <div className="w-full">{action}</div>
          ) : null}
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;
