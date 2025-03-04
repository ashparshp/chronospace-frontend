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

  return (
    <motion.div
      className={`relative h-full overflow-hidden rounded-lg cursor-pointer ${className}`}
      whileHover={{ y: -5 }}
      onClick={handleBlogClick}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-black">
        {blog.banner ? (
          <img
            src={blog.banner}
            alt={blog.title}
            className="w-full h-full object-cover opacity-70"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary-800 to-secondary-800 opacity-90"></div>
        )}
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6 text-white">
        {/* Featured Badge */}
        <div className="absolute top-4 left-4">
          <Badge
            variant="accent"
            className="bg-accent-500 text-white px-3 py-1 uppercase text-xs tracking-wider"
          >
            Featured
          </Badge>
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-white/20 text-white hover:bg-white/30"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/tag/${tag}`);
                }}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-shadow">
          {blog.title}
        </h2>

        {/* Description */}
        {blog.des && (
          <p className="text-white/90 mb-4 line-clamp-2 text-shadow">
            {blog.des}
          </p>
        )}

        {/* Author & Date */}
        <div
          className="flex items-center gap-3 mt-4 cursor-pointer"
          onClick={handleAuthorClick}
        >
          <Avatar
            src={blog.author.personal_info.profile_img}
            alt={blog.author.personal_info.fullname}
            size="md"
            className="border-2 border-white"
          />
          <div>
            <p className="font-medium text-white">
              {blog.author.personal_info.fullname}
            </p>
            <p className="text-sm text-white/80">
              {format(new Date(blog.publishedAt), "MMM d, yyyy")} •{" "}
              {blog.estimated_read_time} min read
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FeaturedBlogCard;
