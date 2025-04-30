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

  useEffect(() => {
    const fetchHomePageData = async () => {
      try {
        setLoading(true);

        const featuredResponse = await blogService.getFeaturedBlogs(3);
        setFeaturedBlogs(featuredResponse.data.blogs);

        const latestResponse = await blogService.getLatestBlogs(1, 6);
        setLatestBlogs(latestResponse.data.blogs);
        setHasMore(latestResponse.data.blogs.length === 6);

        const trendingResponse = await blogService.getTrendingBlogs(5);
        setTrendingBlogs(trendingResponse.data.blogs);

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
  }, [showToast]);

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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <div className="md:col-span-2 lg:row-span-2 bg-gray-200 dark:bg-black animate-pulse rounded-2xl h-96"></div>
                <div className="bg-gray-200 dark:bg-black animate-pulse rounded-2xl h-64"></div>
                <div className="bg-gray-200 dark:bg-black animate-pulse rounded-2xl h-64"></div>
              </div>
            ) : (
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
                  {/* No dot pattern background - removed as requested */}

                  <div className="relative z-10 max-w-3xl mx-auto">
                    <motion.h1
                      className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-tight"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      Welcome to{" "}
                      <span className="relative inline-block">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">
                          ChronoSpace
                        </span>
                        <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 rounded-full transform scale-x-0 animate-[expandWidth_1s_ease-in-out_forwards_0.8s]"></span>
                      </span>
                    </motion.h1>

                    <motion.p
                      className="font-montserrat text-lg sm:text-xl mb-8 max-w-2xl mx-auto leading-relaxed italic text-gray-700 dark:text-gray-300"
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
                        variant="white"
                        size="lg"
                        href="/search"
                        icon={<Search className="h-5 w-5" />}
                        iconPosition="left"
                        glossy={true}
                        shadowDepth=""
                        className="text-primary-600 "
                      >
                        Explore Blogs
                      </Button>

                      {!currentUser ? (
                        <Button
                          variant="transparent"
                          size="lg"
                          href="/signup"
                          glossy={true}
                          shadowDepth="deep"
                          className="text-white border-white/30"
                        >
                          Join ChronoSpace
                        </Button>
                      ) : (
                        <Button
                          variant="orange"
                          size="lg"
                          href="/dashboard"
                          glossy={true}
                          shadowDepth=""
                          className="text-white hover:bg-orange-500"
                        >
                          Your Dashboard
                        </Button>
                      )}
                    </motion.div>
                  </div>

                  {/* Enhanced decorative elements */}
                  <motion.div
                    className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-violet-500/20 to-indigo-500/20 dark:from-violet-500/10 dark:to-indigo-500/10 rounded-full blur-2xl"
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
                    className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-indigo-500/20 to-violet-500/20 dark:from-indigo-500/10 dark:to-violet-500/10 rounded-full blur-3xl"
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

        {/* Categories Quick Links */}

        <PageTransition.Item>
          <section className="py-4">
            <div className="relative">
              {/* Section Title with Premium Typography */}
              <div className="mb-10 text-center">
                <h2 className="font-playfair text-3xl font-bold inline-block relative tracking-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">
                    Discover Categories
                  </span>
                  <motion.div
                    className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 rounded-full"
                    initial={{ width: 0, left: "50%" }}
                    animate={{ width: "100%", left: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  />
                </h2>
              </div>

              {/* Premium Category Cards with White Text */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-7">
                {[
                  {
                    icon: <Zap className="w-6 h-6" />,
                    label: "Technology",
                    description:
                      "Discover the latest tech innovations and digital transformations",
                    gradient:
                      "bg-gradient-to-br from-indigo-700 via-blue-600 to-sky-600",
                    hoverGradient:
                      "bg-gradient-to-br from-indigo-600 via-blue-500 to-sky-500",
                    pattern:
                      "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20L0 20z' fill='%23ffffff' fill-opacity='0.05'/%3E%3C/svg%3E\")",
                    iconBg: "bg-white/20",
                    buttonHoverBg: "bg-white/20",
                    link: "/search?category=technology",
                  },
                  {
                    icon: <MessageSquare className="w-6 h-6" />,
                    label: "Lifestyle",
                    description:
                      "Explore wellness, personal growth, and balanced living",
                    gradient:
                      "bg-gradient-to-br from-fuchsia-700 via-purple-600 to-violet-600",
                    hoverGradient:
                      "bg-gradient-to-br from-fuchsia-600 via-purple-500 to-violet-500",
                    pattern:
                      "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")",
                    iconBg: "bg-white/20",
                    buttonHoverBg: "bg-white/20",
                    link: "/search?category=lifestyle",
                  },
                  {
                    icon: <Users className="w-6 h-6" />,
                    label: "Business",
                    description:
                      "Stay informed on market trends and entrepreneurship",
                    gradient:
                      "bg-gradient-to-br from-amber-600 via-orange-600 to-red-600",
                    hoverGradient:
                      "bg-gradient-to-br from-amber-500 via-orange-500 to-red-500",
                    pattern:
                      "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h10v10H0zm10 10h10v10H10z' fill='%23ffffff' fill-opacity='0.05'/%3E%3C/svg%3E\")",
                    iconBg: "bg-white/20",
                    buttonHoverBg: "bg-white/20",
                    link: "/search?category=business",
                  },
                  {
                    icon: <Bookmark className="w-6 h-6" />,
                    label: "Science",
                    description:
                      "Explore fascinating discoveries and scientific concepts",
                    gradient:
                      "bg-gradient-to-br from-emerald-700 via-teal-600 to-teal-600",
                    hoverGradient:
                      "bg-gradient-to-br from-emerald-600 via-teal-500 to-teal-500",
                    pattern:
                      "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 0v20L0 10h20z' fill='%23ffffff' fill-opacity='0.05'/%3E%3C/svg%3E\")",
                    iconBg: "bg-white/20",
                    buttonHoverBg: "bg-white/20",
                    link: "/search?category=science",
                  },
                ].map((category, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { delay: 0.1 * index, duration: 0.4 },
                    }}
                    className="relative h-full"
                  >
                    <div
                      className="group h-full cursor-pointer perspective-[1200px]"
                      onClick={() => navigate(category.link)}
                    >
                      {/* Premium Card with Layered Design */}
                      <motion.div
                        whileHover={{
                          rotateY: 5,
                          rotateX: -5,
                          translateY: -8,
                          scale: 1.02,
                          transition: { duration: 0.4, ease: "easeOut" },
                        }}
                        className="relative h-full transform-gpu will-change-transform preserve-3d"
                      >
                        {/* Main Card with Premium Background */}
                        <div
                          className={`${category.gradient} group-hover:${category.hoverGradient} rounded-xl overflow-hidden h-full border border-white/10 relative z-20 transition-all duration-300 shadow-lg`}
                        >
                          {/* Background Pattern */}
                          <div
                            className="absolute inset-0 opacity-60"
                            style={{ backgroundImage: category.pattern }}
                          ></div>

                          {/* Content Container */}
                          <div className="h-full p-5 sm:p-6 flex flex-col relative z-10">
                            {/* Top Section with White Text */}
                            <div className="flex items-start mb-4 relative">
                              <div
                                className={`flex-shrink-0 p-2.5 backdrop-blur-sm ${category.iconBg} rounded-lg shadow-inner
                                       transform-gpu group-hover:scale-110 group-hover:rotate-3
                                       transition-all duration-500 ease-out`}
                              >
                                {category.icon}
                              </div>

                              <div className="ml-3">
                                <h3 className="font-display font-bold text-xl text-white tracking-tight group-hover:translate-y-0 transform-gpu transition-transform duration-300">
                                  {category.label}
                                </h3>
                              </div>
                            </div>

                            {/* Description with White Text */}
                            <div className="mt-1 mb-4">
                              <p className="font-montserrat text-sm text-white/90 leading-relaxed overflow-hidden transition-all duration-500 ease-out">
                                {category.description}
                              </p>
                            </div>

                            {/* Bottom Action Area with White Text */}
                            <div className="mt-auto pt-3 border-t border-white/10 flex justify-end items-center">
                              {/* Explore Button */}
                              <div
                                className={`flex items-center text-white text-sm font-medium py-1 px-3 rounded-full bg-white/0 group-hover:${category.buttonHoverBg} transition-all duration-300`}
                              >
                                <span className="mr-1.5 tracking-wide">
                                  Explore
                                </span>
                                <motion.div className="inline-flex group-hover:translate-x-1 transition-transform duration-300">
                                  <ArrowRight className="w-4 h-4" />
                                </motion.div>
                              </div>
                            </div>
                          </div>

                          {/* Elegant Glossy Overlay */}
                          <div
                            className="absolute inset-0 bg-gradient-to-b from-white/20 to-white/0 opacity-60 
                                 rounded-xl pointer-events-none z-30 group-hover:opacity-20 transition-opacity duration-500"
                          ></div>
                        </div>

                        {/* Shadow Element for 3D Depth */}
                        <div
                          className="absolute inset-0 -z-10 translate-y-2 scale-[0.97] blur-md rounded-xl
                                bg-black/50 opacity-40 transform-gpu group-hover:opacity-60 group-hover:translate-y-3
                                transition-all duration-500 ease-out"
                        ></div>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
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
                  {/* Updated view all button with ghost variant */}
                  <Button
                    variant="ghost"
                    href="/search"
                    className="text-primary-600 dark:text-primary-400 group flex items-center"
                    shadowDepth="shallow"
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

            {/* Popular Tags Section - Updated Font, Small Size, Lowercase */}
            <PageTransition.Item transition="slideUp" delay={0.2}>
              <Card
                variant="elevated"
                className="border border-gray-100 dark:border-gray-800 shadow-md"
              >
                <Card.Header className="flex flex-col items-start pb-3 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-secondary-100 dark:bg-secondary-900/50 rounded-full shadow-sm">
                      <Tags className="h-5 w-5 text-secondary-600 dark:text-secondary-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                      Popular Tags
                    </h2>
                  </div>
                  <motion.div
                    className="w-full mt-2 h-0.5 bg-gradient-to-r from-secondary-200 to-secondary-400"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                </Card.Header>

                <Card.Body className="pt-4">
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="py-1 px-2 cursor-pointer transition-all duration-300 hover:bg-secondary-200 dark:hover:bg-secondary-800 hover:scale-105 rounded-full text-xs font-mono lowercase"
                        onClick={() => navigate(`/tag/${tag}`)}
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </PageTransition.Item>

            {/* Join Community Section - Enhanced */}
            {!(
              currentUser?.role === "blogger" || currentUser?.role === "admin"
            ) && (
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

                    <Button
                      variant="primary"
                      size="lg"
                      href="/search"
                      icon={<Search className="h-5 w-5" />}
                      iconPosition="left"
                      glossy={true}
                      shadowDepth=""
                    >
                      Explore Blogs
                    </Button>
                  </div>
                </div>
              </PageTransition.Item>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default HomePage;
