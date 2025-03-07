// src/components/blog/FeaturedBlogCard.jsx
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

  // Get gradient based on blog category or default
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
      className={`relative h-full overflow-hidden rounded-xl cursor-pointer shadow-xl ${className}`}
      whileHover={{
        y: -10,
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
        transition: { duration: 0.3 },
      }}
      onClick={handleBlogClick}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 bg-black">
        {blog.banner ? (
          <>
            <img
              src={blog.banner}
              alt={blog.title}
              className="w-full h-full object-cover opacity-80 transition-transform duration-10000 hover:scale-110"
            />
            <div
              className={`absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 opacity-80`}
            ></div>
            <div
              className={`absolute inset-0 bg-gradient-to-r ${getGradient()} mix-blend-overlay opacity-30`}
            ></div>
          </>
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${getGradient()} opacity-90`}
          ></div>
        )}
      </div>

      {/* Animated light effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0"
        animate={{
          opacity: [0, 0.5, 0],
          left: ["-100%", "100%", "100%"],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatDelay: 5,
        }}
      />

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6 text-white">
        {/* Featured Badge */}
        <div className="absolute top-4 left-4">
          <Badge
            variant="accent"
            className="bg-gradient-to-r from-accent-600 to-accent-500 text-white shadow-lg shadow-accent-600/30 px-3 py-1 uppercase text-xs tracking-wider font-semibold"
            animate
          >
            Featured
          </Badge>
        </div>

        {/* Premium Badge if applicable */}
        {blog.is_premium && (
          <div className="absolute top-4 right-4">
            <Badge
              variant="accent"
              className="bg-gradient-to-r from-secondary-600 to-secondary-500 text-white shadow-lg shadow-secondary-600/30 px-3 py-1 uppercase text-xs tracking-wider font-semibold"
              animate
              dot
            >
              Premium
            </Badge>
          </div>
        )}

        {/* Category if available */}
        {blog.category && (
          <div className="mb-2">
            <Badge
              variant="secondary"
              className="bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 transition-colors duration-300 text-xs uppercase tracking-wider"
            >
              {blog.category}
            </Badge>
          </div>
        )}

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/tag/${tag}`);
                }}
                animate
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Title with gradient text shadow for better readability */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
          {blog.title}
        </h2>

        {/* Description */}
        {blog.des && (
          <p className="text-white/90 mb-4 line-clamp-2 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
            {blog.des}
          </p>
        )}

        {/* Author & Date */}
        <div
          className="flex items-center gap-3 mt-4 cursor-pointer group"
          onClick={handleAuthorClick}
        >
          <Avatar
            src={blog.author.personal_info.profile_img}
            alt={blog.author.personal_info.fullname}
            size="md"
            className="border-2 border-white/70 group-hover:border-white transition-all duration-300 shadow-lg"
            animate
          />
          <div>
            <p className="font-semibold text-white group-hover:text-primary-100 transition-colors duration-200">
              {blog.author.personal_info.fullname}
            </p>
            <p className="text-sm text-white/80">
              {format(new Date(blog.publishedAt), "MMM d, yyyy")} •{" "}
              {blog.estimated_read_time || "5"} min read
            </p>
          </div>
        </div>
      </div>

      {/* Hover state overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300"
        whileHover={{ opacity: 1 }}
      />
    </motion.div>
  );
};

export default FeaturedBlogCard;
