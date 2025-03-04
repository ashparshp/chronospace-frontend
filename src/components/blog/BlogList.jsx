// src/components/blog/BlogList.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import BlogCard from "./BlogCard";
import EmptyState from "../ui/EmptyState";
import Button from "../ui/Button";

const BlogList = ({
  blogs = [],
  loading = false,
  error = null,
  onLoadMore,
  hasMore = false,
  emptyTitle = "No blogs found",
  emptyDescription = "No blog posts were found matching your criteria.",
  emptyActionText,
  emptyActionLink,
  emptyActionClick,
  className = "",
}) => {
  const [renderedBlogs, setRenderedBlogs] = useState([]);

  // Update rendered blogs when blogs prop changes
  useEffect(() => {
    setRenderedBlogs(blogs);
  }, [blogs]);

  // Container variants for animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Individual item variants for animation
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (error) {
    return (
      <EmptyState
        title="Error loading blogs"
        description={
          error.message || "Something went wrong. Please try again later."
        }
        actionText="Try Again"
        actionClick={() => window.location.reload()}
        className={className}
      />
    );
  }

  if (!loading && renderedBlogs.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionText={emptyActionText}
        actionLink={emptyActionLink}
        actionClick={emptyActionClick}
        className={className}
      />
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {renderedBlogs.map((blog) => (
          <motion.div key={blog.blog_id} variants={itemVariants}>
            <BlogCard blog={blog} />
          </motion.div>
        ))}

        {/* Loading placeholders */}
        {loading &&
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 h-full"
            >
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mb-4"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mb-3 w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mb-4 w-5/6"></div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  <div>
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                    <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mt-1"></div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                  <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                  <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
      </motion.div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={loading}
            className="px-6"
          >
            {loading ? (
              <>
                <Loader className="animate-spin mr-2 h-4 w-4" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default BlogList;
