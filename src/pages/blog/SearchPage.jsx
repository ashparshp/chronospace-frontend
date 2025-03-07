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
        <div className="bg-white dark:bg-black rounded-lg shadow-md p-6">
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
        <div className="bg-white dark:bg-black rounded-lg shadow-md overflow-hidden">
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
                        className="animate-pulse bg-white dark:bg-black rounded-lg shadow p-4"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="h-12 w-12 bg-gray-200 dark:bg-black rounded-full"></div>
                          <div className="space-y-2 flex-1">
                            <div className="h-4 bg-gray-200 dark:bg-black rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 dark:bg-black rounded w-1/2"></div>
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
