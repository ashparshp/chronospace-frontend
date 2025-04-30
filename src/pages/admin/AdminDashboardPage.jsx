import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  FileText,
  ClipboardCheck,
  TrendingUp,
  UserPlus,
  Eye,
  MessageSquare,
  Heart,
  Settings,
  BarChart3,
  PenLine,
  AlertCircle,
  Award,
  Star,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { adminService } from "../../services/adminService";
import { format } from "date-fns";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Avatar from "../../components/ui/Avatar";
import EmptyState from "../../components/ui/EmptyState";
import Badge from "../../components/ui/Badge";

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    users: { total: 0, bloggers: 0, active: 0, new_30d: 0 },
    blogs: { total: 0, published: 0, drafts: 0, new_30d: 0, popular: [] },
    comments: { total: 0, new_30d: 0 },
    applications: { pending: 0 },
    top_authors: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const isAdmin = currentUser && currentUser.role === "admin";

  if (!isAdmin) {
    return (
      <EmptyState
        title="Access Denied"
        description="You need administrator privileges to access this page."
        actionText="Go to Home"
        actionLink="/"
        icon={<AlertCircle className="h-16 w-16 text-red-500" />}
        className="bg-white dark:bg-gray-800 rounded-xl p-10 border border-gray-100 dark:border-gray-700 shadow-sm"
      />
    );
  }

  if (loading) {
    return (
      <div className="mx-auto space-y-8 animate-pulse">
        {/* Header skeleton */}
        <div className="rounded-2xl bg-gray-200 dark:bg-gray-800 h-40 mb-8"></div>
        
        {/* Stat cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 h-32 border border-gray-100 dark:border-gray-700"
            ></div>
          ))}
        </div>
        
        {/* Popular blogs and top authors skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 h-72 border border-gray-100 dark:border-gray-700"></div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 h-72 border border-gray-100 dark:border-gray-700"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        title="Error Loading Dashboard"
        description={error}
        actionText="Try Again"
        actionClick={() => window.location.reload()}
        icon={<AlertCircle className="h-16 w-16 text-red-500" />}
        className="bg-white dark:bg-gray-800 rounded-xl p-10 border border-gray-100 dark:border-gray-700 shadow-sm"
      />
    );
  }

  return (
    <div className="mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
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
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="mb-6 md:mb-0">
                  <motion.h1
                    className="font-playfair text-3xl md:text-4xl font-bold mb-2 tracking-tight leading-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">
                      Admin Dashboard
                    </span>
                  </motion.h1>
                  
                  <motion.p
                    className="font-montserrat text-lg leading-relaxed text-gray-700 dark:text-gray-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    Welcome back, {currentUser?.personal_info?.fullname || 'Admin'}. Here's an overview of your platform.
                  </motion.p>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="white"
                    href="/admin/users"
                    size="md"
                    icon={<Users className="h-4 w-4" />}
                    iconPosition="left"
                    shadowDepth="shallow"
                    glossy={true}
                  >
                    Manage Users
                  </Button>

                  <Button
                    variant="white"
                    href="/admin/blogs"
                    size="md"
                    icon={<FileText className="h-4 w-4" />}
                    iconPosition="left"
                    shadowDepth="shallow"
                    glossy={true}
                  >
                    Manage Blogs
                  </Button>

                  <Button
                    variant="primary"
                    href="/admin/applications"
                    size="md"
                    icon={<ClipboardCheck className="h-4 w-4" />}
                    iconPosition="left"
                    shadowDepth="deep"
                    glossy={true}
                  >
                    Blogger Applications
                    {stats?.applications?.pending > 0 && (
                      <span className="ml-1.5 bg-white text-primary-600 rounded-full text-xs px-1.5 py-0.5 font-bold">
                        {stats.applications.pending}
                      </span>
                    )}
                  </Button>
                </div>
              </div>
              
              {/* Admin Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-gray-200/20 dark:border-gray-700/20"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-700/70 dark:text-gray-300/70 text-sm font-montserrat">Total Users</p>
                      <h3 className="text-gray-900 dark:text-white font-playfair text-2xl font-bold">
                        {stats?.users?.total?.toLocaleString() || 0}
                      </h3>
                      {stats?.users?.new_30d > 0 && (
                        <div className="flex items-center mt-1 text-green-600 dark:text-green-400 text-xs font-montserrat">
                          <TrendingUp className="h-3.5 w-3.5 mr-1" />
                          <span>+{stats.users.new_30d} in 30 days</span>
                        </div>
                      )}
                    </div>
                    <div className="bg-violet-500/20 rounded-lg p-2.5">
                      <Users className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200/30 dark:border-gray-700/30 flex justify-between text-xs">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 font-montserrat">Bloggers</p>
                      <p className="font-medium text-gray-900 dark:text-white font-montserrat mt-0.5">
                        {stats?.users?.bloggers?.toLocaleString() || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 font-montserrat">Active Users</p>
                      <p className="font-medium text-gray-900 dark:text-white font-montserrat mt-0.5">
                        {stats?.users?.active?.toLocaleString() || 0}
                      </p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-gray-200/20 dark:border-gray-700/20"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-700/70 dark:text-gray-300/70 text-sm font-montserrat">Total Blogs</p>
                      <h3 className="text-gray-900 dark:text-white font-playfair text-2xl font-bold">
                        {stats?.blogs?.total?.toLocaleString() || 0}
                      </h3>
                      {stats?.blogs?.new_30d > 0 && (
                        <div className="flex items-center mt-1 text-green-600 dark:text-green-400 text-xs font-montserrat">
                          <TrendingUp className="h-3.5 w-3.5 mr-1" />
                          <span>+{stats.blogs.new_30d} in 30 days</span>
                        </div>
                      )}
                    </div>
                    <div className="bg-indigo-500/20 rounded-lg p-2.5">
                      <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200/30 dark:border-gray-700/30 flex justify-between text-xs">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 font-montserrat">Published</p>
                      <p className="font-medium text-gray-900 dark:text-white font-montserrat mt-0.5">
                        {stats?.blogs?.published?.toLocaleString() || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 font-montserrat">Drafts</p>
                      <p className="font-medium text-gray-900 dark:text-white font-montserrat mt-0.5">
                        {stats?.blogs?.drafts?.toLocaleString() || 0}
                      </p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-gray-200/20 dark:border-gray-700/20"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-700/70 dark:text-gray-300/70 text-sm font-montserrat">Total Comments</p>
                      <h3 className="text-gray-900 dark:text-white font-playfair text-2xl font-bold">
                        {stats?.comments?.total?.toLocaleString() || 0}
                      </h3>
                      {stats?.comments?.new_30d > 0 && (
                        <div className="flex items-center mt-1 text-green-600 dark:text-green-400 text-xs font-montserrat">
                          <TrendingUp className="h-3.5 w-3.5 mr-1" />
                          <span>+{stats.comments.new_30d} in 30 days</span>
                        </div>
                      )}
                    </div>
                    <div className="bg-pink-500/20 rounded-lg p-2.5">
                      <MessageSquare className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200/30 dark:border-gray-700/30 flex items-center justify-center">
                    <Button
                      variant="white"
                      size="sm"
                      href="/admin/blogs"
                      shadowDepth="shallow"
                      className="w-full text-sm"
                    >
                      Manage Content
                    </Button>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-gray-200/20 dark:border-gray-700/20"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-700/70 dark:text-gray-300/70 text-sm font-montserrat">Pending Applications</p>
                      <h3 className="text-gray-900 dark:text-white font-playfair text-2xl font-bold">
                        {stats?.applications?.pending?.toLocaleString() || 0}
                      </h3>
                      {stats?.applications?.pending > 0 && (
                        <div className="flex items-center mt-1 text-amber-600 dark:text-amber-400 text-xs font-montserrat">
                          <ClipboardCheck className="h-3.5 w-3.5 mr-1" />
                          <span>Awaiting review</span>
                        </div>
                      )}
                    </div>
                    <div className="bg-amber-500/20 rounded-lg p-2.5">
                      <UserPlus className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200/30 dark:border-gray-700/30 flex items-center justify-center">
                    <Button
                      variant={stats?.applications?.pending > 0 ? "primary" : "white"}
                      size="sm"
                      href="/admin/applications"
                      shadowDepth={stats?.applications?.pending > 0 ? "deep" : "shallow"}
                      glossy={stats?.applications?.pending > 0}
                      className="w-full text-sm"
                    >
                      Review Applications
                      {stats?.applications?.pending > 0 && (
                        <span className="ml-1.5 bg-white text-primary-600 rounded-full text-xs px-1.5 py-0.5 font-bold">
                          {stats.applications.pending}
                        </span>
                      )}
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Popular Blogs - Enhanced Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="p-6 border border-gray-100 dark:border-gray-800 shadow-md h-full">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <div className="bg-violet-100 dark:bg-violet-900/30 p-2 rounded-lg mr-3">
                    <Star className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <h2 className="font-playfair text-xl font-bold text-gray-900 dark:text-white">
                    Popular Blogs
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  href="/admin/blogs"
                  icon={<ArrowRight className="h-4 w-4" />}
                  iconPosition="right"
                  className="text-violet-600 dark:text-violet-400 group"
                >
                  <span className="group-hover:underline">View All</span>
                </Button>
              </div>

              <div className="space-y-4">
                {stats?.blogs?.popular?.length > 0 ? (
                  stats.blogs.popular.map((blog, index) => (
                    <motion.div
                      key={blog.blog_id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-start space-x-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-violet-50 dark:hover:bg-violet-900/10 transition-colors duration-200 cursor-pointer border border-gray-100 dark:border-gray-700"
                      onClick={() => navigate(`/blog/${blog.blog_id}`)}
                    >
                      <div className="flex-shrink-0 bg-gradient-to-br from-violet-500 to-indigo-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-sm">
                        {index + 1}
                      </div>
                      <div className="flex-grow min-w-0">
                        <h3 className="font-playfair font-medium text-gray-900 dark:text-white text-sm mb-1 line-clamp-1 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                          {blog.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-montserrat">
                          by{" "}
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {blog.author.personal_info.username}
                          </span>{" "}
                          • {format(new Date(blog.publishedAt), "MMM d, yyyy")}
                        </p>
                        <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400 space-x-3">
                          <div className="flex items-center bg-white dark:bg-gray-700 px-2 py-1 rounded-full">
                            <Eye className="h-3 w-3 mr-1.5 text-violet-500 dark:text-violet-400" />
                            <span className="font-montserrat">
                              {blog.activity?.total_reads?.toLocaleString() || 0}
                            </span>
                          </div>
                          <div className="flex items-center bg-white dark:bg-gray-700 px-2 py-1 rounded-full">
                            <Heart className="h-3 w-3 mr-1.5 text-pink-500" />
                            <span className="font-montserrat">
                              {blog.activity?.total_likes?.toLocaleString() || 0}
                            </span>
                          </div>
                          <div className="flex items-center bg-white dark:bg-gray-700 px-2 py-1 rounded-full">
                            <MessageSquare className="h-3 w-3 mr-1.5 text-indigo-500" />
                            <span className="font-montserrat">
                              {blog.activity?.total_comments?.toLocaleString() || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400 font-montserrat">
                      No popular blogs yet
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Top Authors - Enhanced Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-6 border border-gray-100 dark:border-gray-800 shadow-md h-full">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg mr-3">
                    <Award className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h2 className="font-playfair text-xl font-bold text-gray-900 dark:text-white">
                    Top Authors
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  href="/admin/users"
                  icon={<ArrowRight className="h-4 w-4" />}
                  iconPosition="right"
                  className="text-indigo-600 dark:text-indigo-400 group"
                >
                  <span className="group-hover:underline">View All</span>
                </Button>
              </div>

              <div className="space-y-4">
                {stats?.top_authors?.length > 0 ? (
                  stats.top_authors.map((author, index) => (
                    <motion.div
                      key={author.personal_info.username}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-colors duration-200 cursor-pointer border border-gray-100 dark:border-gray-700"
                      onClick={() => navigate(`/profile/${author.personal_info.username}`)}
                    >
                      <Avatar
                        src={author.personal_info.profile_img}
                        alt={author.personal_info.fullname}
                        size="md"
                        className="mr-3 border-2 border-white dark:border-gray-800 shadow-sm"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-playfair font-medium text-gray-900 dark:text-white text-sm mb-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-1">
                          {author.personal_info.fullname}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-montserrat font-medium">
                          @{author.personal_info.username}
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0 text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white font-montserrat">
                          {author.account_info.total_posts} posts
                        </p>
                        <div className="flex items-center justify-end mt-1">
                          <Eye className="h-3 w-3 mr-1 text-gray-500 dark:text-gray-400" />
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-montserrat">
                            {author.account_info?.total_reads?.toLocaleString() || 0} reads
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400 font-montserrat">
                      No top authors yet
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Action Cards - Enhanced with gradient backgrounds and animations */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {[
            {
              title: "Manage Users",
              icon: <Users className="h-6 w-6" />,
              link: "/admin/users",
              color: "from-violet-600 to-indigo-600",
              colorDark: "from-violet-500 to-indigo-500",
              description: "User accounts & roles",
              delay: 0.1,
            },
            {
              title: "Manage Blogs",
              icon: <FileText className="h-6 w-6" />,
              link: "/admin/blogs",
              color: "from-indigo-600 to-blue-600",
              colorDark: "from-indigo-500 to-blue-500",
              description: "Content moderation",
              delay: 0.2,
            },
            {
              title: "Review Applications",
              icon: <UserPlus className="h-6 w-6" />,
              link: "/admin/applications",
              color: "from-amber-600 to-orange-600",
              colorDark: "from-amber-500 to-orange-500",
              description: `${stats?.applications?.pending || 0} pending`,
              delay: 0.3,
              badge: stats?.applications?.pending > 0,
            },
            {
              title: "Write Blog",
              icon: <PenLine className="h-6 w-6" />,
              link: "/editor",
              color: "from-emerald-600 to-teal-600",
              colorDark: "from-emerald-500 to-teal-500",
              description: "Create new content",
              delay: 0.4,
            },
          ].map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: action.delay }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="relative perspective-[800px]"
            >
              <Button
                variant="transparent"
                href={action.link}
                className={`group relative w-full h-full flex flex-col items-center justify-center p-6 min-h-[9rem] text-white bg-gradient-to-br ${action.color} dark:${action.colorDark} rounded-xl shadow-md hover:shadow-xl overflow-hidden transition-all duration-300 border-none`}
              >
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgb3BhY2l0eT0iMC4wNSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')]"></div>
                <div className="relative z-10 mb-3 bg-white/10 rounded-full p-3">
                  {action.icon}
                </div>
                <h3 className="relative z-10 font-playfair text-base font-bold mb-1">{action.title}</h3>
                <p className="relative z-10 text-xs text-white/80 font-montserrat">
                  {action.description}
                </p>
                {action.badge && (
                  <Badge variant="primary" className="absolute top-2 right-2 bg-white text-primary-600 font-bold">
                    {stats?.applications?.pending}
                  </Badge>
                )}
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboardPage;
