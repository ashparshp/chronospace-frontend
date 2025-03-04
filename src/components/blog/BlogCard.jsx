// src/components/blog/BlogCard.jsx
import { useNavigate } from "react-router-dom";
import { format, parseISO, isValid } from "date-fns";
import { Heart, MessageSquare, Eye } from "lucide-react";
import Avatar from "../ui/Avatar";
import Card from "../ui/Card";
import Badge from "../ui/Badge";

const BlogCard = ({ blog, className = "" }) => {
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

  return (
    <Card
      className={`overflow-hidden h-full cursor-pointer transition-shadow hover:shadow-custom-lg ${className}`}
      animate
      onClick={handleBlogClick}
    >
      {/* Blog Banner Image */}
      {blog.banner && (
        <div className="h-48 overflow-hidden">
          <img
            src={blog.banner}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
          />
        </div>
      )}

      <div className="px-6 py-5">
        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="hover:bg-secondary-200 dark:hover:bg-secondary-800 cursor-pointer"
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
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
          {blog.title}
        </h3>

        {/* Description */}
        {blog.des && (
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base mb-4 line-clamp-2">
            {blog.des}
          </p>
        )}

        {/* Bottom Info */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
          {/* Author - Add null check for author */}
          {blog.author && blog.author.personal_info ? (
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={handleAuthorClick}
            >
              <Avatar
                src={blog.author.personal_info.profile_img}
                alt={blog.author.personal_info.fullname}
                size="sm"
              />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
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
            <div className="flex items-center gap-1">
              <Heart size={16} />
              <span>{blog.activity?.total_likes || 0}</span>
            </div>
            <div className="flex items-center gap-1">
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
    </Card>
  );
};

export default BlogCard;
