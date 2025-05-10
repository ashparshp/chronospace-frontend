import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Star,
  Eye,
  Trash2,
  Edit,
  ExternalLink,
  AlertCircle,
  FileText,
  Calendar,
  Bookmark,
  User,
  Settings,
} from "lucide-react";
import { format } from "date-fns";
import { adminService } from "../../services/adminService";
import { blogService } from "../../services/blogService";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import { BLOG_STATUS, BLOG_VISIBILITY } from "../../config/constants";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Avatar from "../../components/ui/Avatar";
import EmptyState from "../../components/ui/EmptyState";
import Modal from "../../components/ui/Modal";
import StatCard from "../../components/ui/StatsCard";

const AdminBlogsPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { showToast } = useNotification();

  // State for blogs list and pagination
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);

  // State for filters and search
  const [filters, setFilters] = useState({
    query: "",
    status: "all",
    author: "",
    featured: "all",
  });

  // State for modals
  const [showFilters, setShowFilters] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [featuringBlog, setFeaturingBlog] = useState(null);
  const [featuring, setFeaturing] = useState(false);

  // Fetch blogs with applied filters
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await adminService.getAllBlogs(
          page,
          10,
          filters.query,
          filters.status,
          filters.author,
          filters.featured
        );

        setBlogs(response.data.blogs);
        setTotalPages(response.data.total_pages);
        setTotalBlogs(response.data.total);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setError("Failed to load blogs");
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [page, filters]);

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Handle filter change
  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPage(1); // Reset to first page when filters change
  };

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Filter is already applied through state
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      query: "",
      status: "all",
      author: "",
      featured: "all",
    });
    setPage(1);
  };

  // Delete blog
  const handleDeleteBlog = async (blogId) => {
    try {
      setDeleting(true);

      await blogService.deleteBlog(blogId);

      // Refresh blogs list
      setBlogs(blogs.filter((blog) => blog.blog_id !== blogId));
      setTotalBlogs((prev) => prev - 1);

      showToast("Blog deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting blog:", error);
      showToast("Failed to delete blog", "error");
    } finally {
      setDeleting(false);
      setConfirmDeleteId(null);
    }
  };

  // Toggle featured status
  const handleToggleFeature = async (blog) => {
    try {
      setFeaturing(true);

      const response = await adminService.toggleFeatureBlog(blog.blog_id);

      // Update blog in the list
      setBlogs(
        blogs.map((b) =>
          b.blog_id === blog.blog_id
            ? { ...b, featured: response.data.featured }
            : b
        )
      );

      showToast(
        `Blog ${
          response.data.featured ? "featured" : "unfeatured"
        } successfully`,
        "success"
      );
    } catch (error) {
      console.error("Error toggling feature status:", error);
      showToast("Failed to update feature status", "error");
    } finally {
      setFeaturing(false);
      setFeaturingBlog(null);
    }
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case BLOG_STATUS.PUBLISHED:
        return <Badge variant="success">Published</Badge>;
      case BLOG_STATUS.DRAFT:
        return <Badge variant="warning">Draft</Badge>;
      case BLOG_STATUS.UNDER_REVIEW:
        return <Badge variant="info">Under Review</Badge>;
      case BLOG_STATUS.REJECTED:
        return <Badge variant="danger">Rejected</Badge>;
      case BLOG_STATUS.ARCHIVED:
        return <Badge variant="secondary">Archived</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Get visibility badge
  const getVisibilityBadge = (visibility) => {
    switch (visibility) {
      case BLOG_VISIBILITY.PUBLIC:
        return <Badge variant="secondary">Public</Badge>;
      case BLOG_VISIBILITY.PRIVATE:
        return <Badge variant="warning">Private</Badge>;
      case BLOG_VISIBILITY.FOLLOWERS_ONLY:
        return <Badge variant="info">Followers Only</Badge>;
      default:
        return <Badge>{visibility}</Badge>;
    }
  };

  // Check if user is admin
  const isAdmin = currentUser && currentUser.role === "admin";

  // If not admin
  if (!isAdmin) {
    return (
      <EmptyState
        title="Access Denied"
        description="You need administrator privileges to access this page."
        actionText="Go to Home"
        actionLink="/"
        icon={<AlertCircle className="h-12 w-12 text-red-500" />}
      />
    );
  }

  return (
    <div className="mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Admin Header - Styled to match new design */}
        <div className="rounded-2xl overflow-hidden shadow-lg mb-8">
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
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-6 md:mb-0">
                  <Button
                    variant="white"
                    size="sm"
                    onClick={() => navigate("/admin")}
                    className="mb-4"
                    icon={<ArrowLeft className="h-4 w-4" />}
                    iconPosition="left"
                    shadowDepth="shallow"
                  >
                    Back to Dashboard
                  </Button>

                  <motion.h1
                    className="font-playfair text-3xl md:text-4xl font-bold mb-2 tracking-tight leading-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">
                      Manage Content
                    </span>
                  </motion.h1>

                  <motion.p
                    className="font-montserrat text-lg leading-relaxed text-gray-700 dark:text-gray-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    {totalBlogs} blogs in your platform
                  </motion.p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="white"
                    size="md"
                    onClick={() => setShowFilters(!showFilters)}
                    glossy={true}
                    shadowDepth="shallow"
                    icon={<Filter className="h-4 w-4" />}
                    iconPosition="left"
                  >
                    {showFilters ? "Hide Filters" : "Show Filters"}
                  </Button>

                  <Button
                    variant="primary"
                    size="md"
                    href="/editor"
                    glossy={true}
                    shadowDepth="deep"
                    icon={<Edit className="h-4 w-4" />}
                    iconPosition="left"
                  >
                    Create Blog
                  </Button>
                </div>
              </div>

              {/* Admin Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                <StatCard
                  title="Total Blogs"
                  value={totalBlogs}
                  icon={<FileText />}
                  delay={0.1}
                />
                <StatCard
                  title="Featured"
                  value={blogs.filter((blog) => blog.featured).length}
                  icon={<Star />}
                  iconBgColor="bg-indigo-500/20"
                  iconColor="text-indigo-600 dark:text-indigo-400"
                  delay={0.2}
                />
                <StatCard
                  title="Published"
                  value={
                    blogs.filter(
                      (blog) => blog.status === BLOG_STATUS.PUBLISHED
                    ).length
                  }
                  icon={<Bookmark />}
                  iconBgColor="bg-green-500/20"
                  iconColor="text-green-600 dark:text-green-400"
                  delay={0.3}
                />
                <StatCard
                  title="Pending Review"
                  value={
                    blogs.filter(
                      (blog) => blog.status === BLOG_STATUS.UNDER_REVIEW
                    ).length
                  }
                  icon={<Settings />}
                  iconBgColor="bg-orange-500/20"
                  iconColor="text-orange-600 dark:text-orange-400"
                  delay={0.4}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Filters  */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 border border-gray-100 dark:border-gray-800 shadow-md">
              <h3 className="font-playfair text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Filter Blogs
              </h3>
              <form
                onSubmit={handleSearchSubmit}
                className="grid grid-cols-1 md:grid-cols-4 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-montserrat">
                    Search
                  </label>
                  <Input
                    placeholder="Search blogs..."
                    value={filters.query}
                    onChange={(e) =>
                      handleFilterChange("query", e.target.value)
                    }
                    icon={<Search className="h-5 w-5 text-gray-400" />}
                    className="bg-white dark:bg-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-montserrat">
                    Status
                  </label>
                  <Select
                    value={filters.status}
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                    options={[
                      { value: "all", label: "All Statuses" },
                      { value: BLOG_STATUS.PUBLISHED, label: "Published" },
                      { value: BLOG_STATUS.DRAFT, label: "Draft" },
                      {
                        value: BLOG_STATUS.UNDER_REVIEW,
                        label: "Under Review",
                      },
                      { value: BLOG_STATUS.REJECTED, label: "Rejected" },
                      { value: BLOG_STATUS.ARCHIVED, label: "Archived" },
                    ]}
                    className="bg-white dark:bg-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-montserrat">
                    Author
                  </label>
                  <Input
                    placeholder="Filter by author username"
                    value={filters.author}
                    onChange={(e) =>
                      handleFilterChange("author", e.target.value)
                    }
                    className="bg-white dark:bg-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-montserrat">
                    Featured
                  </label>
                  <Select
                    value={filters.featured}
                    onChange={(e) =>
                      handleFilterChange("featured", e.target.value)
                    }
                    options={[
                      { value: "all", label: "All Blogs" },
                      { value: "true", label: "Featured" },
                      { value: "false", label: "Not Featured" },
                    ]}
                    className="bg-white dark:bg-gray-900"
                  />
                </div>

                <div className="flex space-x-2 col-span-full justify-end mt-2">
                  <Button variant="ghost" type="button" onClick={resetFilters}>
                    Reset
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    glossy={true}
                    shadowDepth="shallow"
                  >
                    Apply Filters
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}

        {/* Blogs List  */}
        <div className="space-y-4">
          {loading && blogs.length === 0 ? (
            // Loading skeleton with improved styling
            Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700 p-5"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="flex gap-2">
                      <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 mt-1"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col gap-2 mt-4 sm:mt-0 sm:ml-4">
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
                  </div>
                </div>
              </div>
            ))
          ) : blogs.length > 0 ? (
            blogs.map((blog, index) => (
              <motion.div
                key={blog.blog_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="p-5 border border-gray-100 dark:border-gray-700 hover:border-violet-200 dark:hover:border-violet-800 transition-all duration-300 hover:shadow-md">
                  <div className="flex flex-col sm:flex-row justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <h3 className="font-playfair text-lg font-bold text-gray-900 dark:text-white hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200 truncate mr-2">
                          {blog.title}
                        </h3>
                        {blog.featured && (
                          <Badge
                            variant="accent"
                            className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs"
                          >
                            <Star className="h-3 w-3 mr-1" /> Featured
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        {getStatusBadge(blog.status)}
                        {getVisibilityBadge(blog.visibility)}
                        {blog.tags &&
                          blog.tags.map((tag, i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="text-xs px-2 py-0.5 font-mono lowercase bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                            >
                              #{tag}
                            </Badge>
                          ))}
                      </div>

                      <div className="flex items-center mt-3">
                        <Avatar
                          src={blog.author.personal_info.profile_img}
                          alt={blog.author.personal_info.fullname}
                          size="sm"
                          className="mr-3"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white font-montserrat">
                            {blog.author.personal_info.fullname}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-montserrat">
                            @{blog.author.personal_info.username}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400 font-montserrat">
                        <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                          <Eye className="h-3.5 w-3.5 mr-1.5 text-violet-500 dark:text-violet-400" />
                          <span>{blog.activity?.total_reads || 0} reads</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1.5" />
                          <span>
                            {format(new Date(blog.publishedAt), "MMM d, yyyy")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row sm:flex-col gap-2 mt-4 sm:mt-0 sm:ml-4">
                      <Button
                        variant={blog.featured ? "secondary" : "primary"}
                        size="sm"
                        onClick={() => setFeaturingBlog(blog)}
                        glossy={true}
                        shadowDepth="shallow"
                        icon={<Star className="h-4 w-4" />}
                        iconPosition="left"
                      >
                        {blog.featured ? "Unfeature" : "Feature"}
                      </Button>

                      <Button
                        variant="white"
                        size="sm"
                        href={`/blog/${blog.blog_id}`}
                        target="_blank"
                        shadowDepth="shallow"
                        icon={<ExternalLink className="h-4 w-4" />}
                        iconPosition="left"
                      >
                        View
                      </Button>

                      <Button
                        variant="white"
                        size="sm"
                        href={`/editor/${blog.blog_id}`}
                        shadowDepth="shallow"
                        icon={<Edit className="h-4 w-4" />}
                        iconPosition="left"
                      >
                        Edit
                      </Button>

                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setConfirmDeleteId(blog.blog_id)}
                        shadowDepth="shallow"
                        icon={<Trash2 className="h-4 w-4" />}
                        iconPosition="left"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <EmptyState
              title="No blogs found"
              description="No blogs matching your filters were found."
              icon={<AlertCircle className="h-16 w-16 text-gray-400" />}
              actionText="Reset Filters"
              actionClick={resetFilters}
              className="bg-white dark:bg-gray-800 rounded-xl p-10 border border-gray-100 dark:border-gray-700 shadow-sm"
            />
          )}
        </div>

        {/* Pagination  */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <nav className="flex items-center space-x-4">
              <Button
                variant="white"
                size="md"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1 || loading}
                shadowDepth="shallow"
                icon={<ChevronLeft className="h-4 w-4" />}
                iconPosition="left"
              >
                Previous
              </Button>

              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 font-montserrat bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
                Page {page} of {totalPages}
              </div>

              <Button
                variant="white"
                size="md"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages || loading}
                shadowDepth="shallow"
                icon={<ChevronRight className="h-4 w-4" />}
                iconPosition="right"
              >
                Next
              </Button>
            </nav>
          </div>
        )}
      </motion.div>

      {/* Delete Confirmation Modal  */}
      <Modal
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        title="Confirm Delete"
        size="sm"
      >
        <div className="space-y-4">
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mb-4">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="font-playfair text-xl font-medium text-gray-900 dark:text-white">
              Delete Blog?
            </h3>
          </div>

          <p className="font-montserrat text-gray-700 dark:text-gray-300 text-center">
            This action cannot be undone. Are you sure you want to permanently
            delete this blog?
          </p>

          <div className="flex justify-center gap-3 pt-2">
            <Button
              variant="white"
              onClick={() => setConfirmDeleteId(null)}
              disabled={deleting}
              shadowDepth="shallow"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => handleDeleteBlog(confirmDeleteId)}
              disabled={deleting}
              isLoading={deleting}
              shadowDepth="shallow"
              glossy={true}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Feature Confirmation Modal  */}
      <Modal
        isOpen={!!featuringBlog}
        onClose={() => setFeaturingBlog(null)}
        title={
          featuringBlog?.featured ? "Remove from Featured" : "Add to Featured"
        }
        size="sm"
      >
        <div className="space-y-4">
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 mb-4">
              <Star className="h-6 w-6" />
            </div>
            <h3 className="font-playfair text-xl font-medium text-gray-900 dark:text-white">
              {featuringBlog?.featured ? "Unfeature Blog?" : "Feature Blog?"}
            </h3>
          </div>

          <p className="font-montserrat text-gray-700 dark:text-gray-300 text-center">
            {featuringBlog?.featured
              ? "This blog will no longer be highlighted on the homepage."
              : "Featured blogs appear prominently on the homepage and receive more visibility."}
          </p>

          <div className="flex justify-center gap-3 pt-2">
            <Button
              variant="white"
              onClick={() => setFeaturingBlog(null)}
              disabled={featuring}
              shadowDepth="shallow"
            >
              Cancel
            </Button>
            <Button
              variant={featuringBlog?.featured ? "secondary" : "primary"}
              onClick={() => handleToggleFeature(featuringBlog)}
              disabled={featuring}
              isLoading={featuring}
              shadowDepth="shallow"
              glossy={true}
            >
              {featuringBlog?.featured ? "Unfeature" : "Feature"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminBlogsPage;
