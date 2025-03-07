// src/pages/HomePage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { blogService } from "../services/blogService";
import { useNotification } from "../context/NotificationContext";
import FeaturedBlogCard from "../components/blog/FeaturedBlogCard";
import BlogList from "../components/blog/BlogList";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import PageTransition from "../components/ui/PageTransition";
import {
  Search,
  TrendingUp,
  Tags,
  Zap,
  ChevronRight,
  MessageSquare,
  Users,
  Bookmark,
  Edit,
  ArrowRight,
} from "lucide-react";
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
          "javascript",
          "react",
          "design",
          "productivity",
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

  return (
    <PageTransition>
      {/* Refined background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none opacity-60">
        <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-b from-primary-100/30 to-transparent dark:from-primary-900/15 blur-3xl"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-t from-secondary-100/30 to-transparent dark:from-secondary-900/15 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full bg-gradient-to-r from-primary-100/10 to-secondary-100/10 dark:from-primary-900/5 dark:to-secondary-900/5 blur-3xl"></div>
      </div>

      <div className="w-full space-y-12 pb-12">
        {/* Hero Section - Enhanced */}
        <PageTransition.Item>
          <section className="pt-6 md:pt-10">
            {featuredBlogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {featuredBlogs.slice(0, 1).map((blog) => (
                  <div
                    key={blog.blog_id}
                    className="md:col-span-2 lg:row-span-2"
                  >
                    <FeaturedBlogCard
                      blog={blog}
                      className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
                    />
                  </div>
                ))}

                {featuredBlogs.slice(1, 3).map((blog) => (
                  <div key={blog.blog_id}>
                    <FeaturedBlogCard
                      blog={blog}
                      className="h-full shadow-md hover:shadow-lg transition-shadow duration-300 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
                    />
                  </div>
                ))}
              </div>
            ) : loading ? (
              // Enhanced loading skeleton for featured blogs
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <div className="md:col-span-2 lg:row-span-2 bg-gray-200 dark:bg-black animate-pulse rounded-2xl h-96"></div>
                <div className="bg-gray-200 dark:bg-black animate-pulse rounded-2xl h-64"></div>
                <div className="bg-gray-200 dark:bg-black animate-pulse rounded-2xl h-64"></div>
              </div>
            ) : (
              // Enhanced fallback if no featured blogs
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 md:p-12 text-white text-center relative overflow-hidden">
                  {/* Enhanced background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <svg
                      className="w-full h-full"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <pattern
                        id="pattern-circles"
                        x="0"
                        y="0"
                        width="40"
                        height="40"
                        patternUnits="userSpaceOnUse"
                        patternContentUnits="userSpaceOnUse"
                      >
                        <circle
                          id="pattern-circle"
                          cx="10"
                          cy="10"
                          r="1.6257413380501518"
                          fill="#fff"
                        ></circle>
                      </pattern>
                      <rect
                        id="rect"
                        x="0"
                        y="0"
                        width="100%"
                        height="100%"
                        fill="url(#pattern-circles)"
                      ></rect>
                    </svg>
                  </div>

                  <div className="relative z-10 max-w-3xl mx-auto">
                    <motion.h1
                      className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      Welcome to{" "}
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200">
                        ChronoSpace
                      </span>
                    </motion.h1>
                    <motion.p
                      className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto opacity-90 leading-relaxed"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                    >
                      Your space for timeless content. Discover high-quality
                      articles, share your thoughts, and connect with a
                      community of passionate writers.
                    </motion.p>
                    <motion.div
                      className="flex flex-col sm:flex-row justify-center gap-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      <Button
                        variant="accent"
                        size="lg"
                        href="/search"
                        className="bg-white text-primary-600 hover:bg-gray-100 hover:shadow-lg transition-all duration-300 shadow-md"
                        icon={<Search className="h-5 w-5" />}
                        iconPosition="left"
                      >
                        Explore Blogs
                      </Button>
                      {!currentUser ? (
                        <Button
                          variant="outline"
                          size="lg"
                          href="/signup"
                          className="border-white text-white hover:bg-white/20 transition-all duration-300"
                        >
                          Join ChronoSpace
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="lg"
                          href="/dashboard"
                          className="border-white text-white hover:bg-white/20 transition-all duration-300"
                        >
                          Your Dashboard
                        </Button>
                      )}
                    </motion.div>
                  </div>

                  {/* Enhanced decorative elements */}
                  <motion.div
                    className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.7, 0.5],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  ></motion.div>
                  <motion.div
                    className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.4, 0.6, 0.4],
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                  ></motion.div>
                </div>
              </div>
            )}
          </section>
        </PageTransition.Item>

        {/* Categories Quick Links - Enhanced */}
        <PageTransition.Item>
          <section>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  icon: <Zap className="w-5 h-5" />,
                  label: "Technology",
                  color: "from-blue-600 to-indigo-700",
                  link: "/search?category=technology",
                },
                {
                  icon: <MessageSquare className="w-5 h-5" />,
                  label: "Lifestyle",
                  color: "from-pink-600 to-rose-600",
                  link: "/search?category=lifestyle",
                },
                {
                  icon: <Users className="w-5 h-5" />,
                  label: "Business",
                  color: "from-amber-500 to-orange-600",
                  link: "/search?category=business",
                },
                {
                  icon: <Bookmark className="w-5 h-5" />,
                  label: "Science",
                  color: "from-teal-500 to-green-600",
                  link: "/search?category=science",
                },
              ].map((category, index) => (
                <motion.div
                  key={index}
                  whileHover={{
                    y: -5,
                    transition: { duration: 0.2 },
                  }}
                  onClick={() => navigate(category.link)}
                  className="cursor-pointer"
                >
                  <div
                    className={`bg-gradient-to-r ${category.color} text-white rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-3 h-full shadow-md hover:shadow-lg transition-all duration-300 group`}
                  >
                    <div className="p-2 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors duration-300">
                      {category.icon}
                    </div>
                    <h3 className="font-semibold text-center sm:text-left">
                      {category.label}
                      <div className="h-0.5 w-0 group-hover:w-full bg-white/50 mt-1 transition-all duration-300"></div>
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </PageTransition.Item>

        {/* Main Content and Sidebar Layout - Enhanced */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Latest Blogs Section - 8 columns on large screens */}
          <div className="lg:col-span-8">
            <PageTransition.Item transition="slideUp">
              <section className="space-y-6">
                <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-4">
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400">
                    Latest Posts
                  </h2>
                  <Button
                    variant="ghost"
                    href="/search"
                    className="text-primary-600 dark:text-primary-400 group flex items-center"
                  >
                    View All
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
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
                  blogCardVariant="elevated"
                />
              </section>
            </PageTransition.Item>
          </div>

          {/* Sidebar - 4 columns on large screens */}
          <div className="lg:col-span-4 space-y-6">
            {/* Trending Section - Enhanced */}
            <PageTransition.Item transition="slideUp" delay={0.1}>
              <Card
                variant="gradient"
                className="overflow-visible border border-gray-100 dark:border-gray-800 shadow-md"
              >
                <Card.Header className="space-y-3 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-primary-100 dark:bg-primary-900/50 rounded-md">
                      <TrendingUp className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Trending Now
                    </h2>
                  </div>
                </Card.Header>

                <Card.Body className="pt-4">
                  {trendingBlogs.length > 0 ? (
                    <ul className="space-y-4 divide-y divide-gray-100 dark:divide-gray-800">
                      {trendingBlogs.map((blog, index) => (
                        <li
                          key={blog.blog_id}
                          className={`${
                            index > 0 ? "pt-4" : ""
                          } group cursor-pointer`}
                          onClick={() => navigate(`/blog/${blog.blog_id}`)}
                        >
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white font-bold flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-300">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                                {blog.title}
                              </h3>
                              <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                                <span className="truncate max-w-[100px]">
                                  {blog.author && blog.author.personal_info
                                    ? blog.author.personal_info.fullname
                                    : "Unknown Author"}
                                </span>
                                <span className="mx-1.5">•</span>
                                <span>
                                  {blog.estimated_read_time || 1} min read
                                </span>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : loading ? (
                    // Enhanced loading skeleton
                    Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex items-start space-x-4 pb-4 mb-4 border-b border-gray-100 dark:border-gray-700 last:border-0 last:mb-0 last:pb-0"
                      >
                        <div className="flex-shrink-0 bg-gray-200 dark:bg-black rounded-full w-8 h-8 animate-pulse"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 dark:bg-black rounded animate-pulse"></div>
                          <div className="h-3 bg-gray-200 dark:bg-black rounded animate-pulse w-2/3"></div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                      No trending blogs yet.
                    </p>
                  )}
                </Card.Body>
              </Card>
            </PageTransition.Item>

            {/* Popular Tags Section - Enhanced */}
            <PageTransition.Item transition="slideUp" delay={0.2}>
              <Card
                variant="elevated"
                className="border border-gray-100 dark:border-gray-800 shadow-md"
              >
                <Card.Header className="space-y-3 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-secondary-100 dark:bg-secondary-900/50 rounded-md">
                      <Tags className="h-5 w-5 text-secondary-600 dark:text-secondary-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Popular Tags
                    </h2>
                  </div>
                </Card.Header>

                <Card.Body className="pt-4">
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="py-1.5 px-3 cursor-pointer transition-all duration-300 hover:bg-secondary-200 dark:hover:bg-secondary-800 hover:scale-105"
                        onClick={() => navigate(`/tag/${tag}`)}
                        animate
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </PageTransition.Item>

            {/* Join Community Section - Enhanced */}
            <PageTransition.Item transition="slideUp" delay={0.3}>
              <div className="overflow-hidden rounded-xl relative group shadow-lg hover:shadow-xl transition-shadow duration-300">
                {/* Enhanced animated background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 overflow-hidden">
                  {/* Enhanced animated particles/circles */}
                  <motion.div
                    className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-xl"
                    animate={{
                      x: [0, 20, 0],
                      y: [0, -20, 0],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.div
                    className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-xl"
                    animate={{
                      x: [0, -30, 0],
                      y: [0, 30, 0],
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                  />
                  <motion.div
                    className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/5 rounded-full"
                    animate={{
                      x: [0, 40, 0],
                      y: [0, -40, 0],
                    }}
                    transition={{
                      duration: 12,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 2,
                    }}
                  />
                </div>

                <div className="relative z-10 p-6 text-white">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors duration-300">
                      <Edit className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-xl">Become a Creator</h3>
                  </div>

                  <p className="mb-6 opacity-90 text-white/90 leading-relaxed">
                    Share your knowledge and insights with our growing
                    community. Apply to become a blogger today!
                  </p>

                  <motion.div
                    whileHover={{
                      scale: 1.05,
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="accent"
                      className="w-full bg-white text-primary-600 hover:bg-gray-100 shadow-lg group"
                      href="/dashboard?tab=blogger-application"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </motion.div>
                </div>
              </div>
            </PageTransition.Item>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default HomePage;
