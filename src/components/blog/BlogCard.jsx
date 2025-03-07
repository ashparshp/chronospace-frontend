// src/components/blog/BlogCard.jsx
import { useNavigate } from "react-router-dom";
import { format, parseISO, isValid } from "date-fns";
import { Heart, MessageSquare, Eye, Bookmark } from "lucide-react";
import { motion } from "framer-motion";
import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";

const BlogCard = ({ blog, className = "", variant = "default" }) => {
  const navigate = useNavigate();

  const handleBlogClick = () => {
    navigate(`/blog/${blog.blog_id}`);
  };

  const handleAuthorClick = (e) => {
    e.stopPropagation();
    // Only navigate if author exists
    if (blog.author && blog.author.personal_info) {
      navigate(`/profile/${blog.author.personal_info.username}`);
    }
  };

  // Format date safely with better error handling
  const formatDate = (dateString) => {
    if (!dateString) return "No date";

    try {
      // Try to parse the date string
      const date = new Date(dateString);

      // Check if the date is valid
      if (!isNaN(date.getTime())) {
        return format(date, "MMM d, yyyy");
      }

      // Try parseISO as a fallback
      const parsedDate = parseISO(dateString);
      if (isValid(parsedDate)) {
        return format(parsedDate, "MMM d, yyyy");
      }

      return "Invalid date";
    } catch (error) {
      console.error("Error formatting date:", error, dateString);
      return "Invalid date";
    }
  };

  // Card variants
  const cardVariants = {
    default: "bg-white dark:bg-gray-800 shadow-custom",
    gradient: "card-gradient",
    minimal:
      "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800",
    featured:
      "bg-gradient-to-r from-primary-500/10 to-secondary-500/10 dark:from-primary-900/20 dark:to-secondary-900/20",
  };

  // Animation variants
  const animationVariants = {
    hover: {
      y: -8,
      boxShadow: "0 15px 30px rgba(0, 0, 0, 0.12)",
      transition: { duration: 0.3, ease: "easeOut" },
    },
    tap: {
      y: -2,
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.2 },
    },
  };

  const isPremium = blog.is_premium;

  return (
    <motion.div
      className={`rounded-xl overflow-hidden cursor-pointer h-full flex flex-col transition-all duration-300 ${
        cardVariants[variant] || cardVariants.default
      } ${className}`}
      whileHover={animationVariants.hover}
      whileTap={animationVariants.tap}
      onClick={handleBlogClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Blog Banner Image */}
      <div className="relative">
        {blog.banner ? (
          <div className="h-48 overflow-hidden">
            <img
              src={blog.banner}
              alt={blog.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        ) : (
          <div className="h-32 bg-gradient-to-r from-primary-500 to-secondary-500" />
        )}

        {/* Premium badge */}
        {isPremium && (
          <div className="absolute top-3 right-3">
            <Badge
              variant="accent"
              className="bg-accent-500 text-white font-semibold"
              dot
            >
              Premium
            </Badge>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                animate
                className="transition-all duration-300 hover:bg-secondary-100 dark:hover:bg-secondary-900/30"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/tag/${tag}`);
                }}
              >
                {tag}
              </Badge>
            ))}
            {blog.tags.length > 3 && (
              <Badge variant="secondary">+{blog.tags.length - 3}</Badge>
            )}
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
          {blog.title}
        </h3>

        {/* Description */}
        {blog.des && (
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 flex-grow">
            {blog.des}
          </p>
        )}

        {/* Bottom Info */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
          {/* Author - Add null check for author */}
          {blog.author && blog.author.personal_info ? (
            <div
              className="flex items-center gap-2 cursor-pointer group"
              onClick={handleAuthorClick}
            >
              <Avatar
                src={blog.author.personal_info.profile_img}
                alt={blog.author.personal_info.fullname}
                size="sm"
                animate
              />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                  {blog.author.personal_info.fullname}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(blog.publishedAt)}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Avatar size="sm" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Unknown Author
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(blog.publishedAt)}
                </p>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1 transition-colors duration-200 hover:text-red-500">
              <Heart size={16} />
              <span>{blog.activity?.total_likes || 0}</span>
            </div>
            <div className="flex items-center gap-1 transition-colors duration-200 hover:text-blue-500">
              <MessageSquare size={16} />
              <span>{blog.activity?.total_comments || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye size={16} />
              <span>{blog.activity?.total_reads || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogCard;
