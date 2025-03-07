// src/pages/blog/TagPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { blogService } from "../../services/blogService";
import { useNotification } from "../../context/NotificationContext";
import BlogList from "../../components/blog/BlogList";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { Tag, Grid, List } from "lucide-react";

const TagPage = () => {
  const { tag } = useParams();
  const navigate = useNavigate();
  const { showToast } = useNotification();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [relatedTags, setRelatedTags] = useState([]);
  const [viewMode, setViewMode] = useState("grid");

  // Fetch blogs for the tag
  useEffect(() => {
    const fetchTaggedBlogs = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await blogService.searchBlogs({
          tag,
          page: 1,
          limit: 9,
        });

        setBlogs(response.data.blogs);
        setHasMore(response.data.blogs.length === 9);
        setPage(1);

        // Set related tags (in a real app, these would come from the backend)
        // Here we're just using some static related tags as an example
        setRelatedTags(getRelatedTags(tag));

        setLoading(false);
      } catch (error) {
        console.error("Error fetching tagged blogs:", error);
        setError("Failed to load blogs for this tag");
        setLoading(false);
      }
    };

    fetchTaggedBlogs();
  }, [tag]);

  // Load more blogs
  const handleLoadMore = async () => {
    try {
      setLoading(true);

      const nextPage = page + 1;
      const response = await blogService.searchBlogs({
        tag,
        page: nextPage,
        limit: 9,
      });

      setBlogs((prev) => [...prev, ...response.data.blogs]);
      setHasMore(response.data.blogs.length === 9);
      setPage(nextPage);

      setLoading(false);
    } catch (error) {
      console.error("Error loading more blogs:", error);
      showToast("Failed to load more blogs", "error");
      setLoading(false);
    }
  };

  // Get related tags (this would normally come from the backend)
  const getRelatedTags = (currentTag) => {
    // This is just a mock implementation
    const tagMap = {
      technology: ["programming", "ai", "web-development", "software"],
      programming: ["javascript", "python", "react", "technology"],
      science: ["physics", "biology", "chemistry", "research"],
      health: ["fitness", "nutrition", "wellness", "medicine"],
      business: ["entrepreneurship", "marketing", "finance", "startup"],
      lifestyle: ["travel", "food", "fashion", "self-improvement"],
      javascript: ["programming", "web-development", "react", "coding"],
      react: ["javascript", "programming", "web-development", "frontend"],
      "web-development": ["programming", "javascript", "css", "frontend"],
    };

    return (
      tagMap[currentTag] || ["technology", "programming", "science", "health"]
    );
  };

  return (
    <div className=" mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8"
      >
        {/* Tag Header */}
        <div className="bg-white dark:bg-black rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Tag className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              #{tag}
            </h1>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/search")}
            >
              View All Tags
            </Button>

            {relatedTags.map((relatedTag) => (
              <Badge
                key={relatedTag}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => navigate(`/tag/${relatedTag}`)}
              >
                #{relatedTag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Blog List */}
        <div className="bg-white dark:bg-black rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Blogs tagged with #{tag}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                className={`p-2 rounded-md ${
                  viewMode === "grid"
                    ? "bg-gray-100 dark:bg-black"
                    : "text-gray-500 dark:text-gray-400"
                }`}
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                className={`p-2 rounded-md ${
                  viewMode === "list"
                    ? "bg-gray-100 dark:bg-black"
                    : "text-gray-500 dark:text-gray-400"
                }`}
                onClick={() => setViewMode("list")}
                aria-label="List view"
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          <BlogList
            blogs={blogs}
            loading={loading}
            error={error}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            emptyTitle={`No blogs found for #${tag}`}
            emptyDescription="There are no blogs with this tag yet. Be the first to write one!"
            emptyActionText="Write a Blog"
            emptyActionLink="/editor"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default TagPage;
