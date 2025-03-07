// src/pages/admin/AdminBlogsPage.jsx
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
    <div className=" mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/admin")}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Button>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Manage Blogs
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {totalBlogs} blogs found
              </p>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-1" />
              Filters
            </Button>

            <Button variant="primary" size="sm" href="/editor">
              <Edit className="h-4 w-4 mr-1" />
              Create Blog
            </Button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card className="p-4">
            <form
              onSubmit={handleSearchSubmit}
              className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
              <Input
                placeholder="Search blogs..."
                value={filters.query}
                onChange={(e) => handleFilterChange("query", e.target.value)}
                icon={<Search className="h-5 w-5 text-gray-400" />}
              />

              <Select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                options={[
                  { value: "all", label: "All Statuses" },
                  { value: BLOG_STATUS.PUBLISHED, label: "Published" },
                  { value: BLOG_STATUS.DRAFT, label: "Draft" },
                  { value: BLOG_STATUS.UNDER_REVIEW, label: "Under Review" },
                  { value: BLOG_STATUS.REJECTED, label: "Rejected" },
                  { value: BLOG_STATUS.ARCHIVED, label: "Archived" },
                ]}
              />

              <Input
                placeholder="Filter by author username"
                value={filters.author}
                onChange={(e) => handleFilterChange("author", e.target.value)}
              />

              <Select
                value={filters.featured}
                onChange={(e) => handleFilterChange("featured", e.target.value)}
                options={[
                  { value: "all", label: "All Blogs" },
                  { value: "true", label: "Featured" },
                  { value: "false", label: "Not Featured" },
                ]}
              />

              <div className="flex space-x-2 col-span-full justify-end">
                <Button variant="ghost" type="button" onClick={resetFilters}>
                  Reset
                </Button>
                <Button variant="primary" type="submit">
                  Apply Filters
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Blogs List */}
        <div className="space-y-4">
          {loading && blogs.length === 0 ? (
            // Loading skeleton
            Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse bg-white dark:bg-black rounded-lg shadow p-4"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="flex-1 space-y-2">
                    <div className="h-6 bg-gray-200 dark:bg-black rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-black rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-black rounded w-1/4"></div>
                  </div>
                  <div className="flex flex-row sm:flex-col gap-2 mt-3 sm:mt-0">
                    <div className="h-8 bg-gray-200 dark:bg-black rounded w-20"></div>
                    <div className="h-8 bg-gray-200 dark:bg-black rounded w-20"></div>
                  </div>
                </div>
              </div>
            ))
          ) : blogs.length > 0 ? (
            blogs.map((blog) => (
              <Card key={blog.blog_id} className="p-4">
                <div className="flex flex-col sm:flex-row justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                        {blog.title}
                      </h3>
                      {blog.featured && (
                        <Badge
                          variant="accent"
                          className="ml-2 bg-accent-500 text-white"
                        >
                          <Star className="h-3 w-3 mr-1" /> Featured
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      {getStatusBadge(blog.status)}
                      {getVisibilityBadge(blog.visibility)}
                      {blog.tags &&
                        blog.tags.map((tag, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                    </div>

                    <div className="flex items-center mt-2">
                      <Avatar
                        src={blog.author.personal_info.profile_img}
                        alt={blog.author.personal_info.fullname}
                        size="sm"
                        className="mr-2"
                      />
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {blog.author.personal_info.fullname}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          @{blog.author.personal_info.username}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        <span>{blog.activity.total_reads}</span>
                      </div>
                      <div>
                        Published:{" "}
                        {format(new Date(blog.publishedAt), "MMM d, yyyy")}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row sm:flex-col gap-2 mt-3 sm:mt-0 justify-end">
                    <Button
                      variant={blog.featured ? "secondary" : "primary"}
                      size="sm"
                      onClick={() => setFeaturingBlog(blog)}
                    >
                      <Star className="h-4 w-4 mr-1" />
                      {blog.featured ? "Unfeature" : "Feature"}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      href={`/blog/${blog.blog_id}`}
                      target="_blank"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
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
            ))
          ) : (
            <EmptyState
              title="No blogs found"
              description="No blogs matching your filters were found."
              icon={<AlertCircle className="h-12 w-12 text-gray-400" />}
              actionText="Reset Filters"
              actionClick={resetFilters}
            />
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <nav className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1 || loading}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="text-sm text-gray-700 dark:text-gray-300">
                Page {page} of {totalPages}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages || loading}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </nav>
          </div>
        )}
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

      {/* Feature Confirmation Modal */}
      <Modal
        isOpen={!!featuringBlog}
        onClose={() => setFeaturingBlog(null)}
        title={
          featuringBlog?.featured ? "Remove from Featured" : "Add to Featured"
        }
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            {featuringBlog?.featured
              ? "Are you sure you want to remove this blog from featured?"
              : "Are you sure you want to feature this blog? Featured blogs appear prominently on the homepage."}
          </p>
          <div className="flex justify-end space-x-2">
            <Button
              variant="ghost"
              onClick={() => setFeaturingBlog(null)}
              disabled={featuring}
            >
              Cancel
            </Button>
            <Button
              variant={featuringBlog?.featured ? "secondary" : "primary"}
              onClick={() => handleToggleFeature(featuringBlog)}
              disabled={featuring}
              isLoading={featuring}
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
