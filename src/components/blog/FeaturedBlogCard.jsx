import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { motion } from "framer-motion";
import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";

const FeaturedBlogCard = ({ blog, className = "" }) => {
  const navigate = useNavigate();

  const handleBlogClick = () => {
    navigate(`/blog/${blog.blog_id}`);
  };

  const handleAuthorClick = (e) => {
    e.stopPropagation();
    navigate(`/profile/${blog.author.personal_info.username}`);
  };

  const handleTagClick = (e, tag) => {
    e.stopPropagation();
    navigate(`/tag/${tag}`);
  };

  const getGradient = () => {
    const gradients = {
      technology: "from-indigo-600 to-blue-500",
      programming: "from-blue-600 to-cyan-500",
      science: "from-cyan-500 to-teal-400",
      health: "from-teal-500 to-green-400",
      business: "from-orange-500 to-amber-400",
      lifestyle: "from-pink-500 to-rose-400",
      default: "from-primary-600 to-secondary-600",
    };

    return gradients[blog.category] || gradients.default;
  };

  return (
    <motion.div 
      className={`relative group rounded-xl overflow-hidden cursor-pointer shadow-xl ${className}`}
      onClick={handleBlogClick}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated Gradient Border */}
      <motion.div 
        className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl blur opacity-30 group-hover:opacity-70 transition duration-300"
      />

      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        {blog.banner ? (
          <>
            <img
              src={blog.banner}
              alt={blog.title}
              className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black opacity-40" />
          </>
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${getGradient()} opacity-80`}
          ></div>
        )}
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 p-6 flex flex-col justify-between h-full backdrop-blur-sm">
        {/* Top Section: Badges & Category */}
        <div className="flex justify-between items-start">
          <div className="flex space-x-2">
            <Badge
              variant="accent"
              className="px-3 py-1 uppercase text-xs font-semibold shadow-lg"
            >
              Featured
            </Badge>
            {blog.is_premium && (
              <Badge
                variant="accent"
                className="px-3 py-1 uppercase text-xs font-semibold shadow-lg"
                dot
              >
                Premium
              </Badge>
            )}
          </div>
          {blog.category && (
            <Badge
              variant="secondary"
              className="bg-white/20 text-white uppercase text-xs tracking-wider"
            >
              {blog.category}
            </Badge>
          )}
        </div>

        {/* Middle Section: Title, Description & Tags */}
        <div className="mt-4 flex-1">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 drop-shadow-lg text-gray-50">
            {blog.title}
          </h2>
          {blog.des && (
            <p className="text-white/90 mb-4 line-clamp-3 drop-shadow-md">
              {blog.des}
            </p>
          )}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {blog.tags.slice(0, 3).map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-white/20 text-white uppercase text-xs tracking-wider hover:bg-white/30 transition-colors duration-300"
                  onClick={(e) => handleTagClick(e, tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Section: Author & Date */}
        <div
          className="mt-4 flex items-center p-3 bg-black/50 rounded-md backdrop-blur-sm cursor-pointer transition-colors duration-300 hover:bg-black/60"
          onClick={handleAuthorClick}
        >
          <Avatar
            src={blog.author.personal_info.profile_img}
            alt={blog.author.personal_info.fullname}
            size="md"
            className="border-2 border-white"
          />
          <div className="ml-4">
            <p className="font-semibold text-white">
              {blog.author.personal_info.fullname}
            </p>
            <p className="text-sm text-white/80">
              {format(new Date(blog.publishedAt), "MMM d, yyyy")} •{" "}
              {blog.estimated_read_time || "5"} min read
            </p>
          </div>
        </div>
      </div>

      {/* Hover Overlay Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default FeaturedBlogCard;
