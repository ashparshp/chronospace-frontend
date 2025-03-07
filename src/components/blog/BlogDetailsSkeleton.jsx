// src/components/blog/BlogDetailsSkeleton.jsx
import { motion } from "framer-motion";

const BlogDetailsSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Category & Tags skeleton */}
        <div className="flex space-x-2">
          <div className="w-24 h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
        </div>

        {/* Title skeleton */}
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>

        {/* Author and date */}
        <div className="flex items-center space-x-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
          </div>
        </div>
      </motion.div>

      {/* Banner skeleton */}
      <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>

      {/* Content skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
            style={{ width: `${Math.random() * 40 + 60}%` }}
          ></div>
        ))}

        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>

        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i + 5}
            className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
            style={{ width: `${Math.random() * 40 + 60}%` }}
          ></div>
        ))}
      </div>

      {/* Tags skeleton */}
      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"
          ></div>
        ))}
      </div>

      {/* Blog engagement skeleton */}
      <div className="flex items-center justify-between py-4 border-t border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-1">
            <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 w-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center space-x-1">
            <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 w-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center space-x-1">
            <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 w-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Comments section skeleton */}
      <div className="pt-6 space-y-6">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 animate-pulse"></div>

        {/* Comment form skeleton */}
        <div className="flex items-start space-x-4">
          <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
          <div className="flex-1 h-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>

        {/* Comment items skeleton */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex space-x-4 border-b border-gray-100 dark:border-gray-800 pb-6"
          >
            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full shrink-0 animate-pulse"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/6 animate-pulse"></div>
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse mt-1"></div>
              <div className="flex gap-4 mt-2">
                <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogDetailsSkeleton;
