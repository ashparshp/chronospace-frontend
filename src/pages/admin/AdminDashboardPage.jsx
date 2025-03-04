// src/pages/admin/AdminDashboardPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  FileText,
  ClipboardCheck,
  TrendingUp,
  BarChart2,
  UserPlus,
  Clock,
  Eye,
  MessageSquare,
  Heart,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { adminService } from "../../services/adminService";
import { format } from "date-fns";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Avatar from "../../components/ui/Avatar";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const response = await adminService.getDashboardStats();
        setStats(response.data);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setError("Failed to load dashboard data");
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
    return (
      <div className=" mx-auto space-y-8 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 h-32"
            ></div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 h-72"></div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 h-72"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <EmptyState
        title="Error"
        description={error}
        actionText="Try Again"
        actionClick={() => window.location.reload()}
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
    <div className=" mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>

          <div className="flex space-x-2">
            <Button variant="outline" href="/admin/users" size="sm">
              <Users className="h-4 w-4 mr-1" />
              Manage Users
            </Button>

            <Button variant="outline" href="/admin/blogs" size="sm">
              <FileText className="h-4 w-4 mr-1" />
              Manage Blogs
            </Button>

            <Button variant="primary" href="/admin/applications" size="sm">
              <ClipboardCheck className="h-4 w-4 mr-1" />
              Blogger Applications
              {stats?.applications?.pending > 0 && (
                <span className="ml-1 bg-white text-primary-600 rounded-full text-xs px-1.5 py-0.5">
                  {stats.applications.pending}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Users Stats */}
          <Card className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  Total Users
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats?.users?.total.toLocaleString()}
                </h3>

                {stats?.users?.new_30d > 0 && (
                  <div className="flex items-center mt-2 text-green-600 dark:text-green-400 text-sm">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>{stats.users.new_30d} new in 30 days</span>
                  </div>
                )}
              </div>
              <div className="bg-blue-100 dark:bg-indigo-900/30 p-3 rounded-lg">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>

            <div className="mt-4 flex justify-between text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Bloggers</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {stats?.users?.bloggers.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Active</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {stats?.users?.active.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          {/* Blogs Stats */}
          <Card className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  Total Blogs
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats?.blogs?.total.toLocaleString()}
                </h3>

                {stats?.blogs?.new_30d > 0 && (
                  <div className="flex items-center mt-2 text-green-600 dark:text-green-400 text-sm">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>{stats.blogs.new_30d} new in 30 days</span>
                  </div>
                )}
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>

            <div className="mt-4 flex justify-between text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Published</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {stats?.blogs?.published.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Drafts</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {stats?.blogs?.drafts.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          {/* Comments Stats */}
          <Card className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  Total Comments
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats?.comments?.total.toLocaleString()}
                </h3>

                {stats?.comments?.new_30d > 0 && (
                  <div className="flex items-center mt-2 text-green-600 dark:text-green-400 text-sm">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>{stats.comments.new_30d} new in 30 days</span>
                  </div>
                )}
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                <MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center">
              <Button
                variant="outline"
                size="sm"
                href="/admin/blogs"
                className="w-full"
              >
                Manage Content
              </Button>
            </div>
          </Card>

          {/* Applications Stats */}
          <Card className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  Pending Applications
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats?.applications?.pending.toLocaleString()}
                </h3>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg">
                <ClipboardCheck className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center">
              <Button
                variant={
                  stats?.applications?.pending > 0 ? "primary" : "outline"
                }
                size="sm"
                href="/admin/applications"
                className="w-full"
              >
                Review Applications
                {stats?.applications?.pending > 0 && (
                  <span className="ml-1 bg-white text-primary-600 rounded-full text-xs px-1.5 py-0.5">
                    {stats.applications.pending}
                  </span>
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/* Charts & Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Popular Blogs */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Popular Blogs
              </h2>
              <Button variant="ghost" size="sm" href="/admin/blogs">
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {stats?.blogs?.popular?.length > 0 ? (
                stats.blogs.popular.map((blog, index) => (
                  <div
                    key={blog.blog_id}
                    className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                    onClick={() => navigate(`/blog/${blog.blog_id}`)}
                  >
                    <div className="flex-shrink-0 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 font-bold rounded-full w-8 h-8 flex items-center justify-center">
                      {index + 1}
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-1 line-clamp-1">
                        {blog.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        by {blog.author.personal_info.username} •{" "}
                        {format(new Date(blog.publishedAt), "MMM d, yyyy")}
                      </p>
                      <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400 space-x-3">
                        <div className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          <span>
                            {blog.activity.total_reads.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Heart className="h-3 w-3 mr-1" />
                          <span>
                            {blog.activity.total_likes.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          <span>
                            {blog.activity.total_comments.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  No popular blogs yet
                </div>
              )}
            </div>
          </Card>

          {/* Top Authors */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Top Authors
              </h2>
              <Button variant="ghost" size="sm" href="/admin/users">
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {stats?.top_authors?.length > 0 ? (
                stats.top_authors.map((author) => (
                  <div
                    key={author.personal_info.username}
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                    onClick={() =>
                      navigate(`/profile/${author.personal_info.username}`)
                    }
                  >
                    <Avatar
                      src={author.personal_info.profile_img}
                      alt={author.personal_info.fullname}
                      size="md"
                      className="mr-3"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                        {author.personal_info.fullname}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        @{author.personal_info.username}
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0 text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {author.account_info.total_posts} posts
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {author.account_info.total_reads.toLocaleString()} reads
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  No top authors yet
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            variant="outline"
            href="/admin/users"
            className="flex flex-col items-center p-6 h-24"
          >
            <Users className="h-6 w-6 mb-2" />
            <span>Manage Users</span>
          </Button>

          <Button
            variant="outline"
            href="/admin/blogs"
            className="flex flex-col items-center p-6 h-24"
          >
            <FileText className="h-6 w-6 mb-2" />
            <span>Manage Blogs</span>
          </Button>

          <Button
            variant="outline"
            href="/admin/applications"
            className="flex flex-col items-center p-6 h-24"
          >
            <UserPlus className="h-6 w-6 mb-2" />
            <span>Review Applications</span>
          </Button>

          <Button
            variant="outline"
            href="/editor"
            className="flex flex-col items-center p-6 h-24"
          >
            <svg
              className="h-6 w-6 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <span>Write Blog</span>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboardPage;
