import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  FileText,
  Edit,
  Bell,
  UserPlus,
  Trash2,
  Eye,
  MessageSquare,
  Heart,
  ExternalLink,
  Users,
  CalendarDays,
  Clock,
  ChevronRight,
  ArrowUpRight,
  CheckCircle,
  XCircle,
  ClockIcon,
  BarChart3,
  BookOpen,
  Star,
  PenLine,
  Plus,
  Search,
  Filter,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import { blogService } from "../../services/blogService";
import { userService } from "../../services/userService";
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

  const isCreator =
    currentUser?.role === "blogger" || currentUser?.role === "admin";

  function getInitialTab() {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");

    const validTabs = isCreator
      ? ["published", "drafts", "notifications"]
      : ["notifications", "blogger-application"];

    return validTabs.includes(tab) ? tab : validTabs[0];
  }

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

  const updateUrl = (tab) => {
    navigate(`/dashboard?tab=${tab}`, { replace: true });
  };

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

  // Define tabs based on user role
  const getTabsContent = () => {
    const tabs = [];

    // Only add Published and Drafts tabs for creators (bloggers/admins)
    if (isCreator) {
      tabs.push({
        label: "Published",
        id: "published",
        icon: <FileText className="h-5 w-5 mr-2" />,
        content: (
          <div className="space-y-6">
            {/* Premium Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h2 className="font-playfair text-2xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">
                  Published Blogs
                </h2>
                <p className="text-gray-600 dark:text-gray-400 font-montserrat">
                  Manage your published content and track performance
                </p>
              </div>
              {isCreator && (
                <Button
                  variant="primary"
                  href="/editor"
                  glossy={true}
                  shadowDepth="deep"
                  size="md"
                  icon={<Edit className="h-4 w-4" />}
                  iconPosition="left"
                  className="min-w-[140px]"
                >
                  New Blog
                </Button>
              )}
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-2 mb-6">
              <div className="relative flex items-center">
                <span className="absolute left-3 text-gray-400">
                  <Search className="h-5 w-5" />
                </span>
                <input
                  type="text"
                  placeholder="Search your blogs by title or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border-0 ring-0 focus:ring-0 focus:outline-none bg-transparent text-gray-700 dark:text-gray-300 placeholder-gray-400 font-montserrat"
                />
                {searchQuery && (
                  <button
                    className="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    onClick={() => setSearchQuery("")}
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            {loadingPublished && publishedBlogs.length === 0 ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700"
                  >
                    <div className="p-5">
                      <div className="animate-pulse flex flex-col sm:flex-row gap-4">
                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                        <div className="flex-1 space-y-3">
                          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                          <div className="flex gap-3">
                            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                          </div>
                        </div>
                        <div className="flex flex-row sm:flex-col gap-2 sm:w-24">
                          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : publishedBlogs.length > 0 ? (
              <div className="space-y-4">
                {publishedBlogs.map((blog, index) => (
                  <motion.div
                    key={blog.blog_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200 hover:border-primary-200 dark:hover:border-primary-800">
                      <div className="p-5">
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                          <div className="flex gap-4">
                            <div className="hidden sm:block">
                              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900 dark:to-indigo-900 flex items-center justify-center">
                                <FileText className="h-8 w-8 text-violet-600 dark:text-violet-400" />
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="font-playfair text-lg font-bold text-gray-900 dark:text-white hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200 truncate">
                                  {blog.title}
                                </h3>
                                {index < 2 && (
                                  <Badge
                                    variant="success"
                                    className="text-xs px-2 py-0.5"
                                  >
                                    New
                                  </Badge>
                                )}
                              </div>

                              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-3 mt-1 font-montserrat">
                                <div className="flex items-center">
                                  <CalendarDays className="h-3.5 w-3.5 mr-1" />
                                  <span>{formatDate(blog.publishedAt)}</span>
                                </div>
                                {blog.category && (
                                  <Badge
                                    variant="secondary"
                                    className="px-2 py-0.5 text-xs"
                                  >
                                    {blog.category}
                                  </Badge>
                                )}
                              </div>

                              {blog.des && (
                                <p className="font-montserrat text-gray-600 dark:text-gray-300 text-sm mt-2 line-clamp-2">
                                  {blog.des}
                                </p>
                              )}

                              <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
                                <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                                  <Eye className="h-3.5 w-3.5 mr-1.5 text-violet-500 dark:text-violet-400" />
                                  <span>{blog.activity?.total_reads || 0}</span>
                                </div>
                                <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                                  <Heart className="h-3.5 w-3.5 mr-1.5 text-red-500" />
                                  <span>{blog.activity?.total_likes || 0}</span>
                                </div>
                                <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                                  <MessageSquare className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                                  <span>
                                    {blog.activity?.total_comments || 0}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex sm:flex-col gap-2 sm:min-w-[120px]">
                            <Button
                              variant="white"
                              size="sm"
                              href={`/blog/${blog.blog_id}`}
                              icon={<Eye className="h-4 w-4" />}
                              iconPosition="left"
                              shadowDepth="shallow"
                              className="flex-1 sm:flex-none"
                            >
                              View
                            </Button>
                            <Button
                              variant="white"
                              size="sm"
                              href={`/editor/${blog.blog_id}`}
                              icon={<Edit className="h-4 w-4" />}
                              iconPosition="left"
                              shadowDepth="shallow"
                              className="flex-1 sm:flex-none"
                            >
                              Edit
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => setConfirmDeleteId(blog.blog_id)}
                              icon={<Trash2 className="h-4 w-4" />}
                              iconPosition="left"
                              shadowDepth="shallow"
                              className="flex-1 sm:flex-none"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {hasMorePublished && (
                  <div className="flex justify-center mt-8">
                    <Button
                      variant="white"
                      onClick={() =>
                        fetchPublishedBlogs(publishedPage + 1, searchQuery)
                      }
                      disabled={loadingPublished}
                      isLoading={loadingPublished}
                      glossy={true}
                      shadowDepth="shallow"
                      className="min-w-[160px]"
                    >
                      Load More
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 mb-4">
                  <FileText className="h-8 w-8" />
                </div>
                <h3 className="font-playfair text-xl font-bold text-gray-900 dark:text-white mb-2">
                  No published blogs yet
                </h3>
                <p className="font-montserrat text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                  You haven't published any blogs yet. Start writing your first
                  blog post and share your ideas with the world!
                </p>
                <Button
                  variant="primary"
                  href="/editor"
                  glossy={true}
                  shadowDepth="deep"
                  icon={<Edit className="h-4 w-4" />}
                  iconPosition="left"
                >
                  Write New Blog
                </Button>
              </div>
            )}
          </div>
        ),
      });

      tabs.push({
        label: "Drafts",
        id: "drafts",
        icon: <Edit className="h-5 w-5 mr-2" />,
        content: (
          <div className="space-y-6">
            {/* Premium Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h2 className="font-playfair text-2xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">
                  Draft Blogs
                </h2>
                <p className="text-gray-600 dark:text-gray-400 font-montserrat">
                  Continue working on your unfinished writings
                </p>
              </div>
              {isCreator && (
                <Button
                  variant="primary"
                  href="/editor"
                  glossy={true}
                  shadowDepth="deep"
                  size="md"
                  icon={<Edit className="h-4 w-4" />}
                  iconPosition="left"
                  className="min-w-[140px]"
                >
                  New Blog
                </Button>
              )}
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-2 mb-6">
              <div className="relative flex items-center">
                <span className="absolute left-3 text-gray-400">
                  <Search className="h-5 w-5" />
                </span>
                <input
                  type="text"
                  placeholder="Search your drafts by title or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border-0 ring-0 focus:ring-0 focus:outline-none bg-transparent text-gray-700 dark:text-gray-300 placeholder-gray-400 font-montserrat"
                />
                {searchQuery && (
                  <button
                    className="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    onClick={() => setSearchQuery("")}
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            {loadingDrafts && draftBlogs.length === 0 ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700"
                  >
                    <div className="p-5">
                      <div className="animate-pulse flex flex-col sm:flex-row gap-4">
                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                        <div className="flex-1 space-y-3">
                          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        </div>
                        <div className="flex flex-row sm:flex-col gap-2 sm:w-24">
                          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : draftBlogs.length > 0 ? (
              <div className="space-y-4">
                {draftBlogs.map((blog, index) => (
                  <motion.div
                    key={blog.blog_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200 hover:border-primary-200 dark:hover:border-primary-800">
                      <div className="p-5">
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                          <div className="flex gap-4">
                            <div className="hidden sm:block">
                              <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                <PenLine className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="font-playfair text-lg font-bold text-gray-900 dark:text-white hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200 truncate">
                                  {blog.title || "Untitled Draft"}
                                </h3>
                                <Badge
                                  variant="secondary"
                                  className="text-xs px-2 py-0.5"
                                >
                                  Draft
                                </Badge>
                              </div>

                              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-3 mt-1 font-montserrat">
                                <div className="flex items-center">
                                  <Clock className="h-3.5 w-3.5 mr-1" />
                                  <span>
                                    Last updated {formatDate(blog.publishedAt)}
                                  </span>
                                </div>
                              </div>

                              {blog.des && (
                                <p className="font-montserrat text-gray-600 dark:text-gray-300 text-sm mt-2 line-clamp-2">
                                  {blog.des}
                                </p>
                              )}

                              <div className="flex items-center gap-2 mt-3">
                                <div className="h-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full w-full">
                                  <div
                                    className="h-2 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full"
                                    style={{
                                      width: `${Math.min(
                                        Math.max(
                                          (blog.title ? 20 : 0) +
                                            (blog.des ? 30 : 0) +
                                            (blog.content &&
                                            blog.content.length > 200
                                              ? 50
                                              : blog.content
                                              ? 20
                                              : 0),
                                          5
                                        ),
                                        100
                                      )}%`,
                                    }}
                                  ></div>
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400 font-montserrat">
                                  {Math.min(
                                    Math.max(
                                      (blog.title ? 20 : 0) +
                                        (blog.des ? 30 : 0) +
                                        (blog.content &&
                                        blog.content.length > 200
                                          ? 50
                                          : blog.content
                                          ? 20
                                          : 0),
                                      5
                                    ),
                                    100
                                  )}
                                  % complete
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex sm:flex-col gap-2 sm:min-w-[160px]">
                            <Button
                              variant="primary"
                              size="sm"
                              href={`/editor/${blog.blog_id}`}
                              icon={<Edit className="h-4 w-4" />}
                              iconPosition="left"
                              glossy={true}
                              shadowDepth="shallow"
                              className="flex-1 sm:flex-none"
                            >
                              Continue Editing
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => setConfirmDeleteId(blog.blog_id)}
                              icon={<Trash2 className="h-4 w-4" />}
                              iconPosition="left"
                              shadowDepth="shallow"
                              className="flex-1 sm:flex-none"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {hasMoreDrafts && (
                  <div className="flex justify-center mt-8">
                    <Button
                      variant="white"
                      onClick={() =>
                        fetchDraftBlogs(draftPage + 1, searchQuery)
                      }
                      disabled={loadingDrafts}
                      isLoading={loadingDrafts}
                      glossy={true}
                      shadowDepth="shallow"
                      className="min-w-[160px]"
                    >
                      Load More
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 mb-4">
                  <Edit className="h-8 w-8" />
                </div>
                <h3 className="font-playfair text-xl font-bold text-gray-900 dark:text-white mb-2">
                  No draft blogs
                </h3>
                <p className="font-montserrat text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                  You don't have any drafts. Start writing a new blog post and
                  save it as a draft to continue later.
                </p>
                {isCreator && (
                  <Button
                    variant="primary"
                    href="/editor"
                    glossy={true}
                    shadowDepth="deep"
                    icon={<Edit className="h-4 w-4" />}
                    iconPosition="left"
                  >
                    Write New Blog
                  </Button>
                )}
              </div>
            )}
          </div>
        ),
      });
    }

    // Notifications tab for all users
    tabs.push({
      label: "Notifications",
      id: "notifications",
      icon: <Bell className="h-5 w-5 mr-2" />,
      content: (
        <div className="space-y-6">
          {/* Premium Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="font-playfair text-2xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">
                Notifications
              </h2>
              <p className="text-gray-600 dark:text-gray-400 font-montserrat">
                Stay updated with activity on your content
              </p>
            </div>
            <Button
              variant="white"
              onClick={markAllAsRead}
              size="md"
              shadowDepth="shallow"
              icon={<CheckCircle className="h-4 w-4" />}
              iconPosition="left"
            >
              Mark All as Read
            </Button>
          </div>

          {notificationsLoading && notifications.length === 0 ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700"
                >
                  <div className="p-5">
                    <div className="animate-pulse flex items-start space-x-4">
                      <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      </div>
                      <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <div
                    className={`bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md ${
                      !notification.seen
                        ? "border-l-4 border-violet-500 dark:border-violet-500 border-y border-r border-gray-100 dark:border-gray-700"
                        : "border border-gray-100 dark:border-gray-700"
                    }`}
                  >
                    <div className="p-5">
                      <div className="flex items-start">
                        <Avatar
                          src={notification.user?.personal_info.profile_img}
                          alt={notification.user?.personal_info.fullname}
                          size="md"
                          onClick={() =>
                            navigate(
                              `/profile/${notification.user?.personal_info.username}`
                            )
                          }
                          className="cursor-pointer mr-4 flex-shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                            <div>
                              <span
                                className="font-montserrat font-medium text-gray-900 dark:text-white cursor-pointer hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                                onClick={() =>
                                  navigate(
                                    `/profile/${notification.user?.personal_info.username}`
                                  )
                                }
                              >
                                {notification.user?.personal_info.fullname}
                              </span>
                              <span className="font-montserrat text-gray-700 dark:text-gray-300 ml-1.5">
                                {renderNotificationContent(notification)}
                              </span>
                            </div>

                            <p className="text-xs text-gray-500 dark:text-gray-400 font-montserrat mt-1 sm:mt-0">
                              {format(
                                new Date(notification.createdAt),
                                "MMM d, yyyy • h:mm a"
                              )}
                            </p>
                          </div>

                          {notification.comment && (
                            <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                              <p className="text-sm text-gray-600 dark:text-gray-400 font-montserrat italic">
                                "{notification.comment.comment}"
                              </p>
                            </div>
                          )}

                          <div className="flex justify-between items-center mt-3">
                            {notification.blog && (
                              <Button
                                variant="white"
                                size="xs"
                                href={`/blog/${notification.blog.blog_id}`}
                                icon={<ArrowUpRight className="h-3.5 w-3.5" />}
                                iconPosition="right"
                                shadowDepth="shallow"
                                className="text-violet-600 dark:text-violet-400"
                              >
                                View Blog
                              </Button>
                            )}

                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={() =>
                                deleteNotification(notification._id)
                              }
                              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                              icon={<Trash2 className="h-3.5 w-3.5" />}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {hasMoreNotifications && (
                <div className="flex justify-center mt-8">
                  <Button
                    variant="white"
                    onClick={handleLoadMoreNotifications}
                    disabled={notificationsLoading}
                    isLoading={notificationsLoading}
                    glossy={true}
                    shadowDepth="shallow"
                    className="min-w-[160px]"
                  >
                    Load More
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 mb-4">
                <Bell className="h-8 w-8" />
              </div>
              <h3 className="font-playfair text-xl font-bold text-gray-900 dark:text-white mb-2">
                No notifications
              </h3>
              <p className="font-montserrat text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                You don't have any notifications yet. When someone interacts
                with your content, you'll see it here.
              </p>
            </div>
          )}
        </div>
      ),
    });

    // Blogger Application tab (only for non-creators)
    if (!isCreator) {
      tabs.push({
        label: "Blogger Application",
        id: "blogger-application",
        icon: <UserPlus className="h-5 w-5 mr-2" />,
        content: (
          <div className="space-y-6">
            {/* Premium Header */}
            <div className="mb-8">
              <h2 className="font-playfair text-2xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">
                Blogger Application
              </h2>
              <p className="text-gray-600 dark:text-gray-400 font-montserrat">
                Join our community of content creators and share your knowledge
              </p>
            </div>

            {loadingBloggerStatus ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <div className="animate-pulse">
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full mb-6"></div>
                  </div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-6"></div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-40 mx-auto"></div>
                </div>
              </div>
            ) : currentUser?.role === "blogger" ||
              currentUser?.role === "admin" ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700">
                <div className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 text-green-600 dark:text-green-400 mb-6">
                    <CheckCircle className="h-10 w-10" />
                  </div>
                  <h3 className="font-playfair text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    You Are a Blogger
                  </h3>
                  <p className="font-montserrat text-gray-600 dark:text-gray-400 max-w-lg mx-auto mb-8">
                    Congratulations! You have full blogger privileges and can
                    publish content on the platform. Your expertise and unique
                    perspective are valuable to our community.
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button
                      variant="primary"
                      href="/editor"
                      glossy={true}
                      shadowDepth="deep"
                      icon={<Edit className="h-4 w-4" />}
                      iconPosition="left"
                    >
                      Start Writing
                    </Button>
                    <Button
                      variant="white"
                      href="/bloggers-guide"
                      icon={<BookOpen className="h-4 w-4" />}
                      iconPosition="left"
                      shadowDepth="shallow"
                    >
                      Blogger's Guide
                    </Button>
                  </div>
                </div>
              </div>
            ) : bloggerStatus?.has_applied ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700">
                <div className="p-8 text-center">
                  {bloggerStatus.status === "pending" ? (
                    <>
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/40 dark:to-yellow-800/40 text-yellow-600 dark:text-yellow-400 mb-6">
                        <ClockIcon className="h-10 w-10" />
                      </div>
                      <h3 className="font-playfair text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        Application Under Review
                      </h3>
                      <p className="font-montserrat text-gray-600 dark:text-gray-400 max-w-lg mx-auto mb-4">
                        Your application to become a blogger is currently under
                        review by our team. We carefully evaluate each
                        application to ensure quality content for our readers.
                      </p>
                      <div className="flex items-center justify-center mb-8">
                        <p className="px-4 py-2 bg-gray-100 dark:bg-gray-900/50 rounded-full text-sm text-gray-700 dark:text-gray-300 font-montserrat">
                          Submitted on {formatDate(bloggerStatus.created_at)}
                        </p>
                      </div>
                      <div className="max-w-md mx-auto bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                        <p className="text-sm text-blue-700 dark:text-blue-300 font-montserrat">
                          We'll notify you once a decision has been made. Thank
                          you for your patience!
                        </p>
                      </div>
                    </>
                  ) : bloggerStatus.status === "approved" ? (
                    <>
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 text-green-600 dark:text-green-400 mb-6">
                        <CheckCircle className="h-10 w-10" />
                      </div>
                      <h3 className="font-playfair text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        Application Approved!
                      </h3>
                      <p className="font-montserrat text-gray-600 dark:text-gray-400 max-w-lg mx-auto mb-8">
                        Congratulations! Your application to become a blogger
                        has been approved. You can now create and publish
                        content on our platform.
                      </p>
                      <div className="flex justify-center">
                        <Button
                          variant="primary"
                          onClick={() => window.location.reload()}
                          glossy={true}
                          shadowDepth="deep"
                          size="lg"
                        >
                          Refresh to Access Your Dashboard
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40 text-red-600 dark:text-red-400 mb-6">
                        <XCircle className="h-10 w-10" />
                      </div>
                      <h3 className="font-playfair text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        Application Not Approved
                      </h3>
                      <p className="font-montserrat text-gray-600 dark:text-gray-400 max-w-lg mx-auto mb-6">
                        We're sorry, but your application to become a blogger
                        was not approved at this time. This doesn't mean you
                        can't apply again with additional information or
                        improved samples.
                      </p>

                      {bloggerStatus.review_notes && (
                        <div className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-lg mb-8 max-w-lg mx-auto">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-montserrat">
                            Reviewer Feedback:
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 font-montserrat italic">
                            "{bloggerStatus.review_notes}"
                          </p>
                        </div>
                      )}

                      <div className="flex justify-center">
                        <Button
                          variant="primary"
                          onClick={() => setBloggerStatus(null)}
                          glossy={true}
                          shadowDepth="deep"
                          size="lg"
                        >
                          Apply Again
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <BloggerApplicationForm onSubmit={handleBloggerApplication} />
            )}
          </div>
        ),
      });
    }

    return tabs;
  };

  const tabsContent = getTabsContent();

  // Fetch data based on active tab
  useEffect(() => {
    if (!currentUser) return;

    if (activeTab === "published" && isCreator) {
      fetchPublishedBlogs(1, searchQuery);
    } else if (activeTab === "drafts" && isCreator) {
      fetchDraftBlogs(1, searchQuery);
    } else if (activeTab === "notifications") {
      fetchNotifications(1, "all", 10);
      setHasMoreNotifications(totalNotifications > 10);
    } else if (activeTab === "blogger-application" && !isCreator) {
      fetchBloggerStatus();
    }

    // Update URL
    updateUrl(activeTab);
  }, [activeTab, currentUser, searchQuery, isCreator]);

  // Get currently active tab index
  const getActiveTabIndex = () => {
    const tabIds = tabsContent.map((tab) => tab.id);
    return tabIds.indexOf(activeTab);
  };

  return (
    <div className="mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Dashboard Header - Updated with home page styling */}
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
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-6 md:mb-0 max-w-3xl">
                  <motion.h1
                    className="font-playfair text-4xl md:text-5xl font-bold mb-4 tracking-tight leading-tight text-center md:text-left"
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
                    className="font-montserrat text-lg mb-6 leading-relaxed italic text-gray-700 dark:text-gray-300 text-center md:text-left"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    {isCreator
                      ? `Welcome back, ${
                          currentUser?.personal_info?.fullname || "Author"
                        }! Your space to manage content and connect with readers.`
                      : "Your space for timeless content. Discover high-quality articles, share your thoughts, and connect with a community of passionate writers."}
                  </motion.p>
                </div>

                {/* Only show "Create New Content" button for creators */}
                {isCreator && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <Button
                      variant="white"
                      size="lg"
                      href="/editor"
                      icon={<Plus className="h-4 w-4" />}
                      iconPosition="left"
                      glossy={true}
                      shadowDepth="deep"
                      className="text-violet-600"
                    >
                      Create New Content
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs - Premium Style */}
        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700">
          {/* Custom tabs navigation - Enhanced */}
          <div className="flex flex-wrap overflow-x-auto scrollbar-hide border-b border-gray-200 dark:border-gray-700 px-4">
            {tabsContent.map((tab, index) => (
              <button
                key={tab.id}
                className={`flex items-center px-5 py-4 font-medium text-sm transition-all duration-200 relative ${
                  activeTab === tab.id
                    ? "text-violet-600 dark:text-violet-400"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                <span className="font-montserrat">{tab.label}</span>

                {/* Active Indicator */}
                {activeTab === tab.id && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 dark:bg-violet-400"
                    layoutId="activeTabIndicator"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-6">
            {tabsContent.find((tab) => tab.id === activeTab)?.content}
          </div>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal - Premium Style */}
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
    </div>
  );
};

// Blogger Application Form Component - Premium Style
const BloggerApplicationForm = ({ onSubmit }) => {
  const [reason, setReason] = useState("");
  const [samples, setSamples] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formStep, setFormStep] = useState(1);
  const [formProgress, setFormProgress] = useState(0);

  useEffect(() => {
    // Calculate form progress
    let progress = 0;

    // Step 1: Reason (70% weight)
    if (reason.trim().length >= 10) {
      const reasonScore = Math.min(reason.trim().length / 200, 1) * 70;
      progress += reasonScore;
    }

    // Step 2: Samples (30% weight)
    if (samples.trim().length > 0) {
      const samplesScore = Math.min(samples.trim().length / 100, 1) * 30;
      progress += samplesScore;
    }

    setFormProgress(Math.min(Math.round(progress), 100));
  }, [reason, samples]);

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
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700">
      <div className="relative overflow-hidden">
        {/* Header with Progress */}
        <div className="p-6 pb-5">
          {/* Progress Bar */}
          <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
            <div
              className="h-1 bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500"
              style={{ width: `${formProgress}%` }}
            ></div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-violet-100 dark:bg-violet-900/30 p-2 rounded-full mr-3">
                <UserPlus className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="font-playfair text-xl font-bold text-gray-900 dark:text-white">
                Become a Blogger
              </h3>
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {formProgress}% complete
            </span>
          </div>
        </div>

        {/* Application Form */}
        <div className="px-6 pb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-700 dark:text-blue-300 font-montserrat">
              Share your expertise with our community! We're looking for
              passionate writers who can create valuable content. Tell us about
              yourself and your writing experience.
            </p>
          </div>

          {error && (
            <Alert variant="danger" className="mb-4">
              <p className="text-sm">{error}</p>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Reason for Application */}
            <div>
              <label
                htmlFor="reason"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-montserrat"
              >
                Why do you want to become a blogger?{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                id="reason"
                rows={6}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Share your motivation, experience, areas of expertise, and what topics you'd like to write about..."
                className={`w-full px-4 py-3 rounded-lg border ${
                  reason.trim().length < 10 && reason.trim().length > 0
                    ? "border-red-300 dark:border-red-700"
                    : "border-gray-300 dark:border-gray-700"
                } bg-white dark:bg-black text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500 font-montserrat text-sm`}
                required
              />
              <div className="flex justify-between mt-1.5 text-xs">
                <p
                  className={`${
                    reason.trim().length < 10
                      ? "text-red-500"
                      : "text-gray-500 dark:text-gray-400"
                  } font-montserrat`}
                >
                  Minimum 10 characters required.{" "}
                  {reason.trim().length < 10 && reason.trim().length > 0
                    ? `(${10 - reason.trim().length} more needed)`
                    : ""}
                </p>
                <p className="text-gray-500 dark:text-gray-400 font-montserrat">
                  {reason.length}/1000
                </p>
              </div>
            </div>

            {/* Step 2: Writing Samples */}
            <div>
              <label
                htmlFor="samples"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-montserrat"
              >
                Writing Samples (Optional)
              </label>
              <textarea
                id="samples"
                rows={4}
                value={samples}
                onChange={(e) => setSamples(e.target.value)}
                placeholder="Provide links to your previous writing work or portfolio..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500 font-montserrat text-sm"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 font-montserrat">
                Include URLs to published work, personal blog, or other writing
                samples that showcase your style and expertise.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                variant="primary"
                disabled={
                  submitting || !reason.trim() || reason.trim().length < 10
                }
                isLoading={submitting}
                glossy={true}
                shadowDepth="deep"
                size="lg"
              >
                Submit Application
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
