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
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import { blogService } from "../../services/blogService";
import { userService } from "../../services/userService";
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
              className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                  className="animate-pulse bg-white dark:bg-black rounded-lg shadow p-4"
                >
                  <div className="h-6 bg-gray-200 dark:bg-black rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-black rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-black rounded w-1/4"></div>
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
              className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                  className="animate-pulse bg-white dark:bg-black rounded-lg shadow p-4"
                >
                  <div className="h-6 bg-gray-200 dark:bg-black rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-black rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-black rounded w-1/4"></div>
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
                  className="animate-pulse bg-white dark:bg-black rounded-lg shadow p-4"
                >
                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 bg-gray-200 dark:bg-black rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-black rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-black rounded w-1/2"></div>
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
                        <div className="mt-2 p-2 bg-gray-50 dark:bg-black rounded-md">
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
            <div className="animate-pulse bg-white dark:bg-black rounded-lg shadow p-6">
              <div className="h-6 bg-gray-200 dark:bg-black rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-black rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-black rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-black rounded w-3/4 mb-4"></div>
              <div className="h-10 bg-gray-200 dark:bg-black rounded w-full"></div>
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
                    <div className="bg-gray-50 dark:bg-black p-4 rounded-md mb-6">
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
        <div className="bg-white dark:bg-black rounded-lg shadow-md p-6">
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
            } bg-white dark:bg-black text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500`}
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
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
