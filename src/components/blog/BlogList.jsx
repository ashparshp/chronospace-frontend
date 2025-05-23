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
  layout = "grid",
  className = "",
  blogCardVariant = "default",
}) => {
  const [renderedBlogs, setRenderedBlogs] = useState([]);
  const [visibleCount, setVisibleCount] = useState(0);
  const animationDelay = 0.05;

  useEffect(() => {
    setRenderedBlogs(blogs);
    setVisibleCount(0);
  }, [blogs]);

  useEffect(() => {
    if (renderedBlogs.length > 0 && visibleCount < renderedBlogs.length) {
      const timer = setTimeout(() => {
        setVisibleCount((prev) => Math.min(prev + 1, renderedBlogs.length));
      }, animationDelay * 1000);

      return () => clearTimeout(timer);
    }
  }, [renderedBlogs, visibleCount]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const layoutClasses = {
    grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
    list: "flex flex-col space-y-6",
    featured: "grid grid-cols-1 gap-6",
  };

  if (error) {
    return (
      <EmptyState
        title="Error loading blogs"
        description={error.message || "Something went wrong. Please try again later."}
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
        className={layoutClasses[layout] || layoutClasses.grid}
      >
        {renderedBlogs.slice(0, visibleCount).map((blog) => (
          <motion.div key={blog.blog_id} variants={itemVariants}>
            <BlogCard blog={blog} variant={blogCardVariant} layout={layout} />
          </motion.div>
        ))}

        {loading &&
          Array.from({ length: 3 }).map((_, index) => (
            <motion.div
              key={`skeleton-${index}`}
              variants={itemVariants}
              className={`bg-white dark:bg-black rounded-xl shadow-md p-4 h-full animate-pulse ${
                layout === "list" ? "flex flex-col" : ""
              }`}
            >
              <div className="h-48 bg-gray-200 dark:bg-black rounded-md mb-4"></div>
              <div className="h-6 bg-gray-200 dark:bg-black rounded-md mb-3 w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-black rounded-md mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-black rounded-md mb-4 w-5/6"></div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-black"></div>
                  <div>
                    <div className="h-4 w-24 bg-gray-200 dark:bg-black rounded-md"></div>
                    <div className="h-3 w-16 bg-gray-200 dark:bg-black rounded-md mt-1"></div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-4 w-8 bg-gray-200 dark:bg-black rounded-md"></div>
                  <div className="h-4 w-8 bg-gray-200 dark:bg-black rounded-md"></div>
                  <div className="h-4 w-8 bg-gray-200 dark:bg-black rounded-md"></div>
                </div>
              </div>
            </motion.div>
          ))}
      </motion.div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: visibleCount === renderedBlogs.length ? 1 : 0,
              y: visibleCount === renderedBlogs.length ? 0 : 20,
            }}
            transition={{ duration: 0.5 }}
          >
            <Button
              variant="outline"
              onClick={onLoadMore}
              disabled={loading}
              className="px-6 py-2.5 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-black"
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
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default BlogList;
