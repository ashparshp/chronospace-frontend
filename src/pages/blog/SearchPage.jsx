import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search as SearchIcon,
  Filter,
  Grid,
  List,
  Tag,
  LayoutGrid,
  Tag as TagIcon,
  User,
  XCircle,
  BookOpen,
  Users,
  Bookmark,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { blogService } from "../../services/blogService";
import { userService } from "../../services/userService";
import { useNotification } from "../../context/NotificationContext";
import { BLOG_CATEGORIES } from "../../config/constants";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import Badge from "../../components/ui/Badge";
import Card from "../../components/ui/Card";
import Avatar from "../../components/ui/Avatar";
import BlogList from "../../components/blog/BlogList";
import EmptyState from "../../components/ui/EmptyState";

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useNotification();

  // Extract queries from URL
  const getInitialQuery = () => {
    const searchParams = new URLSearchParams(location.search);
    return {
      q: searchParams.get("q") || "",
      tag: searchParams.get("tag") || "",
      category: searchParams.get("category") || "",
      author: searchParams.get("author") || "",
    };
  };

  const [query, setQuery] = useState(getInitialQuery());
  const [searchInput, setSearchInput] = useState(query.q);
  const [filters, setFilters] = useState({
    category: query.category,
    tag: query.tag,
    author: query.author,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [activeTab, setActiveTab] = useState("blogs");

  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [tags, setTags] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [searchStats, setSearchStats] = useState({
    totalBlogs: 0,
    totalUsers: 0,
    totalTags: 0,
  });

  // Update URL when query changes
  useEffect(() => {
    const searchParams = new URLSearchParams();

    if (query.q) searchParams.set("q", query.q);
    if (query.tag) searchParams.set("tag", query.tag);
    if (query.category) searchParams.set("category", query.category);
    if (query.author) searchParams.set("author", query.author);

    const newUrl = `${location.pathname}?${searchParams.toString()}`;
    navigate(newUrl, { replace: true });

    // Reset page and fetch results
    setPage(1);
    handleSearch(1, true);
  }, [query]);

  // Update query when URL changes (back/forward navigation)
  useEffect(() => {
    const newQuery = getInitialQuery();
    setQuery(newQuery);
    setSearchInput(newQuery.q);
    setFilters({
      category: newQuery.category,
      tag: newQuery.tag,
      author: newQuery.author,
    });
  }, [location.search]);

  // Fetch popular tags
  useEffect(() => {
    const fetchPopularTags = async () => {
      try {
        // In a real app, we would fetch popular tags from the backend
        // For now, let's use some static tags
        const popularTags = [
          "technology",
          "programming",
          "science",
          "health",
          "business",
          "lifestyle",
          "education",
          "ai",
          "machine-learning",
          "javascript",
          "react",
          "web-development",
        ];
        setTags(popularTags);
        setSearchStats((prev) => ({ ...prev, totalTags: popularTags.length }));
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchPopularTags();
  }, []);

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setQuery((prev) => ({ ...prev, q: searchInput }));
  };

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setQuery((prev) => ({ ...prev, [name]: value }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      category: "",
      tag: "",
      author: "",
    });
    setQuery((prev) => ({
      q: prev.q,
      tag: "",
      category: "",
      author: "",
    }));
  };

  // Apply a tag filter
  const handleTagClick = (tag) => {
    setFilters((prev) => ({ ...prev, tag }));
    setQuery((prev) => ({ ...prev, tag }));
    setActiveTab("blogs"); // Switch to blogs tab when selecting a tag
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);

    if (tab === "users") {
      fetchUsers(1);
    }
  };

  // Search function
  const handleSearch = async (pageNum = 1, reset = false) => {
    try {
      setLoading(true);
      setError(null);

      if (activeTab === "blogs") {
        const searchParams = {
          query: query.q,
          tag: query.tag,
          page: pageNum,
          limit: 9,
        };

        // Add category filter if selected
        if (query.category) {
          searchParams.category = query.category;
        }

        // Add author filter if selected (need to fetch author ID)
        if (query.author) {
          try {
            const authorResponse = await userService.getProfile(query.author);
            searchParams.author = authorResponse.data._id;
          } catch (error) {
            console.error("Error fetching author:", error);
            // If author not found, show empty results
            setBlogs([]);
            setHasMore(false);
            setLoading(false);
            return;
          }
        }

        const response = await blogService.searchBlogs(searchParams);

        if (reset) {
          setBlogs(response.data.blogs);
        } else {
          setBlogs((prev) => [...prev, ...response.data.blogs]);
        }

        // Update search stats
        setSearchStats((prev) => ({
          ...prev,
          totalBlogs: response.data.total || blogs.length,
        }));

        setHasMore(response.data.blogs.length === 9);
        setPage(pageNum);
      } else if (activeTab === "users") {
        fetchUsers(pageNum, reset);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error searching:", error);
      setError("Failed to load search results");
      setLoading(false);
    }
  };

  // Load more results
  const handleLoadMore = () => {
    handleSearch(page + 1, false);
  };

  // Fetch users
  const fetchUsers = async (pageNum = 1, reset = false) => {
    try {
      if (!query.q) {
        setUsers([]);
        return;
      }

      const response = await userService.searchUsers(query.q, pageNum, 10);

      if (reset) {
        setUsers(response.data.users);
      } else {
        setUsers((prev) => [...prev, ...response.data.users]);
      }

      // Update search stats
      setSearchStats((prev) => ({
        ...prev,
        totalUsers: response.data.total || users.length,
      }));

      setHasMore(response.data.users.length === 10);
      setPage(pageNum);
    } catch (error) {
      console.error("Error searching users:", error);
      setError("Failed to load user results");
    }
  };

  // Get search title
  const getSearchTitle = () => {
    const parts = [];

    if (query.q) parts.push(`"${query.q}"`);
    if (query.tag) parts.push(`#${query.tag}`);
    if (query.category) parts.push(`in ${query.category}`);
    if (query.author) parts.push(`by @${query.author}`);

    if (parts.length === 0) return "Search";
    return `Search Results for ${parts.join(" ")}`;
  };

  // Animation variants
  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0 },
  };

  return (
    <div className="mx-auto">
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={fadeIn}
        className="space-y-8"
      >
        {/* Search Header - Styled to match new design */}
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <div className="relative bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 py-8 px-6">
            {/* Background decoration */}
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

            <div className="relative z-10">
              <div className="max-w-3xl mx-auto text-center mb-6">
                <motion.h1
                  className="font-playfair text-3xl md:text-4xl font-bold mb-4 tracking-tight leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">
                    {getSearchTitle()}
                  </span>
                </motion.h1>

                <motion.p
                  className="font-montserrat text-lg leading-relaxed text-gray-700 dark:text-gray-300 max-w-xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  {query.q || query.tag || query.category || query.author
                    ? "Find relevant content, authors, and topics matching your interests."
                    : "Discover new content, connect with authors, and explore topics of interest."}
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="max-w-3xl mx-auto"
              >
                <form onSubmit={handleSearchSubmit} className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Search blogs, users, and tags..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        icon={<SearchIcon className="h-5 w-5 text-gray-400" />}
                        className="w-full bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700"
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="submit"
                        variant="primary"
                        glossy={true}
                        shadowDepth="deep"
                        size="md"
                      >
                        Search
                      </Button>
                      <Button
                        type="button"
                        variant="white"
                        onClick={() => setShowFilters(!showFilters)}
                        shadowDepth="shallow"
                        size="md"
                        icon={<Filter className="h-4 w-4" />}
                        iconPosition="left"
                      >
                        {showFilters ? "Hide Filters" : "Filters"}
                      </Button>
                    </div>
                  </div>

                  {/* Filters */}
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-montserrat">
                            Category
                          </label>
                          <Select
                            value={filters.category}
                            onChange={(e) =>
                              handleFilterChange("category", e.target.value)
                            }
                            options={[
                              { value: "", label: "All Categories" },
                              ...BLOG_CATEGORIES.map((category) => ({
                                value: category,
                                label:
                                  category.charAt(0).toUpperCase() +
                                  category.slice(1),
                              })),
                            ]}
                            className="w-full bg-white dark:bg-gray-900"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-montserrat">
                            Tag
                          </label>
                          <Input
                            placeholder="Filter by tag"
                            value={filters.tag}
                            onChange={(e) =>
                              handleFilterChange("tag", e.target.value)
                            }
                            icon={<TagIcon className="h-5 w-5 text-gray-400" />}
                            className="bg-white dark:bg-gray-900"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-montserrat">
                            Author
                          </label>
                          <Input
                            placeholder="Filter by author"
                            value={filters.author}
                            onChange={(e) =>
                              handleFilterChange("author", e.target.value)
                            }
                            icon={<User className="h-5 w-5 text-gray-400" />}
                            className="bg-white dark:bg-gray-900"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end mt-4">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={clearFilters}
                          className="text-violet-600 dark:text-violet-400"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Clear Filters
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </form>

                {/* Filter Tags */}
                {(query.tag || query.category || query.author) && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {query.tag && (
                      <Badge
                        variant="secondary"
                        className="flex items-center bg-white/80 dark:bg-gray-800/80 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 py-1 px-3"
                      >
                        <span className="mr-1 font-montserrat">Tag:</span>{" "}
                        <span className="font-medium">{query.tag}</span>
                        <button
                          className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                          onClick={() => handleFilterChange("tag", "")}
                        >
                          <XCircle className="h-3.5 w-3.5" />
                        </button>
                      </Badge>
                    )}

                    {query.category && (
                      <Badge
                        variant="secondary"
                        className="flex items-center bg-white/80 dark:bg-gray-800/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 py-1 px-3"
                      >
                        <span className="mr-1 font-montserrat">Category:</span>{" "}
                        <span className="font-medium">{query.category}</span>
                        <button
                          className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                          onClick={() => handleFilterChange("category", "")}
                        >
                          <XCircle className="h-3.5 w-3.5" />
                        </button>
                      </Badge>
                    )}

                    {query.author && (
                      <Badge
                        variant="secondary"
                        className="flex items-center bg-white/80 dark:bg-gray-800/80 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800 py-1 px-3"
                      >
                        <span className="mr-1 font-montserrat">Author:</span>{" "}
                        <span className="font-medium">{query.author}</span>
                        <button
                          className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                          onClick={() => handleFilterChange("author", "")}
                        >
                          <XCircle className="h-3.5 w-3.5" />
                        </button>
                      </Badge>
                    )}
                  </div>
                )}
              </motion.div>

              {/* Search Status Cards */}
              {(query.q || query.tag || query.category || query.author) && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 max-w-3xl mx-auto">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700/20 shadow-sm dark:bg-gray-800/90"
                    onClick={() => handleTabChange("blogs")}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm font-montserrat">
                          Blogs
                        </p>
                        <h3 className="text-gray-900 dark:text-white font-playfair text-2xl font-bold">
                          {searchStats.totalBlogs}
                        </h3>
                      </div>
                      <div className="bg-violet-500/20 rounded-lg p-2.5">
                        <BookOpen className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700/30">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-violet-600 dark:text-violet-400 font-medium font-montserrat">
                          View Results
                        </span>
                        <ChevronRight className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700/20 shadow-sm dark:bg-gray-800/90"
                    onClick={() => handleTabChange("users")}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm font-montserrat">
                          Users
                        </p>
                        <h3 className="text-gray-900 dark:text-white font-playfair text-2xl font-bold">
                          {searchStats.totalUsers}
                        </h3>
                      </div>
                      <div className="bg-indigo-500/20 rounded-lg p-2.5">
                        <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700/30">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium font-montserrat">
                          View Results
                        </span>
                        <ChevronRight className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                    className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700/20 shadow-sm dark:bg-gray-800/90"
                    onClick={() => handleTabChange("tags")}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm font-montserrat">
                          Tags
                        </p>
                        <h3 className="text-gray-900 dark:text-white font-playfair text-2xl font-bold">
                          {searchStats.totalTags}
                        </h3>
                      </div>
                      <div className="bg-pink-500/20 rounded-lg p-2.5">
                        <Tag className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700/30">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-pink-600 dark:text-pink-400 font-medium font-montserrat">
                          View All Tags
                        </span>
                        <ChevronRight className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search Tabs */}
        <Card className="border border-gray-100 dark:border-gray-800 shadow-md overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex" aria-label="Tabs">
              <button
                onClick={() => handleTabChange("blogs")}
                className={`whitespace-nowrap py-4 px-6 font-medium text-sm transition-colors duration-200 ${
                  activeTab === "blogs"
                    ? "border-b-2 border-violet-500 text-violet-600 dark:text-violet-400 font-montserrat"
                    : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-700 font-montserrat"
                }`}
                aria-current={activeTab === "blogs" ? "page" : undefined}
              >
                <LayoutGrid className="h-5 w-5 inline-block mr-2" />
                Blogs
              </button>
              <button
                onClick={() => handleTabChange("users")}
                className={`whitespace-nowrap py-4 px-6 font-medium text-sm transition-colors duration-200 ${
                  activeTab === "users"
                    ? "border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-montserrat"
                    : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-700 font-montserrat"
                }`}
                aria-current={activeTab === "users" ? "page" : undefined}
              >
                <User className="h-5 w-5 inline-block mr-2" />
                Users
              </button>
              <button
                onClick={() => handleTabChange("tags")}
                className={`whitespace-nowrap py-4 px-6 font-medium text-sm transition-colors duration-200 ${
                  activeTab === "tags"
                    ? "border-b-2 border-pink-500 text-pink-600 dark:text-pink-400 font-montserrat"
                    : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-700 font-montserrat"
                }`}
                aria-current={activeTab === "tags" ? "page" : undefined}
              >
                <Tag className="h-5 w-5 inline-block mr-2" />
                Tags
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Blog Results */}
            {activeTab === "blogs" && (
              <>
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div className="mb-2">
                      <h2 className="font-playfair text-2xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">
                        {loading && blogs.length === 0
                          ? "Searching blogs..."
                          : blogs.length === 0
                          ? "No blogs found"
                          : `Found ${blogs.length}${hasMore ? "+" : ""} blogs`}
                      </h2>
                      <motion.div
                        className="h-1 bg-gradient-to-r from-violet-500 to-indigo-500 rounded"
                        initial={{ width: 0 }}
                        animate={{ width: "10rem" }}
                        transition={{
                          duration: 0.8,
                          delay: 0.2,
                          ease: "easeOut",
                        }}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        className={`p-2 rounded-md ${
                          viewMode === "grid"
                            ? "bg-violet-100 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400"
                            : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                        } transition-colors duration-200`}
                        onClick={() => setViewMode("grid")}
                        aria-label="Grid view"
                      >
                        <Grid className="h-5 w-5" />
                      </button>
                      <button
                        className={`p-2 rounded-md ${
                          viewMode === "list"
                            ? "bg-violet-100 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400"
                            : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                        } transition-colors duration-200`}
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
                    layout={viewMode} // Pass current view mode
                    emptyTitle="No blogs found"
                    emptyDescription="We couldn't find any blogs matching your search criteria."
                    blogCardVariant="elevated" // Use the card style
                  />
                </div>
              </>
            )}

            {/* User Results */}
            {activeTab === "users" && (
              <div>
                <div className="mb-6">
                  <h2 className="font-playfair text-2xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                    {loading
                      ? "Searching users..."
                      : users.length === 0
                      ? "No users found"
                      : `Found ${users.length}${hasMore ? "+" : ""} users`}
                  </h2>
                  <motion.div
                    className="h-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded"
                    initial={{ width: 0 }}
                    animate={{ width: "10rem" }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  />
                </div>

                {loading && users.length === 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="animate-pulse bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 p-4"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                          <div className="space-y-2 flex-1">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : users.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {users.map((user, index) => (
                      <motion.div
                        key={user.personal_info.username}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Card
                          className="p-4 cursor-pointer border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-md transition-all duration-200"
                          onClick={() =>
                            navigate(`/profile/${user.personal_info.username}`)
                          }
                        >
                          <div className="flex items-center space-x-4">
                            <Avatar
                              src={user.personal_info.profile_img}
                              alt={user.personal_info.fullname}
                              size="md"
                              className="border-2 border-white dark:border-gray-800 shadow-sm"
                            />
                            <div>
                              <h3 className="font-playfair font-bold text-gray-900 dark:text-white">
                                {user.personal_info.fullname}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400 font-montserrat">
                                @{user.personal_info.username}
                              </p>
                              <div className="mt-1">
                                <Badge
                                  variant={
                                    user.role === "admin"
                                      ? "info"
                                      : user.role === "blogger"
                                      ? "secondary"
                                      : "primary"
                                  }
                                  size="sm"
                                  className="font-montserrat text-xs"
                                >
                                  {user.role}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          {user.personal_info.bio && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 font-montserrat line-clamp-2">
                              {user.personal_info.bio}
                            </p>
                          )}
                          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between font-montserrat">
                            <div className="flex items-center">
                              <BookOpen className="h-3.5 w-3.5 mr-1.5 text-indigo-500 dark:text-indigo-400" />
                              <span>
                                {user.account_info.total_posts || 0} posts
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Users className="h-3.5 w-3.5 mr-1.5 text-violet-500 dark:text-violet-400" />
                              <span>
                                {user.account_info.total_followers || 0}{" "}
                                followers
                              </span>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  !loading && (
                    <EmptyState
                      title="No users found"
                      description="We couldn't find any users matching your search criteria."
                      icon={<User className="h-16 w-16 text-gray-400" />}
                      className="bg-white dark:bg-gray-800 rounded-xl p-10 border border-gray-100 dark:border-gray-700"
                    />
                  )
                )}

                {/* Load More Button */}
                {users.length > 0 && hasMore && (
                  <div className="flex justify-center mt-8">
                    <Button
                      variant="white"
                      onClick={handleLoadMore}
                      disabled={loading}
                      isLoading={loading}
                      glossy={true}
                      shadowDepth="shallow"
                      size="lg"
                    >
                      Load More
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Tags Results */}
            {activeTab === "tags" && (
              <div>
                <div className="mb-6">
                  <h2 className="font-playfair text-2xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-600 dark:from-pink-400 dark:to-rose-400">
                    Popular Tags
                  </h2>
                  <motion.div
                    className="h-1 bg-gradient-to-r from-pink-500 to-rose-500 rounded"
                    initial={{ width: 0 }}
                    animate={{ width: "10rem" }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  {tags.map((tag, index) => (
                    <motion.div
                      key={tag}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.02 }}
                      whileHover={{
                        scale: 1.05,
                        transition: { duration: 0.2 },
                      }}
                    >
                      <Badge
                        variant="secondary"
                        className="py-2 px-3 cursor-pointer text-base font-medium tracking-wide font-mono lowercase bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-700 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors duration-200 shadow-sm"
                        onClick={() => handleTagClick(tag)}
                      >
                        <span className="text-pink-600 dark:text-pink-400">
                          #
                        </span>
                        {tag}
                      </Badge>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 bg-pink-50 dark:bg-pink-900/10 rounded-xl p-4 border border-pink-100 dark:border-pink-900/30">
                  <div className="flex items-start">
                    <div className="bg-white dark:bg-gray-800 rounded-full p-2 mr-4 shadow-sm">
                      <TagIcon className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                    </div>
                    <div>
                      <h3 className="font-playfair font-bold text-lg text-gray-900 dark:text-white mb-1">
                        Discover Content by Tags
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-montserrat">
                        Tags help you find content on specific topics. Click any
                        tag above to see all related blogs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default SearchPage;
