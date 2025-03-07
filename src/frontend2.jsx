// src/pages/blog/EditorPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import { blogService } from "../../services/blogService";
import BlogEditor from "../../components/blog/BlogEditor";
import EmptyState from "../../components/ui/EmptyState";
import LoadingScreen from "../../components/ui/LoadingScreen";

const EditorPage = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { showToast } = useNotification();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(!!blogId);
  const [error, setError] = useState(null);

  // Fetch blog data for editing
  useEffect(() => {
    const fetchBlog = async () => {
      if (!blogId) return;

      try {
        setLoading(true);
        setError(null);

        const response = await blogService.getBlog(blogId, true, "edit");
        setBlog(response.data.blog);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching blog:", error);

        // Handle specific errors
        if (error.response?.status === 404) {
          setError("Blog not found");
        } else if (error.response?.status === 403) {
          setError("You are not authorized to edit this blog");
        } else {
          setError("Failed to load blog for editing");
        }

        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  // Check if user is blogger or admin
  const isAuthorized =
    currentUser &&
    (currentUser.role === "blogger" || currentUser.role === "admin");

  // If not authorized
  if (!isAuthorized) {
    return (
      <EmptyState
        title="Access Denied"
        description="You need to be a blogger to access the editor. Apply to become a blogger in your dashboard."
        actionText="Go to Dashboard"
        actionLink="/dashboard?tab=blogger-application"
        icon={
          <svg
            className="h-12 w-12 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-3h-.01M12 19h.01M6.633 5.038A9.013 9.013 0 0012 3c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9c0-2.056.7-3.94 1.868-5.437"
            />
          </svg>
        }
      />
    );
  }

  // Loading state
  if (loading) {
    return <LoadingScreen />;
  }

  // Error state
  if (error) {
    return (
      <EmptyState
        title="Error"
        description={error}
        actionText="Go to Dashboard"
        actionLink="/dashboard"
        icon={
          <svg
            className="h-12 w-12 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        }
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className=" mx-auto"
    >
      <BlogEditor initialData={blog} isEdit={!!blogId} />
    </motion.div>
  );
};

export default EditorPage;

// src/pages/blog/PreviewPage.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import EditorJS from "@editorjs/editorjs";
import { useAuth } from "../../context/AuthContext";
import { Tag, ArrowLeft, Eye, Calendar } from "lucide-react";
import Avatar from "../../components/ui/Avatar";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";

const PreviewPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const editorRef = useRef(null);
  const [previewData, setPreviewData] = useState(null);

  // Load preview data from sessionStorage
  useEffect(() => {
    const data = sessionStorage.getItem("blog-preview");

    if (data) {
      try {
        setPreviewData(JSON.parse(data));
      } catch (error) {
        console.error("Error parsing preview data:", error);
      }
    }
  }, []);

  // Initialize editor
  useEffect(() => {
    if (previewData && previewData.content && !editorRef.current) {
      editorRef.current = new EditorJS({
        holder: "editorjs-preview",
        tools: {},
        data: previewData.content,
        readOnly: true,
        minHeight: 0,
      });
    }

    // Cleanup editor
    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [previewData]);

  // Format date
  const formatDate = () => {
    return format(new Date(), "MMMM d, yyyy");
  };

  // If no preview data
  if (!previewData) {
    return (
      <EmptyState
        title="No Preview Available"
        description="There is no blog preview data available. Please go back to the editor."
        actionText="Go to Editor"
        actionLink="/editor"
        icon={<Eye className="h-12 w-12 text-gray-400" />}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Preview Header */}
        <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Eye className="h-5 w-5 text-yellow-500 mr-2" />
            <span className="text-yellow-800 dark:text-yellow-300 font-medium">
              Preview Mode
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Editor
            </Button>
          </div>
        </div>

        {/* Blog Header */}
        <div>
          {/* Category & Visibility */}
          <div className="flex items-center space-x-2 mb-3">
            {previewData.category && (
              <Badge
                variant="secondary"
                className="uppercase text-xs tracking-wide"
              >
                {previewData.category}
              </Badge>
            )}

            <Badge variant="info" className="text-xs">
              {previewData.visibility === "private"
                ? "Private"
                : previewData.visibility === "followers_only"
                ? "Followers Only"
                : "Public"}
            </Badge>

            {previewData.is_premium && (
              <Badge
                variant="accent"
                className="bg-accent-500 text-white uppercase text-xs tracking-wide"
              >
                Premium
              </Badge>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            {previewData.title || "Untitled Blog"}
          </h1>

          {/* Description */}
          {previewData.des && (
            <p className="text-lg text-gray-700 dark:text-gray-300 mt-3">
              {previewData.des}
            </p>
          )}

          {/* Author and date */}
          <div className="flex items-center mt-6 space-x-3">
            <Avatar
              src={currentUser.profile_img}
              alt={currentUser.fullname}
              size="md"
            />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                {currentUser.fullname}
              </h3>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{formatDate()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Banner image */}
        {previewData.banner && (
          <div className="rounded-lg overflow-hidden">
            <img
              src={previewData.banner}
              alt={previewData.title || "Blog banner"}
              className="w-full max-h-96 object-cover"
            />
          </div>
        )}

        {/* Blog content */}
        <div className="prose dark:prose-invert max-w-none">
          <div id="editorjs-preview"></div>
        </div>

        {/* Tags */}
        {previewData.tags && previewData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
            {previewData.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PreviewPage;

// src/pages/blog/SearchPage.jsx
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
        setTags([
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
        ]);
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

    if (parts.length === 0) return "Search Blogs";
    return `Search Results for ${parts.join(" ")}`;
  };

  // Animation variants
  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0 },
  };

  return (
    <div className=" mx-auto">
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={fadeIn}
        className="space-y-8"
      >
        {/* Search Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {getSearchTitle()}
          </h1>

          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search blogs, users, and tags..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  icon={<SearchIcon className="h-5 w-5 text-gray-400" />}
                  className="w-full"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" variant="primary">
                  Search
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select
                    label="Category"
                    value={filters.category}
                    onChange={(e) =>
                      handleFilterChange("category", e.target.value)
                    }
                    options={[
                      { value: "", label: "All Categories" },
                      ...BLOG_CATEGORIES.map((category) => ({
                        value: category,
                        label:
                          category.charAt(0).toUpperCase() + category.slice(1),
                      })),
                    ]}
                  />

                  <Input
                    label="Tag"
                    placeholder="Filter by tag"
                    value={filters.tag}
                    onChange={(e) => handleFilterChange("tag", e.target.value)}
                    icon={<TagIcon className="h-5 w-5 text-gray-400" />}
                  />

                  <Input
                    label="Author"
                    placeholder="Filter by author"
                    value={filters.author}
                    onChange={(e) =>
                      handleFilterChange("author", e.target.value)
                    }
                    icon={<User className="h-5 w-5 text-gray-400" />}
                  />
                </div>

                <div className="flex justify-end mt-4">
                  <Button type="button" variant="ghost" onClick={clearFilters}>
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
                <Badge variant="secondary" className="flex items-center">
                  <span className="mr-1">Tag:</span> {query.tag}
                  <button
                    className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    onClick={() => handleFilterChange("tag", "")}
                  >
                    <XCircle className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              {query.category && (
                <Badge variant="secondary" className="flex items-center">
                  <span className="mr-1">Category:</span> {query.category}
                  <button
                    className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    onClick={() => handleFilterChange("category", "")}
                  >
                    <XCircle className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              {query.author && (
                <Badge variant="secondary" className="flex items-center">
                  <span className="mr-1">Author:</span> {query.author}
                  <button
                    className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    onClick={() => handleFilterChange("author", "")}
                  >
                    <XCircle className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Search Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex" aria-label="Tabs">
              <button
                onClick={() => handleTabChange("blogs")}
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === "blogs"
                    ? "border-primary-500 text-primary-600 dark:text-primary-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-700"
                }`}
              >
                <LayoutGrid className="h-5 w-5 inline-block mr-2" />
                Blogs
              </button>
              <button
                onClick={() => handleTabChange("users")}
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === "users"
                    ? "border-primary-500 text-primary-600 dark:text-primary-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-700"
                }`}
              >
                <User className="h-5 w-5 inline-block mr-2" />
                Users
              </button>
              <button
                onClick={() => handleTabChange("tags")}
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === "tags"
                    ? "border-primary-500 text-primary-600 dark:text-primary-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-700"
                }`}
              >
                <Tag className="h-5 w-5 inline-block mr-2" />
                Tags
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Blog Results */}
            {activeTab === "blogs" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                      {loading && blogs.length === 0
                        ? "Searching blogs..."
                        : blogs.length === 0
                        ? "No blogs found"
                        : `Found ${blogs.length}${hasMore ? "+" : ""} blogs`}
                    </h2>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      className={`p-2 rounded-md ${
                        viewMode === "grid"
                          ? "bg-gray-100 dark:bg-gray-700"
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
                          ? "bg-gray-100 dark:bg-gray-700"
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
                  emptyTitle="No blogs found"
                  emptyDescription="We couldn't find any blogs matching your search criteria."
                />
              </div>
            )}

            {/* User Results */}
            {activeTab === "users" && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                  {loading
                    ? "Searching users..."
                    : users.length === 0
                    ? "No users found"
                    : `Found ${users.length}${hasMore ? "+" : ""} users`}
                </h2>

                {loading && users.length === 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="animate-pulse bg-white dark:bg-gray-800 rounded-lg shadow p-4"
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
                    {users.map((user) => (
                      <Card
                        key={user.personal_info.username}
                        className="p-4 cursor-pointer"
                        animate
                        onClick={() =>
                          navigate(`/profile/${user.personal_info.username}`)
                        }
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar
                            src={user.personal_info.profile_img}
                            alt={user.personal_info.fullname}
                            size="md"
                          />
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {user.personal_info.fullname}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              @{user.personal_info.username}
                            </p>
                            <div className="mt-1">
                              <Badge
                                variant={
                                  user.role === "admin"
                                    ? "accent"
                                    : user.role === "blogger"
                                    ? "secondary"
                                    : "primary"
                                }
                                size="sm"
                              >
                                {user.role}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        {user.personal_info.bio && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                            {user.personal_info.bio}
                          </p>
                        )}
                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
                          <span>{user.account_info.total_posts} posts</span>
                          <span>
                            {user.account_info.total_followers} followers
                          </span>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  !loading && (
                    <EmptyState
                      title="No users found"
                      description="We couldn't find any users matching your search criteria."
                      icon={<User className="h-12 w-12 text-gray-400" />}
                    />
                  )
                )}

                {/* Load More Button */}
                {users.length > 0 && hasMore && (
                  <div className="flex justify-center mt-8">
                    <Button
                      variant="outline"
                      onClick={handleLoadMore}
                      disabled={loading}
                      isLoading={loading}
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
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                  Popular Tags
                </h2>

                <div className="flex flex-wrap gap-3">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="py-2 px-3 cursor-pointer text-base"
                      onClick={() => handleTagClick(tag)}
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SearchPage;

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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Blogs tagged with #{tag}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                className={`p-2 rounded-md ${
                  viewMode === "grid"
                    ? "bg-gray-100 dark:bg-gray-700"
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
                    ? "bg-gray-100 dark:bg-gray-700"
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

// src/pages/user/DashboardPage.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  LayoutDashboard,
  FileText,
  Edit,
  Bell,
  UserPlus,
  Trash2,
  Eye,
  MessageSquare,
  Heart,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  AlertCircle,
  Users,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import { blogService } from "../../services/blogService";
import { userService } from "../../services/userService";
import Tabs from "../../components/ui/Tabs";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Avatar from "../../components/ui/Avatar";
import Alert from "../../components/ui/Alert";
import Modal from "../../components/ui/Modal";
import EmptyState from "../../components/ui/EmptyState";

const DashboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const {
    notifications,
    totalNotifications,
    fetchNotifications,
    markAllAsRead,
    deleteNotification,
    loading: notificationsLoading,
    showToast,
  } = useNotification();

  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [publishedBlogs, setPublishedBlogs] = useState([]);
  const [draftBlogs, setDraftBlogs] = useState([]);
  const [loadingPublished, setLoadingPublished] = useState(true);
  const [loadingDrafts, setLoadingDrafts] = useState(true);
  const [error, setError] = useState(null);
  const [publishedPage, setPublishedPage] = useState(1);
  const [draftPage, setDraftPage] = useState(1);
  const [hasMorePublished, setHasMorePublished] = useState(true);
  const [hasMoreDrafts, setHasMoreDrafts] = useState(true);
  const [notificationPage, setNotificationPage] = useState(1);
  const [hasMoreNotifications, setHasMoreNotifications] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [bloggerStatus, setBloggerStatus] = useState(null);
  const [loadingBloggerStatus, setLoadingBloggerStatus] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Get initial tab from URL parameter
  function getInitialTab() {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");

    const validTabs = [
      "published",
      "drafts",
      "notifications",
      "blogger-application",
    ];
    return validTabs.includes(tab) ? tab : "published";
  }

  // Update URL when tab changes
  const updateUrl = (tab) => {
    navigate(`/dashboard?tab=${tab}`, { replace: true });
  };

  // Fetch published blogs
  const fetchPublishedBlogs = async (page = 1, query = "") => {
    try {
      setLoadingPublished(true);

      const response = await blogService.getUserBlogs(page, false, query);

      if (page === 1) {
        setPublishedBlogs(response.data.blogs);
      } else {
        setPublishedBlogs((prev) => [...prev, ...response.data.blogs]);
      }

      setHasMorePublished(response.data.blogs.length === 5);
      setPublishedPage(page);
      setLoadingPublished(false);
    } catch (error) {
      console.error("Error fetching published blogs:", error);
      setError("Failed to load published blogs");
      setLoadingPublished(false);
    }
  };

  // Fetch draft blogs
  const fetchDraftBlogs = async (page = 1, query = "") => {
    try {
      setLoadingDrafts(true);

      const response = await blogService.getUserBlogs(page, true, query);

      if (page === 1) {
        setDraftBlogs(response.data.blogs);
      } else {
        setDraftBlogs((prev) => [...prev, ...response.data.blogs]);
      }

      setHasMoreDrafts(response.data.blogs.length === 5);
      setDraftPage(page);
      setLoadingDrafts(false);
    } catch (error) {
      console.error("Error fetching draft blogs:", error);
      setError("Failed to load draft blogs");
      setLoadingDrafts(false);
    }
  };

  // Fetch blogger application status
  const fetchBloggerStatus = async () => {
    try {
      setLoadingBloggerStatus(true);

      const response = await userService.checkBloggerApplicationStatus();
      setBloggerStatus(response.data);

      setLoadingBloggerStatus(false);
    } catch (error) {
      console.error("Error fetching blogger status:", error);
      showToast("Failed to load blogger application status", "error");
      setLoadingBloggerStatus(false);
    }
  };

  // Format date
  const formatDate = (date) => {
    return format(new Date(date), "MMM d, yyyy");
  };

  // Delete blog
  const handleDeleteBlog = async (blogId) => {
    try {
      setDeleting(true);

      await blogService.deleteBlog(blogId);

      // Refresh blogs list
      if (activeTab === "published") {
        fetchPublishedBlogs(1, searchQuery);
      } else if (activeTab === "drafts") {
        fetchDraftBlogs(1, searchQuery);
      }

      showToast("Blog deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting blog:", error);
      showToast("Failed to delete blog", "error");
    } finally {
      setDeleting(false);
      setConfirmDeleteId(null);
    }
  };

  // Submit blogger application
  const handleBloggerApplication = async (reason, writingSamples = []) => {
    try {
      setLoadingBloggerStatus(true);

      await userService.applyForBlogger(reason, writingSamples);

      // Refresh status
      fetchBloggerStatus();

      showToast("Application submitted successfully", "success");
    } catch (error) {
      console.error("Error submitting blogger application:", error);
      if (error.response && error.response.data && error.response.data.error) {
        showToast(error.response.data.error, "error");
      } else {
        showToast("Failed to submit application", "error");
      }
      setLoadingBloggerStatus(false);
    }
  };

  // Handle load more notifications
  const handleLoadMoreNotifications = async () => {
    try {
      await fetchNotifications(notificationPage + 1, "all", 10);
      setNotificationPage((prev) => prev + 1);
      setHasMoreNotifications(totalNotifications > notificationPage * 10);
    } catch (error) {
      console.error("Error loading more notifications:", error);
      showToast("Failed to load more notifications", "error");
    }
  };

  // IMPORTANT: Define renderNotificationContent before tabsContent
  const renderNotificationContent = (notification) => {
    switch (notification.type) {
      case "like":
        return "liked your blog";
      case "comment":
        return "commented on your blog";
      case "reply":
        return "replied to your comment";
      case "follow":
        return "started following you";
      case "mention":
        return "mentioned you in a comment";
      case "blogger_request":
        return notification.message || "responded to your blogger application";
      case "blog_feature":
        return "featured your blog";
      case "role_update":
        return notification.message || "updated your role";
      case "blog_approval":
        return "approved your blog";
      case "account_status":
        return notification.message || "updated your account status";
      case "blog_published":
        return "published a new blog";
      default:
        return "interacted with your content";
    }
  };

  // Prepare tabs content
  const tabsContent = [
    {
      label: "Published",
      id: "published",
      icon: <FileText className="h-5 w-5 mr-2" />,
      content: (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Published Blogs
            </h2>
            <Button variant="primary" href="/editor" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Write New Blog
            </Button>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search your blogs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
          </div>

          {loadingPublished && publishedBlogs.length === 0 ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse bg-white dark:bg-gray-800 rounded-lg shadow p-4"
                >
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : publishedBlogs.length > 0 ? (
            <div className="space-y-4">
              {publishedBlogs.map((blog) => (
                <Card key={blog.blog_id} className="p-4">
                  <div className="flex flex-col sm:flex-row justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                        {blog.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Published on {formatDate(blog.publishedAt)}
                      </p>
                      {blog.des && (
                        <p className="text-gray-700 dark:text-gray-300 text-sm mt-2 line-clamp-2">
                          {blog.des}
                        </p>
                      )}

                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          <span>{blog.activity.total_reads}</span>
                        </div>
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 mr-1" />
                          <span>{blog.activity.total_likes}</span>
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          <span>{blog.activity.total_comments}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row sm:flex-col gap-2 mt-3 sm:mt-0 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        href={`/blog/${blog.blog_id}`}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        href={`/editor/${blog.blog_id}`}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setConfirmDeleteId(blog.blog_id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              {hasMorePublished && (
                <div className="flex justify-center mt-6">
                  <Button
                    variant="outline"
                    onClick={() =>
                      fetchPublishedBlogs(publishedPage + 1, searchQuery)
                    }
                    disabled={loadingPublished}
                    isLoading={loadingPublished}
                  >
                    Load More
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <EmptyState
              title="No published blogs yet"
              description="You haven't published any blogs yet. Start writing your first blog post!"
              actionText="Write New Blog"
              actionLink="/editor"
              icon={<FileText className="h-12 w-12 text-gray-400" />}
            />
          )}
        </div>
      ),
    },
    {
      label: "Drafts",
      id: "drafts",
      icon: <Edit className="h-5 w-5 mr-2" />,
      content: (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Draft Blogs
            </h2>
            <Button variant="primary" href="/editor" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Write New Blog
            </Button>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search your drafts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
          </div>

          {loadingDrafts && draftBlogs.length === 0 ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse bg-white dark:bg-gray-800 rounded-lg shadow p-4"
                >
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : draftBlogs.length > 0 ? (
            <div className="space-y-4">
              {draftBlogs.map((blog) => (
                <Card key={blog.blog_id} className="p-4">
                  <div className="flex flex-col sm:flex-row justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                          {blog.title || "Untitled Draft"}
                        </h3>
                        <Badge variant="info" className="ml-2">
                          Draft
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Last updated on {formatDate(blog.publishedAt)}
                      </p>
                      {blog.des && (
                        <p className="text-gray-700 dark:text-gray-300 text-sm mt-2 line-clamp-2">
                          {blog.des}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-row sm:flex-col gap-2 mt-3 sm:mt-0 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        href={`/editor/${blog.blog_id}`}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Continue Editing
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setConfirmDeleteId(blog.blog_id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              {hasMoreDrafts && (
                <div className="flex justify-center mt-6">
                  <Button
                    variant="outline"
                    onClick={() => fetchDraftBlogs(draftPage + 1, searchQuery)}
                    disabled={loadingDrafts}
                    isLoading={loadingDrafts}
                  >
                    Load More
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <EmptyState
              title="No draft blogs"
              description="You don't have any drafts. Start writing a new blog post!"
              actionText="Write New Blog"
              actionLink="/editor"
              icon={<Edit className="h-12 w-12 text-gray-400" />}
            />
          )}
        </div>
      ),
    },
    {
      label: "Notifications",
      id: "notifications",
      icon: <Bell className="h-5 w-5 mr-2" />,
      content: (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Notifications
            </h2>
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Mark All as Read
            </Button>
          </div>

          {notificationsLoading && notifications.length === 0 ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse bg-white dark:bg-gray-800 rounded-lg shadow p-4"
                >
                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <Card
                  key={notification._id}
                  className={`p-4 ${
                    !notification.seen ? "border-l-4 border-primary-500" : ""
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <Avatar
                      src={notification.user?.personal_info.profile_img}
                      alt={notification.user?.personal_info.fullname}
                      size="md"
                      onClick={() =>
                        navigate(
                          `/profile/${notification.user?.personal_info.username}`
                        )
                      }
                      className="cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <span
                            className="font-medium text-gray-900 dark:text-white cursor-pointer hover:underline"
                            onClick={() =>
                              navigate(
                                `/profile/${notification.user?.personal_info.username}`
                              )
                            }
                          >
                            {notification.user?.personal_info.fullname}
                          </span>
                          <span className="text-gray-700 dark:text-gray-300 ml-1">
                            {renderNotificationContent(notification)}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification._id)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {format(
                          new Date(notification.createdAt),
                          "MMM d, yyyy • h:mm a"
                        )}
                      </p>

                      {notification.comment && (
                        <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-900 rounded-md">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            "{notification.comment.comment}"
                          </p>
                        </div>
                      )}

                      {notification.blog && (
                        <Button
                          variant="link"
                          size="sm"
                          href={`/blog/${notification.blog.blog_id}`}
                          className="mt-2 inline-flex items-center text-primary-600 dark:text-primary-400"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View Blog
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}

              {hasMoreNotifications && (
                <div className="flex justify-center mt-6">
                  <Button
                    variant="outline"
                    onClick={handleLoadMoreNotifications}
                    disabled={notificationsLoading}
                    isLoading={notificationsLoading}
                  >
                    Load More
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <EmptyState
              title="No notifications"
              description="You don't have any notifications yet."
              icon={<Bell className="h-12 w-12 text-gray-400" />}
            />
          )}
        </div>
      ),
    },
    {
      label: "Blogger Application",
      id: "blogger-application",
      icon: <UserPlus className="h-5 w-5 mr-2" />,
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Blogger Application
          </h2>

          {loadingBloggerStatus ? (
            <div className="animate-pulse bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            </div>
          ) : currentUser?.role === "blogger" ||
            currentUser?.role === "admin" ? (
            <Card className="p-6">
              <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400 mb-4">
                <svg
                  className="h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white text-center mb-2">
                You Are a Blogger
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                You already have blogger privileges and can publish content on
                the platform.
              </p>
              <div className="flex justify-center">
                <Button variant="primary" href="/editor" className="px-6">
                  <Edit className="h-4 w-4 mr-2" />
                  Start Writing
                </Button>
              </div>
            </Card>
          ) : bloggerStatus?.has_applied ? (
            <Card className="p-6">
              {bloggerStatus.status === "pending" ? (
                <>
                  <div className="flex items-center justify-center space-x-2 text-yellow-600 dark:text-yellow-400 mb-4">
                    <svg
                      className="h-12 w-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white text-center mb-2">
                    Application Pending
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-center mb-2">
                    Your application to become a blogger is currently under
                    review. We'll notify you once a decision has been made.
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
                    Application submitted on{" "}
                    {formatDate(bloggerStatus.created_at)}
                  </p>
                </>
              ) : bloggerStatus.status === "approved" ? (
                <>
                  <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400 mb-4">
                    <svg
                      className="h-12 w-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white text-center mb-2">
                    Application Approved
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-center mb-2">
                    Congratulations! Your application to become a blogger has
                    been approved. Refresh the page to access your blogger
                    privileges.
                  </p>
                  <div className="flex justify-center mt-6">
                    <Button
                      variant="primary"
                      onClick={() => window.location.reload()}
                      className="px-6"
                    >
                      Refresh Page
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center space-x-2 text-red-600 dark:text-red-400 mb-4">
                    <svg
                      className="h-12 w-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white text-center mb-2">
                    Application Rejected
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
                    We're sorry, but your application to become a blogger was
                    not approved at this time.
                  </p>

                  {bloggerStatus.review_notes && (
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md mb-6">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Reviewer Notes:
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {bloggerStatus.review_notes}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-center">
                    <Button
                      variant="primary"
                      onClick={() => setActiveTab("blogger-application")}
                      className="px-6"
                    >
                      Apply Again
                    </Button>
                  </div>
                </>
              )}
            </Card>
          ) : (
            <BloggerApplicationForm onSubmit={handleBloggerApplication} />
          )}
        </div>
      ),
    },
  ];

  // Fetch data based on active tab
  useEffect(() => {
    if (!currentUser) return;

    if (activeTab === "published") {
      fetchPublishedBlogs(1, searchQuery);
    } else if (activeTab === "drafts") {
      fetchDraftBlogs(1, searchQuery);
    } else if (activeTab === "notifications") {
      fetchNotifications(1, "all", 10);
      setHasMoreNotifications(totalNotifications > 10);
    } else if (activeTab === "blogger-application") {
      fetchBloggerStatus();
    }

    // Update URL
    updateUrl(activeTab);
  }, [activeTab, currentUser, searchQuery]);

  // Get currently active tab index
  const getActiveTabIndex = () => {
    const tabIds = tabsContent.map((tab) => tab.id);
    return tabIds.indexOf(activeTab);
  };

  return (
    <div className=" mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Dashboard Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Dashboard
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 text-center">
              <div className="text-primary-600 dark:text-primary-400 mb-2">
                <FileText className="h-8 w-8 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentUser?.account_info?.total_posts || 0}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Published Blogs
              </p>
            </Card>

            <Card className="p-4 text-center">
              <div className="text-secondary-600 dark:text-secondary-400 mb-2">
                <Eye className="h-8 w-8 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentUser?.account_info?.total_reads || 0}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">Total Reads</p>
            </Card>

            <Card className="p-4 text-center">
              <div className="text-accent-600 dark:text-accent-400 mb-2">
                <Users className="h-8 w-8 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentUser?.account_info?.total_followers || 0}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">Followers</p>
            </Card>

            <Card className="p-4 text-center">
              <div className="text-green-600 dark:text-green-400 mb-2">
                <svg
                  className="h-8 w-8 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentUser?.account_info?.total_likes || 0}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">Total Likes</p>
            </Card>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <Card className="p-6">
          {/* Custom tabs navigation */}
          <div className="flex flex-col sm:flex-row mb-6 border-b border-gray-200 dark:border-gray-700">
            {tabsContent.map((tab) => (
              <button
                key={tab.id}
                className={`flex items-center px-4 py-3 font-medium text-sm border-b-2 -mb-px ${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600 dark:text-primary-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-700"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div>{tabsContent.find((tab) => tab.id === activeTab)?.content}</div>
        </Card>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        title="Confirm Delete"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to delete this blog? This action cannot be
            undone.
          </p>
          <div className="flex justify-end space-x-2">
            <Button
              variant="ghost"
              onClick={() => setConfirmDeleteId(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => handleDeleteBlog(confirmDeleteId)}
              disabled={deleting}
              isLoading={deleting}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Blogger Application Form Component
const BloggerApplicationForm = ({ onSubmit }) => {
  const [reason, setReason] = useState("");
  const [samples, setSamples] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate reason length
    if (!reason.trim() || reason.trim().length < 10) {
      setError("Please provide a detailed reason with at least 10 characters.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      // Convert samples to array if needed
      const writingSamples = samples.trim() ? [samples.trim()] : [];
      await onSubmit(reason, writingSamples);
    } catch (error) {
      console.error("Error submitting application:", error);
      setError("Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
        Apply to Become a Blogger
      </h3>

      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Share your knowledge and insights with our community! Fill out the form
        below to apply for blogger privileges.
      </p>

      <Alert variant="info" className="mb-6">
        <p className="text-sm">
          Blogger applications are reviewed by our team. Please provide detailed
          information about why you'd like to become a blogger and include
          examples of your writing experience if possible.
        </p>
      </Alert>

      {error && (
        <Alert variant="danger" className="mb-4">
          <p className="text-sm">{error}</p>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="reason"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Why do you want to become a blogger?{" "}
            <span className="text-red-500">*</span>
          </label>
          <textarea
            id="reason"
            rows={6}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Share your motivation, experience, and what topics you'd like to write about..."
            className={`w-full px-4 py-2 rounded-lg border ${
              reason.trim().length < 10 && reason.trim().length > 0
                ? "border-red-300 dark:border-red-700"
                : "border-gray-300 dark:border-gray-700"
            } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500`}
            required
          />
          <p
            className={`text-xs ${
              reason.trim().length < 10 ? "text-red-500" : "text-gray-500"
            } dark:text-gray-400 mt-1`}
          >
            Minimum 10 characters required.{" "}
            {reason.trim().length < 10 && reason.trim().length > 0
              ? `(${10 - reason.trim().length} more needed)`
              : ""}
            Be specific about your expertise and what you want to contribute.
          </p>
        </div>

        <div>
          <label
            htmlFor="samples"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Writing Samples (Optional)
          </label>
          <textarea
            id="samples"
            rows={4}
            value={samples}
            onChange={(e) => setSamples(e.target.value)}
            placeholder="Provide links to your previous writing work or samples..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            You can include links to your published work, personal blog, or
            other writing samples.
          </p>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            disabled={submitting || !reason.trim() || reason.trim().length < 10}
            isLoading={submitting}
          >
            Submit Application
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default DashboardPage;

// src/pages/user/SettingsPage.jsx
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User,
  Lock,
  Mail,
  Moon,
  Sun,
  Bell,
  Upload,
  Camera,
  Trash2,
  Facebook,
  Twitter,
  Instagram,
  Github,
  Globe,
  Eye,
  EyeOff,
  Badge,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useNotification } from "../../context/NotificationContext";
import { userService } from "../../services/userService";
import { uploadService } from "../../services/uploadService";
import { authService } from "../../services/authService";
import { VALIDATION } from "../../config/constants";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import TextArea from "../../components/ui/TextArea";
import Tabs from "../../components/ui/Tabs";
import Avatar from "../../components/ui/Avatar";
import Modal from "../../components/ui/Modal";
import Alert from "../../components/ui/Alert";

// Profile form validation
const profileSchema = z.object({
  username: z
    .string()
    .min(
      VALIDATION.USERNAME_MIN_LENGTH,
      `Username must be at least ${VALIDATION.USERNAME_MIN_LENGTH} characters long`
    )
    .max(20, "Username must be less than 20 characters long")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers and underscores"
    ),
  bio: z
    .string()
    .max(
      VALIDATION.BIO_MAX_LENGTH,
      `Bio must be less than ${VALIDATION.BIO_MAX_LENGTH} characters long`
    )
    .optional(),
  social_links: z
    .object({
      website: z
        .string()
        .url("Must be a valid URL")
        .or(z.literal(""))
        .optional(),
      twitter: z
        .string()
        .url("Must be a valid URL")
        .or(z.literal(""))
        .optional(),
      facebook: z
        .string()
        .url("Must be a valid URL")
        .or(z.literal(""))
        .optional(),
      instagram: z
        .string()
        .url("Must be a valid URL")
        .or(z.literal(""))
        .optional(),
      github: z
        .string()
        .url("Must be a valid URL")
        .or(z.literal(""))
        .optional(),
    })
    .optional(),
});

// Password change validation
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(20, "Password must be less than 20 characters long")
      .regex(
        VALIDATION.PASSWORD_REGEX,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const SettingsPage = () => {
  const { currentUser, updateUserData, logout } = useAuth();
  const { darkMode, toggleTheme, setTheme } = useTheme();
  const { showToast } = useNotification();

  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profileImage, setProfileImage] = useState(
    currentUser?.profile_img || ""
  );
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fileInputRef = useRef(null);

  // Profile form
  const {
    register: profileRegister,
    handleSubmit: handleProfileSubmit,
    reset: resetProfileForm,
    formState: { errors: profileErrors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: currentUser?.username || "",
      bio: currentUser?.bio || "",
      social_links: {
        website: currentUser?.social_links?.website || "",
        twitter: currentUser?.social_links?.twitter || "",
        facebook: currentUser?.social_links?.facebook || "",
        instagram: currentUser?.social_links?.instagram || "",
        github: currentUser?.social_links?.github || "",
      },
    },
  });

  // Password form
  const {
    register: passwordRegister,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Init form with user data
  useEffect(() => {
    if (currentUser) {
      resetProfileForm({
        username: currentUser.username || "",
        bio: currentUser.bio || "",
        social_links: {
          website: currentUser.social_links?.website || "",
          twitter: currentUser.social_links?.twitter || "",
          facebook: currentUser.social_links?.facebook || "",
          instagram: currentUser.social_links?.instagram || "",
          github: currentUser.social_links?.github || "",
        },
      });

      setProfileImage(currentUser.profile_img || "");
      setEmailNotifications(currentUser.email_notifications !== false);
    }
  }, [currentUser, resetProfileForm]);

  // Handle profile form submission
  const onProfileSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);

      // Update profile
      const response = await userService.updateProfile(
        data.username,
        data.bio || "",
        data.social_links
      );

      // Update user data in context
      updateUserData({
        username: response.data.username,
        bio: response.data.bio,
        social_links: response.data.social_links,
      });

      showToast("Profile updated successfully", "success");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.response?.data?.error || "Failed to update profile");
      showToast("Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle password form submission
  const onPasswordSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);

      // Change password
      await authService.changePassword(data.currentPassword, data.newPassword);

      // Reset form
      resetPasswordForm();

      showToast("Password changed successfully", "success");
    } catch (error) {
      console.error("Error changing password:", error);
      setError(error.response?.data?.error || "Failed to change password");
      showToast("Failed to change password", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle image upload button click
  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Handle image file change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type and size
    if (!file.type.includes("image/")) {
      showToast("Please select an image file", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB
      showToast("Image size should be less than 5MB", "error");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload image
    handleImageUpload(file);
  };

  // Handle image upload
  const handleImageUpload = async (file) => {
    try {
      setUploadingImage(true);

      // Upload to S3
      const { fileUrl } = await uploadService.uploadToS3(file);

      // Update profile image in backend
      const response = await userService.updateProfileImage(fileUrl);

      // Update user data in context
      updateUserData({
        profile_img: response.data.profile_img,
      });

      // Update state
      setProfileImage(response.data.profile_img);
      setPreviewImage(null);

      showToast("Profile image updated successfully", "success");
    } catch (error) {
      console.error("Error uploading image:", error);
      showToast("Failed to upload image", "error");
    } finally {
      setUploadingImage(false);
    }
  };

  // Toggle email notifications
  const handleToggleEmailNotifications = async () => {
    try {
      // In a real app, this would call an API to update the setting
      // For now, we'll just toggle the state
      setEmailNotifications(!emailNotifications);

      showToast(
        `Email notifications ${!emailNotifications ? "enabled" : "disabled"}`,
        "success"
      );
    } catch (error) {
      console.error("Error toggling email notifications:", error);
      showToast("Failed to update notification settings", "error");
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    try {
      setLoading(true);

      // In a real app, this would call an API to delete the account
      showToast(
        "This is a demo feature. Account deletion not implemented.",
        "info"
      );

      // Close modal
      setShowDeleteAccountModal(false);
    } catch (error) {
      console.error("Error deleting account:", error);
      showToast("Failed to delete account", "error");
    } finally {
      setLoading(false);
    }
  };

  // Prepare tabs content
  const tabsContent = [
    {
      label: "Profile",
      icon: <User className="h-5 w-5 mr-2" />,
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Profile Settings
          </h2>

          {/* Profile Image */}
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
            <div className="flex flex-col items-center">
              <div className="relative group">
                <Avatar
                  src={previewImage || profileImage}
                  alt={currentUser?.fullname}
                  size="2xl"
                  className="h-32 w-32 border-4 border-white dark:border-gray-800 shadow-lg"
                />

                <div
                  className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={handleImageButtonClick}
                >
                  <Camera className="h-6 w-6 text-white" />
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div className="mt-4 flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleImageButtonClick}
                  disabled={uploadingImage}
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Upload
                </Button>
              </div>
            </div>

            <div className="flex-1">
              <form
                onSubmit={handleProfileSubmit(onProfileSubmit)}
                className="space-y-4"
              >
                {/* Username */}
                <Input
                  label="Username"
                  {...profileRegister("username")}
                  error={profileErrors.username?.message}
                  placeholder="username"
                  required
                  disabled={loading}
                  icon={<User className="h-5 w-5 text-gray-400" />}
                />

                {/* Bio */}
                <TextArea
                  label="Bio"
                  {...profileRegister("bio")}
                  error={profileErrors.bio?.message}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  disabled={loading}
                />

                {/* Social Links */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Social Links
                  </label>

                  <div className="space-y-4">
                    <Input
                      {...profileRegister("social_links.website")}
                      error={profileErrors.social_links?.website?.message}
                      placeholder="Website URL"
                      disabled={loading}
                      icon={<Globe className="h-5 w-5 text-gray-400" />}
                    />

                    <Input
                      {...profileRegister("social_links.twitter")}
                      error={profileErrors.social_links?.twitter?.message}
                      placeholder="Twitter URL"
                      disabled={loading}
                      icon={<Twitter className="h-5 w-5 text-gray-400" />}
                    />

                    <Input
                      {...profileRegister("social_links.facebook")}
                      error={profileErrors.social_links?.facebook?.message}
                      placeholder="Facebook URL"
                      disabled={loading}
                      icon={<Facebook className="h-5 w-5 text-gray-400" />}
                    />

                    <Input
                      {...profileRegister("social_links.instagram")}
                      error={profileErrors.social_links?.instagram?.message}
                      placeholder="Instagram URL"
                      disabled={loading}
                      icon={<Instagram className="h-5 w-5 text-gray-400" />}
                    />

                    <Input
                      {...profileRegister("social_links.github")}
                      error={profileErrors.social_links?.github?.message}
                      placeholder="GitHub URL"
                      disabled={loading}
                      icon={<Github className="h-5 w-5 text-gray-400" />}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                    isLoading={loading}
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ),
    },
    {
      label: "Account",
      icon: <Lock className="h-5 w-5 mr-2" />,
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Account Settings
          </h2>

          {/* User Info */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Email Address
                </h3>
                <p className="text-base font-medium text-gray-900 dark:text-white mt-1">
                  {currentUser?.email}
                </p>
              </div>

              <div>
                <Badge
                  color={currentUser?.email_verified ? "success" : "warning"}
                >
                  {currentUser?.email_verified ? "Verified" : "Not Verified"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Change Password Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Change Password
            </h3>

            {error && (
              <Alert
                variant="error"
                title="Error"
                onClose={() => setError(null)}
                className="mb-4"
              >
                {error}
              </Alert>
            )}

            <form
              onSubmit={handlePasswordSubmit(onPasswordSubmit)}
              className="space-y-4"
            >
              <Input
                label="Current Password"
                {...passwordRegister("currentPassword")}
                type={showCurrentPassword ? "text" : "password"}
                error={passwordErrors.currentPassword?.message}
                placeholder="••••••••"
                required
                disabled={loading}
                icon={<Lock className="h-5 w-5 text-gray-400" />}
                appendIcon={
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                }
              />

              <Input
                label="New Password"
                {...passwordRegister("newPassword")}
                type={showNewPassword ? "text" : "password"}
                error={passwordErrors.newPassword?.message}
                placeholder="••••••••"
                required
                disabled={loading}
                icon={<Lock className="h-5 w-5 text-gray-400" />}
                appendIcon={
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                }
              />

              <Input
                label="Confirm New Password"
                {...passwordRegister("confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                error={passwordErrors.confirmPassword?.message}
                placeholder="••••••••"
                required
                disabled={loading}
                icon={<Lock className="h-5 w-5 text-gray-400" />}
                appendIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                }
              />

              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  isLoading={loading}
                >
                  Update Password
                </Button>
              </div>
            </form>
          </div>

          {/* Delete Account Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-4">
              Danger Zone
            </h3>

            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Once you delete your account, there is no going back. Please be
              certain.
            </p>

            <Button
              variant="danger"
              onClick={() => setShowDeleteAccountModal(true)}
              className="px-6"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </div>
      ),
    },
    {
      label: "Preferences",
      icon: <Bell className="h-5 w-5 mr-2" />,
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Preferences
          </h2>

          {/* Theme Settings */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Theme
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card
                className={`p-4 cursor-pointer ${
                  !darkMode ? "ring-2 ring-primary-500" : ""
                }`}
                onClick={() => setTheme(false)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Sun className="h-5 w-5 text-orange-500 mr-2" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      Light
                    </span>
                  </div>
                  {!darkMode && (
                    <div className="h-2 w-2 bg-primary-500 rounded-full"></div>
                  )}
                </div>
              </Card>

              <Card
                className={`p-4 cursor-pointer ${
                  darkMode ? "ring-2 ring-primary-500" : ""
                }`}
                onClick={() => setTheme(true)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Moon className="h-5 w-5 text-indigo-500 mr-2" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      Dark
                    </span>
                  </div>
                  {darkMode && (
                    <div className="h-2 w-2 bg-primary-500 rounded-full"></div>
                  )}
                </div>
              </Card>

              <Card className="p-4 cursor-pointer" onClick={toggleTheme}>
                <div className="flex items-center">
                  <div className="flex items-center">
                    <div className="relative">
                      <Sun className="h-5 w-5 text-orange-500" />
                      <Moon className="h-5 w-5 text-indigo-500 absolute top-0 left-0 opacity-40" />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white ml-2">
                      System
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Choose your preferred theme for the ChronoSpace interface.
            </p>
          </div>

          {/* Notification Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Notifications
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Email Notifications
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive email notifications for important updates
                  </p>
                </div>
                <div className="relative inline-block w-12 h-6">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    className="opacity-0 w-0 h-0"
                    checked={emailNotifications}
                    onChange={handleToggleEmailNotifications}
                  />
                  <label
                    htmlFor="emailNotifications"
                    className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors ${
                      emailNotifications
                        ? "bg-primary-500"
                        : "bg-gray-300 dark:bg-gray-700"
                    }`}
                  >
                    <span
                      className={`absolute left-1 bottom-1 bg-white dark:bg-gray-200 w-4 h-4 rounded-full transition-transform ${
                        emailNotifications ? "transform translate-x-6" : ""
                      }`}
                    ></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  // Get currently active tab index
  const getActiveTabIndex = () => {
    const tabIds = tabsContent.map((tab) => tab.id);
    return tabIds.indexOf(activeTab) !== -1 ? tabIds.indexOf(activeTab) : 0;
  };

  return (
    <div className=" mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Settings Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Settings Content */}
        <Card className="p-6">
          {/* Custom tabs navigation */}
          <div className="flex flex-col sm:flex-row mb-6 border-b border-gray-200 dark:border-gray-700">
            {tabsContent.map((tab) => (
              <button
                key={tab.label}
                className={`flex items-center px-4 py-3 font-medium text-sm border-b-2 -mb-px ${
                  activeTab === tab.label.toLowerCase()
                    ? "border-primary-500 text-primary-600 dark:text-primary-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-700"
                }`}
                onClick={() => setActiveTab(tab.label.toLowerCase())}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div>
            {
              tabsContent.find((tab) => tab.label.toLowerCase() === activeTab)
                ?.content
            }
          </div>
        </Card>
      </motion.div>

      {/* Delete Account Modal */}
      <Modal
        isOpen={showDeleteAccountModal}
        onClose={() => setShowDeleteAccountModal(false)}
        title="Delete Account"
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-center text-red-600 dark:text-red-400 mb-4">
            <svg
              className="h-16 w-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h3 className="text-lg font-bold text-center text-gray-900 dark:text-white">
            Are you absolutely sure?
          </h3>

          <p className="text-gray-600 dark:text-gray-400 text-center">
            This action cannot be undone. This will permanently delete your
            account and remove all your data from our servers.
          </p>

          <div className="pt-4">
            <Input
              placeholder="Type 'delete' to confirm"
              className="text-center"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="ghost"
              onClick={() => setShowDeleteAccountModal(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteAccount}
              disabled={loading}
              isLoading={loading}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SettingsPage;

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
                          {/* Fix the null author issue with a conditional check */}
                          By{" "}
                          {blog.author && blog.author.personal_info
                            ? blog.author.personal_info.fullname
                            : "Unknown Author"}{" "}
                          • {blog.estimated_read_time || 1} min read
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

// src/services/adminService.js
import api from "./api";

export const adminService = {
  // Get all users (paginated)
  getAllUsers: async (
    page = 1,
    limit = 10,
    query = "",
    role = "all",
    status = "all"
  ) => {
    return api.get(
      `/admin/users?page=${page}&limit=${limit}&query=${query}&role=${role}&status=${status}`
    );
  },

  // Update user role
  updateUserRole: async (userId, role) => {
    return api.post("/admin/update-user-role", { userId, role });
  },

  // Update account status
  updateAccountStatus: async (userId, status) => {
    return api.post("/admin/update-account-status", { userId, status });
  },

  // Get all blogs (admin view)
  getAllBlogs: async (
    page = 1,
    limit = 10,
    query = "",
    status = "all",
    author = "",
    featured = "all"
  ) => {
    return api.get(
      `/admin/blogs?page=${page}&limit=${limit}&query=${query}&status=${status}&author=${author}&featured=${featured}`
    );
  },

  // Toggle featured status of a blog
  toggleFeatureBlog: async (blog_id) => {
    return api.post("/admin/toggle-feature-blog", { blog_id });
  },

  // Get pending blogger applications
  getPendingBloggerApplications: async (page = 1, limit = 10) => {
    return api.get(
      `/admin/pending-blogger-applications?page=${page}&limit=${limit}`
    );
  },

  // Review blogger application
  reviewBloggerApplication: async (request_id, status, review_notes = "") => {
    return api.post("/admin/review-blogger-application", {
      request_id,
      status,
      review_notes,
    });
  },

  // Get dashboard statistics
  getDashboardStats: async () => {
    return api.get("/admin/dashboard-stats");
  },
};

// src/services/api.js
import axios from "axios";
import { API_URL } from "../config/constants";

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
});

// Add request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for handling 401 unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 unauthorized (expired token)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

export default api;

// src/services/blogService.js
import api from "./api";

export const blogService = {
  // Get a single blog post
  getBlog: async (blog_id, draft = false, mode = "") => {
    return api.post("/blogs/get-blog", { blog_id, draft, mode });
  },

  // Get latest blogs (paginated)
  getLatestBlogs: async (page = 1, limit = 5) => {
    return api.post("/blogs/latest-blogs", { page, limit });
  },

  // Get trending blogs
  getTrendingBlogs: async (limit = 5) => {
    return api.get(`/blogs/trending-blogs?limit=${limit}`);
  },

  // Get featured blogs
  getFeaturedBlogs: async (limit = 3) => {
    return api.get(`/blogs/featured-blogs?limit=${limit}`);
  },

  // Search blogs
  searchBlogs: async (params) => {
    return api.post("/blogs/search-blogs", params);
  },

  // Count search results
  countSearchBlogs: async (params) => {
    return api.post("/blogs/search-blogs-count", params);
  },

  // Like/unlike a blog
  toggleLikeBlog: async (_id, islikedByUser) => {
    return api.post("/blogs/like-blog", { _id, islikedByUser });
  },

  // Check if user has liked a blog
  checkLikedByUser: async (_id) => {
    return api.post("/blogs/isliked-by-user", { _id });
  },

  // Create or update a blog post
  createUpdateBlog: async (blogData) => {
    return api.post("/blogs/create-blog", blogData);
  },

  // Delete a blog post
  deleteBlog: async (blog_id) => {
    return api.post("/blogs/delete-blog", { blog_id });
  },

  // Get user's written blogs
  getUserBlogs: async (
    page = 1,
    draft = false,
    query = "",
    limit = 5,
    deletedDocCount = 0
  ) => {
    return api.post("/blogs/user-written-blogs", {
      page,
      draft,
      query,
      limit,
      deletedDocCount,
    });
  },

  // Count user's written blogs
  countUserBlogs: async (draft = false, query = "") => {
    return api.post("/blogs/user-written-blogs-count", { draft, query });
  },
};

// src/services/blogService.js
import api from "./api";

export const blogService = {
  // Get a single blog post
  getBlog: async (blog_id, draft = false, mode = "") => {
    return api.post("/blogs/get-blog", { blog_id, draft, mode });
  },

  // Get latest blogs (paginated)
  getLatestBlogs: async (page = 1, limit = 5) => {
    return api.post("/blogs/latest-blogs", { page, limit });
  },

  // Get trending blogs
  getTrendingBlogs: async (limit = 5) => {
    return api.get(`/blogs/trending-blogs?limit=${limit}`);
  },

  // Get featured blogs
  getFeaturedBlogs: async (limit = 3) => {
    return api.get(`/blogs/featured-blogs?limit=${limit}`);
  },

  // Search blogs
  searchBlogs: async (params) => {
    return api.post("/blogs/search-blogs", params);
  },

  // Count search results
  countSearchBlogs: async (params) => {
    return api.post("/blogs/search-blogs-count", params);
  },

  // Like/unlike a blog
  toggleLikeBlog: async (_id, islikedByUser) => {
    return api.post("/blogs/like-blog", { _id, islikedByUser });
  },

  // Check if user has liked a blog
  checkLikedByUser: async (_id) => {
    return api.post("/blogs/isliked-by-user", { _id });
  },

  // Create or update a blog post
  createUpdateBlog: async (blogData) => {
    return api.post("/blogs/create-blog", blogData);
  },

  // Delete a blog post
  deleteBlog: async (blog_id) => {
    return api.post("/blogs/delete-blog", { blog_id });
  },

  // Get user's written blogs
  getUserBlogs: async (
    page = 1,
    draft = false,
    query = "",
    limit = 5,
    deletedDocCount = 0
  ) => {
    return api.post("/blogs/user-written-blogs", {
      page,
      draft,
      query,
      limit,
      deletedDocCount,
    });
  },

  // Count user's written blogs
  countUserBlogs: async (draft = false, query = "") => {
    return api.post("/blogs/user-written-blogs-count", { draft, query });
  },
};

// src/services/commentService.js
import api from "./api";

export const commentService = {
  // Add a comment to a blog
  addComment: async (commentData) => {
    return api.post("/interactions/add-comment", commentData);
  },

  // Get blog comments
  getBlogComments: async (blog_id, skip = 0, limit = 5) => {
    return api.post("/interactions/get-blog-comments", {
      blog_id,
      skip,
      limit,
    });
  },

  // Get replies to a comment
  getCommentReplies: async (_id, skip = 0, limit = 5) => {
    return api.post("/interactions/get-replies", { _id, skip, limit });
  },

  // Delete a comment
  deleteComment: async (_id) => {
    return api.post("/interactions/delete-comment", { _id });
  },
};


// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

// Replace with your Firebase configuration
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyAZakXKMvdhzQxE74pwd7fav1IGANKyl5s",
  authDomain: "chronospace-3d550.firebaseapp.com",
  projectId: "chronospace-3d550",
  storageBucket: "chronospace-3d550.appspot.com",
  messagingSenderId: "81648675498",
  appId: "1:81648675498:web:01afe323f630b31299fed3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Sign in with Google popup
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);

    // Get the user's information
    const user = result.user;

    // Get the access token from the auth credential
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const accessToken = credential.accessToken;

    return { user, accessToken };
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export default auth;

// src/services/notificationService.js
import api from "./api";

export const notificationService = {
  // Check for new notifications
  checkNewNotifications: async () => {
    return api.get("/interactions/new-notifications");
  },

  // Get notifications (paginated)
  getNotifications: async (
    page = 1,
    filter = "all",
    limit = 10,
    deletedDocCount = 0
  ) => {
    return api.post("/interactions/notifications", {
      page,
      filter,
      limit,
      deletedDocCount,
    });
  },

  // Count total notifications
  countNotifications: async (filter = "all") => {
    return api.post("/interactions/all-notifications-count", { filter });
  },

  // Mark all notifications as read
  markAllNotificationsRead: async () => {
    return api.post("/interactions/mark-all-notifications-read");
  },

  // Delete a notification
  deleteNotification: async (notification_id) => {
    return api.post("/interactions/delete-notification", { notification_id });
  },
};

// src/services/uploadService.js
import api from "./api";

export const uploadService = {
  // Get a signed upload URL for S3
  getUploadUrl: async (contentType = "image/jpeg") => {
    return api.get(`/uploads/get-upload-url?contentType=${contentType}`);
  },

  // Delete a file from S3
  deleteFile: async (fileUrl) => {
    return api.post("/uploads/delete-file", { fileUrl });
  },

  // Upload a file to S3 using the provided URL
  uploadToS3: async (file, contentType = "image/jpeg") => {
    try {
      // Get a signed URL
      const response = await uploadService.getUploadUrl(contentType);
      const { uploadURL, fileUrl } = response.data;

      // Upload file directly to S3
      await fetch(uploadURL, {
        method: "PUT",
        headers: {
          "Content-Type": contentType,
        },
        body: file,
      });

      return { success: true, fileUrl };
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  },
};

// Create a custom image upload handler for Editor.js
export const createImageUploadHandler = () => {
  return {
    uploadByFile: async (file) => {
      try {
        // Get file type
        const contentType = file.type;

        // Upload file
        const { fileUrl } = await uploadService.uploadToS3(file, contentType);

        return {
          success: 1,
          file: {
            url: fileUrl,
          },
        };
      } catch (error) {
        console.error("Error uploading image:", error);
        return {
          success: 0,
          file: {
            url: null,
          },
        };
      }
    },
  };
};

// src/services/userService.js
import api from "./api";

export const userService = {
  // Get user profile
  getProfile: async (username) => {
    return api.post("/users/get-profile", { username });
  },

  // Update profile image
  updateProfileImage: async (url) => {
    return api.post("/users/update-profile-img", { url });
  },

  // Update profile details
  updateProfile: async (username, bio, social_links) => {
    return api.post("/users/update-profile", { username, bio, social_links });
  },

  // Follow/unfollow a user
  followUser: async (userId) => {
    return api.post("/users/follow-user", { userId });
  },

  // Check if user is following another user
  checkIsFollowing: async (userId) => {
    return api.post("/users/is-following", { userId });
  },

  // Get user's followers
  getFollowers: async (userId, page = 1, limit = 10) => {
    return api.post("/users/get-followers", { userId, page, limit });
  },

  // Get user's following
  getFollowing: async (userId, page = 1, limit = 10) => {
    return api.post("/users/get-following", { userId, page, limit });
  },

  // Apply to become a blogger
  applyForBlogger: async (reason, writing_samples = []) => {
    return api.post("/users/apply-blogger", { reason, writing_samples });
  },

  // Check blogger application status
  checkBloggerApplicationStatus: async () => {
    return api.get("/users/blogger-application-status");
  },

  // Search for users
  searchUsers: async (query, page = 1, limit = 10) => {
    return api.post("/users/search-users", { query, page, limit });
  },
};

import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RoleBasedRoute from "./components/auth/RoleBasedRoute";
import LoadingScreen from "./components/ui/LoadingScreen";
import MainLayout from "./components/layouts/MainLayout";

const HomePage = lazy(() => import("./pages/HomePage"));
const SignUpPage = lazy(() => import("./pages/auth/SignUpPage"));
const SignInPage = lazy(() => import("./pages/auth/SignInPage"));
const VerifyEmailPage = lazy(() => import("./pages/auth/VerifyEmailPage"));
const ResetPasswordPage = lazy(() => import("./pages/auth/ResetPasswordPage"));
const BlogPage = lazy(() => import("./pages/blog/BlogPage"));
const SearchPage = lazy(() => import("./pages/blog/SearchPage"));
const TagPage = lazy(() => import("./pages/blog/TagPage"));
const ProfilePage = lazy(() => import("./pages/user/ProfilePage"));
const SettingsPage = lazy(() => import("./pages/user/SettingsPage"));
const EditorPage = lazy(() => import("./pages/blog/EditorPage"));
const DashboardPage = lazy(() => import("./pages/user/DashboardPage"));
const AdminDashboardPage = lazy(() =>
  import("./pages/admin/AdminDashboardPage")
);
const AdminUsersPage = lazy(() => import("./pages/admin/AdminUsersPage"));
const AdminBlogsPage = lazy(() => import("./pages/admin/AdminBlogsPage"));
const AdminBloggerApplicationsPage = lazy(() =>
  import("./pages/admin/AdminBloggerApplicationsPage")
);
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="blog/:blogId" element={<BlogPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="tag/:tag" element={<TagPage />} />
          <Route path="profile/:username" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Auth routes */}
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* Protected routes (require login) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/settings" element={<MainLayout />}>
            <Route index element={<SettingsPage />} />
          </Route>
          <Route path="/dashboard" element={<MainLayout />}>
            <Route index element={<DashboardPage />} />
          </Route>
        </Route>

        {/* Blogger & Admin routes */}
        <Route element={<RoleBasedRoute roles={["blogger", "admin"]} />}>
          <Route path="/editor" element={<MainLayout />}>
            <Route index element={<EditorPage />} />
            <Route path=":blogId" element={<EditorPage />} />
          </Route>
        </Route>

        {/* Admin routes */}
        <Route element={<RoleBasedRoute roles={["admin"]} />}>
          <Route path="/admin" element={<MainLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="blogs" element={<AdminBlogsPage />} />
            <Route
              path="applications"
              element={<AdminBloggerApplicationsPage />}
            />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
