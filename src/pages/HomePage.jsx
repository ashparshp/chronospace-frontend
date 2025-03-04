// src/pages/HomePage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { blogService } from "../services/blogService";
import { useNotification } from "../context/NotificationContext";
import FeaturedBlogCard from "../components/blog/FeaturedBlogCard";
import BlogList from "../components/blog/BlogList";
import Button from "../components/ui/Button";
import { Search, TrendingUp, Tags } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const navigate = useNavigate();
  const { showToast } = useNotification();
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [trendingBlogs, setTrendingBlogs] = useState([]);
  const [popularTags, setPopularTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { currentUser } = useAuth();

  // Fetch homepage data
  useEffect(() => {
    const fetchHomePageData = async () => {
      try {
        setLoading(true);

        // Fetch featured blogs
        const featuredResponse = await blogService.getFeaturedBlogs(3);
        setFeaturedBlogs(featuredResponse.data.blogs);

        // Fetch latest blogs
        const latestResponse = await blogService.getLatestBlogs(1, 6);
        setLatestBlogs(latestResponse.data.blogs);
        setHasMore(latestResponse.data.blogs.length === 6);

        // Fetch trending blogs
        const trendingResponse = await blogService.getTrendingBlogs(5);
        setTrendingBlogs(trendingResponse.data.blogs);

        // Set popular tags (this could come from an API or be hardcoded)
        setPopularTags([
          "technology",
          "programming",
          "science",
          "health",
          "business",
          "lifestyle",
        ]);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching homepage data:", error);
        setError(error.message || "Failed to fetch content");
        showToast("Failed to fetch content. Please try again later.", "error");
        setLoading(false);
      }
    };

    fetchHomePageData();
  }, []);

  // Load more blogs
  const handleLoadMore = async () => {
    try {
      const nextPage = page + 1;
      const response = await blogService.getLatestBlogs(nextPage, 6);

      if (response.data.blogs.length > 0) {
        setLatestBlogs((prev) => [...prev, ...response.data.blogs]);
        setPage(nextPage);
        setHasMore(response.data.blogs.length === 6);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching more blogs:", error);
      showToast("Failed to load more blogs", "error");
    }
  };

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative">
        {/* Featured Blogs */}
        {featuredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {featuredBlogs.slice(0, 1).map((blog) => (
              <div key={blog.blog_id} className="lg:col-span-2 lg:row-span-2">
                <FeaturedBlogCard blog={blog} className="h-full" />
              </div>
            ))}

            {featuredBlogs.slice(1, 3).map((blog) => (
              <div key={blog.blog_id}>
                <FeaturedBlogCard blog={blog} className="h-full" />
              </div>
            ))}
          </div>
        ) : loading ? (
          // Loading skeleton for featured blogs
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 lg:row-span-2 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg h-96"></div>
            <div className="bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg h-64"></div>
            <div className="bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg h-64"></div>
          </div>
        ) : (
          // Fallback if no featured blogs
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg p-8 text-white text-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Welcome to ChronoSpace
            </h1>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Your space for timeless content. Discover high-quality articles,
              share your thoughts, and connect with a community of passionate
              writers.
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                variant="accent"
                size="lg"
                href="/search"
                className="text-primary-600 hover:bg-black"
              >
                <Search className="h-5 w-5 mr-2" />
                Explore Blogs
              </Button>
              {!currentUser ? (
                <Button
                  variant="outline"
                  size="lg"
                  href="/signup"
                  className="border-white text-white hover:bg-white/20"
                >
                  Join ChronoSpace
                </Button>
              ) : null}
            </div>
          </div>
        )}
      </section>

      {/* Latest Blogs Section */}
      <motion.section
        initial="initial"
        animate="animate"
        variants={fadeInUp}
        className="space-y-6"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Latest Posts
          </h2>
          <Button
            variant="ghost"
            href="/search"
            className="text-primary-600 dark:text-primary-400"
          >
            View All
          </Button>
        </div>

        <BlogList
          blogs={latestBlogs}
          loading={loading}
          error={error}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          emptyTitle="No blogs found"
          emptyDescription="There are no blogs published yet. Check back later!"
        />
      </motion.section>

      {/* Sidebar Sections (on larger screens, these would be in a sidebar) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Trending Section */}
        <motion.section
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          className="space-y-4"
        >
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Trending
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            {trendingBlogs.length > 0 ? (
              <ul className="space-y-4">
                {trendingBlogs.map((blog, index) => (
                  <li
                    key={blog.blog_id}
                    className="pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 font-bold rounded-full w-8 h-8 flex items-center justify-center">
                        {index + 1}
                      </div>
                      <div>
                        <h3
                          className="font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer"
                          onClick={() => navigate(`/blog/${blog.blog_id}`)}
                        >
                          {blog.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          By {blog.author.personal_info.fullname} •{" "}
                          {blog.estimated_read_time} min read
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : loading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-start space-x-4 pb-4 mb-4 border-b border-gray-100 dark:border-gray-700 last:border-0 last:mb-0 last:pb-0"
                >
                  <div className="flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-full w-8 h-8 animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No trending blogs yet.
              </p>
            )}
          </div>
        </motion.section>

        {/* Popular Tags Section */}
        <motion.section
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          className="space-y-4"
        >
          <div className="flex items-center space-x-2">
            <Tags className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Popular Tags
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <Button
                  key={tag}
                  variant="ghost"
                  className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
                  onClick={() => navigate(`/tag/${tag}`)}
                >
                  #{tag}
                </Button>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Join Community Section */}
        <motion.section
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          className="space-y-4"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Join Our Community
          </h2>

          <div className="bg-gradient-to-br from-primary-500 to-secondary-600 rounded-lg shadow-md p-6 text-black">
            <h3 className="font-bold text-xl mb-2">Become a Blogger</h3>
            <p className="mb-4">
              Share your knowledge and thoughts with our growing community.
              Apply to become a blogger today!
            </p>
            <Button
              variant="accent"
              className="w-full bg-blue text-primary-600 hover:bg-gray-900"
              href="/dashboard?tab=blogger-application"
            >
              Apply Now
            </Button>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default HomePage;
