import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Link as LinkIcon,
  Twitter,
  Facebook,
  Instagram,
  Globe,
  Users,
  BookOpen,
  Eye,
  Grid,
  List,
  UserPlus,
  UserCheck,
  Settings,
  Heart,
  MessageSquare,
  Bookmark,
  Share2,
  TrendingUp,
  Clock,
  Send,
} from "lucide-react";
import { format } from "date-fns";
import { userService } from "../../services/userService";
import { blogService } from "../../services/blogService";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import Avatar from "../../components/ui/Avatar";
import Button from "../../components/ui/Button";
import Tabs from "../../components/ui/Tabs";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import BlogList from "../../components/blog/BlogList";
import EmptyState from "../../components/ui/EmptyState";
import StatCard from "../../components/ui/StatsCard";

const GitHub = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.48 2 2 7.11 2 13.5c0 5.54 3.58 10.24 8.55 11.91.63.12.85-.27.85-.6v-2.1c-3.47.78-4.2-1.52-4.2-1.52-.57-1.5-1.38-1.9-1.38-1.9-1.13-.78.09-.76.09-.76 1.25.09 1.91 1.3 1.91 1.3 1.11 1.92 2.91 1.37 3.63 1.04.11-.8.43-1.37.78-1.69-2.77-.33-5.69-1.41-5.69-6.27 0-1.38.48-2.52 1.27-3.41-.13-.33-.55-1.67.12-3.48 0 0 1.04-.34 3.41 1.3a11.8 11.8 0 0 1 3.1-.42c1.05 0 2.1.14 3.1.42 2.36-1.64 3.41-1.3 3.41-1.3.67 1.81.25 3.15.12 3.48.79.89 1.27 2.03 1.27 3.41 0 4.87-2.92 5.93-5.7 6.26.45.39.84 1.16.84 2.34v3.47c0 .33.22.72.85.6C18.42 23.74 22 19.04 22 13.5 22 7.11 17.52 2 12 2Z"
    />
  </svg>
);

const ProfilePage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { currentUser, updateUserData } = useAuth();
  const { showToast } = useNotification();
  const [profile, setProfile] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [followersLoading, setFollowersLoading] = useState(true);
  const [followingLoading, setFollowingLoading] = useState(true);
  const [error, setError] = useState(null);
  const [blogPage, setBlogPage] = useState(1);
  const [hasMoreBlogs, setHasMoreBlogs] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("blogs");
  const [viewMode, setViewMode] = useState("grid");

  const isCurrentUserProfile = () => {
    if (!currentUser || !profile?.personal_info) return false;
    return currentUser.username === profile.personal_info.username;
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);
        const profileResponse = await userService.getProfile(username);
        setProfile(profileResponse.data);
        if (
          currentUser &&
          currentUser.username !== profileResponse.data.personal_info.username
        ) {
          const followingResponse = await userService.checkIsFollowing(
            profileResponse.data._id
          );
          setIsFollowing(followingResponse.data.isFollowing);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError(error.response?.data?.error || "Failed to load profile");
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [username, currentUser]);

  useEffect(() => {
    if (profile && activeTab === "blogs") {
      fetchUserBlogs();
    }
  }, [profile, activeTab]);

  useEffect(() => {
    if (profile && activeTab === "followers") {
      fetchFollowers();
    }
  }, [profile, activeTab]);

  useEffect(() => {
    if (profile && activeTab === "following") {
      fetchFollowing();
    }
  }, [profile, activeTab]);

  const fetchUserBlogs = async (page = 1) => {
    try {
      setBlogsLoading(true);
      const searchParams = {
        author: profile._id,
        page,
        limit: 6,
      };
      const response = await blogService.searchBlogs(searchParams);
      if (page === 1) {
        setBlogs(response.data.blogs);
      } else {
        setBlogs((prev) => [...prev, ...response.data.blogs]);
      }
      setHasMoreBlogs(response.data.blogs.length === 6);
      setBlogPage(page);
      setBlogsLoading(false);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      showToast("Failed to load blogs", "error");
      setBlogsLoading(false);
    }
  };

  const handleLoadMoreBlogs = () => {
    fetchUserBlogs(blogPage + 1);
  };

  const fetchFollowers = async () => {
    try {
      setFollowersLoading(true);
      const response = await userService.getFollowers(profile._id);
      setFollowers(response.data.followers);
      setFollowersLoading(false);
    } catch (error) {
      console.error("Error fetching followers:", error);
      showToast("Failed to load followers", "error");
      setFollowersLoading(false);
    }
  };

  const fetchFollowing = async () => {
    try {
      setFollowingLoading(true);
      const response = await userService.getFollowing(profile._id);
      setFollowing(response.data.following);
      setFollowingLoading(false);
    } catch (error) {
      console.error("Error fetching following:", error);
      showToast("Failed to load following", "error");
      setFollowingLoading(false);
    }
  };

  const handleToggleFollow = async () => {
    if (!currentUser) {
      navigate("/signin", { state: { from: `/profile/${username}` } });
      return;
    }

    try {
      const response = await userService.followUser(profile._id);
      setIsFollowing(response.data.followed);
      setProfile((prev) => ({
        ...prev,
        account_info: {
          ...prev.account_info,
          total_followers: response.data.followed
            ? prev.account_info.total_followers + 1
            : prev.account_info.total_followers - 1,
        },
      }));
      if (currentUser) {
        updateUserData({
          account_info: {
            ...currentUser.account_info,
            total_following: response.data.followed
              ? currentUser.account_info.total_following + 1
              : currentUser.account_info.total_following - 1,
          },
        });
      }
      showToast(
        response.data.followed
          ? `You are now following ${profile.personal_info.fullname}`
          : `You unfollowed ${profile.personal_info.fullname}`,
        "success"
      );
    } catch (error) {
      console.error("Error toggling follow:", error);
      showToast("Failed to update follow status", "error");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto space-y-8 animate-pulse">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
          <div className="p-6">
            <div className="flex flex-col items-center -mt-24">
              <div className="h-36 w-36 rounded-full bg-gray-200 dark:bg-gray-700 border-4 border-white dark:border-gray-800"></div>
              <div className="mt-4 space-y-2 text-center">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mx-auto"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto">
        <EmptyState
          title="Profile Not Found"
          description={
            error === "User not found"
              ? "The user you are looking for does not exist or has been removed."
              : "There was a problem loading this profile."
          }
          icon={<Users className="h-16 w-16 text-gray-400" />}
          actionText="Return to Homepage"
          actionLink="/"
          className="bg-white dark:bg-gray-800 rounded-xl p-10 border border-gray-100 dark:border-gray-700 shadow-sm"
        />
      </div>
    );
  }

  const formatDate = (date) => {
    return format(new Date(date), "MMMM yyyy");
  };

  const getColorForRole = (role) => {
    switch (role) {
      case "admin":
        return "from-purple-600 to-indigo-600 dark:from-purple-500 dark:to-indigo-500";
      case "blogger":
        return "from-violet-600 to-blue-600 dark:from-violet-500 dark:to-blue-500";
      default:
        return "from-blue-600 to-sky-600 dark:from-blue-500 dark:to-sky-500";
    }
  };

  const tabsContent = [
    {
      label: `Blogs (${profile.account_info.total_posts})`,
      id: "blogs",
      content: (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white font-playfair">
                Published Blogs
              </h3>
              <div className="mt-1 h-1 bg-gradient-to-r from-violet-500 to-indigo-500 w-20 rounded"></div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                className={`p-2 rounded-md transition-colors duration-200 ${
                  viewMode === "grid"
                    ? "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400"
                    : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 hover:bg-violet-50 dark:hover:bg-violet-900/10"
                }`}
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                className={`p-2 rounded-md transition-colors duration-200 ${
                  viewMode === "list"
                    ? "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400"
                    : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 hover:bg-violet-50 dark:hover:bg-violet-900/10"
                }`}
                onClick={() => setViewMode("list")}
                aria-label="List view"
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
          {viewMode === "grid" ? (
            <BlogList
              blogs={blogs}
              loading={blogsLoading}
              error={null}
              onLoadMore={handleLoadMoreBlogs}
              hasMore={hasMoreBlogs}
              emptyTitle="No blogs published yet"
              emptyDescription={`${profile.personal_info.fullname} hasn't published any blogs yet.`}
            />
          ) : (
            <div className="space-y-4">
              {blogsLoading && blogs.length === 0 ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-100 dark:border-gray-700"
                  >
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  </div>
                ))
              ) : blogs.length > 0 ? (
                <>
                  {blogs.map((blog, index) => (
                    <motion.div
                      key={blog.blog_id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card
                        className="p-4 cursor-pointer border border-gray-100 dark:border-gray-700 hover:border-violet-200 dark:hover:border-violet-800 transition-all duration-300 hover:shadow-md"
                        onClick={() => navigate(`/blog/${blog.blog_id}`)}
                      >
                        <div className="flex items-start space-x-4">
                          {blog.banner && (
                            <div className="w-24 h-24 relative overflow-hidden rounded-lg flex-shrink-0">
                              <img
                                src={blog.banner}
                                alt={blog.title}
                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                              />
                              {blog.featured && (
                                <div className="absolute top-1 right-1 bg-amber-500 text-white text-xs p-1 rounded">
                                  <Star className="h-3 w-3" />
                                </div>
                              )}
                            </div>
                          )}
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 dark:text-white mb-1 font-playfair hover:text-violet-600 dark:hover:text-violet-400 transition-colors line-clamp-2">
                              {blog.title}
                            </h4>
                            {blog.des && (
                              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-2 font-montserrat">
                                {blog.des}
                              </p>
                            )}
                            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400 font-montserrat">
                              <span className="flex items-center bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                                <Calendar className="h-3 w-3 mr-1 text-violet-500 dark:text-violet-400" />
                                {format(
                                  new Date(blog.publishedAt),
                                  "MMM d, yyyy"
                                )}
                              </span>
                              <span className="flex items-center bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                                <Clock className="h-3 w-3 mr-1 text-blue-500 dark:text-blue-400" />
                                {blog.estimated_read_time || "5"} min read
                              </span>
                              <span className="flex items-center bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                                <Eye className="h-3 w-3 mr-1 text-green-500 dark:text-green-400" />
                                {blog.activity?.total_reads?.toLocaleString() ||
                                  0}
                              </span>
                              {blog.activity?.total_likes > 0 && (
                                <span className="flex items-center bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                                  <Heart className="h-3 w-3 mr-1 text-red-500 dark:text-red-400" />
                                  {blog.activity.total_likes}
                                </span>
                              )}
                              {blog.activity?.total_comments > 0 && (
                                <span className="flex items-center bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                                  <MessageSquare className="h-3 w-3 mr-1 text-indigo-500 dark:text-indigo-400" />
                                  {blog.activity.total_comments}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                  {hasMoreBlogs && (
                    <div className="flex justify-center mt-6">
                      <Button
                        variant="outline"
                        size="md"
                        onClick={handleLoadMoreBlogs}
                        disabled={blogsLoading}
                        isLoading={blogsLoading}
                        shadowDepth="shallow"
                      >
                        Load More
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <EmptyState
                  title="No blogs published yet"
                  description={`${profile.personal_info.fullname} hasn't published any blogs yet.`}
                  icon={<BookOpen className="h-16 w-16 text-gray-400" />}
                  className="bg-white dark:bg-gray-800 rounded-xl p-10 border border-gray-100 dark:border-gray-700 shadow-sm"
                />
              )}
            </div>
          )}
        </div>
      ),
    },
    {
      label: `Followers (${profile.account_info.total_followers})`,
      id: "followers",
      content: (
        <div className="mt-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white font-playfair">
              Followers
            </h3>
            <div className="mt-1 h-1 bg-gradient-to-r from-violet-500 to-indigo-500 w-20 rounded"></div>
          </div>
          {followersLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-100 dark:border-gray-700"
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
          ) : followers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {followers.map((follower, index) => (
                <motion.div
                  key={follower._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card
                    className="p-4 cursor-pointer border border-gray-100 dark:border-gray-700 hover:border-violet-200 dark:hover:border-violet-800 transition-all duration-300 hover:shadow-md"
                    onClick={() =>
                      navigate(`/profile/${follower.personal_info.username}`)
                    }
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar
                        src={follower.personal_info.profile_img}
                        alt={follower.personal_info.fullname}
                        size="md"
                        className="border-2 border-white dark:border-gray-800 shadow-sm"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white font-playfair hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                          {follower.personal_info.fullname}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-montserrat">
                          @{follower.personal_info.username}
                        </p>
                        {follower.role && (
                          <div className="mt-1">
                            <Badge
                              variant={
                                follower.role === "admin"
                                  ? "accent"
                                  : follower.role === "blogger"
                                  ? "secondary"
                                  : "primary"
                              }
                              size="sm"
                              className="text-xs"
                            >
                              {follower.role}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                    {follower.account_info && (
                      <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400 font-montserrat">
                        <div className="flex items-center">
                          <BookOpen className="h-3 w-3 mr-1 text-violet-500 dark:text-violet-400" />
                          <span>
                            {follower.account_info.total_posts || 0} posts
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1 text-indigo-500 dark:text-indigo-400" />
                          <span>
                            {follower.account_info.total_followers || 0}{" "}
                            followers
                          </span>
                        </div>
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No followers yet"
              description={`${profile.personal_info.fullname} doesn't have any followers yet.`}
              icon={<Users className="h-16 w-16 text-gray-400" />}
              className="bg-white dark:bg-gray-800 rounded-xl p-10 border border-gray-100 dark:border-gray-700 shadow-sm"
            />
          )}
        </div>
      ),
    },
    {
      label: `Following (${profile.account_info.total_following})`,
      id: "following",
      content: (
        <div className="mt-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white font-playfair">
              Following
            </h3>
            <div className="mt-1 h-1 bg-gradient-to-r from-violet-500 to-indigo-500 w-20 rounded"></div>
          </div>
          {followingLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-100 dark:border-gray-700"
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
          ) : following.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {following.map((follow, index) => (
                <motion.div
                  key={follow._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card
                    className="p-4 cursor-pointer border border-gray-100 dark:border-gray-700 hover:border-violet-200 dark:hover:border-violet-800 transition-all duration-300 hover:shadow-md"
                    onClick={() =>
                      navigate(`/profile/${follow.personal_info.username}`)
                    }
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar
                        src={follow.personal_info.profile_img}
                        alt={follow.personal_info.fullname}
                        size="md"
                        className="border-2 border-white dark:border-gray-800 shadow-sm"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white font-playfair hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                          {follow.personal_info.fullname}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-montserrat">
                          @{follow.personal_info.username}
                        </p>
                        {follow.role && (
                          <div className="mt-1">
                            <Badge
                              variant={
                                follow.role === "admin"
                                  ? "accent"
                                  : follow.role === "blogger"
                                  ? "secondary"
                                  : "primary"
                              }
                              size="sm"
                              className="text-xs"
                            >
                              {follow.role}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                    {follow.account_info && (
                      <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400 font-montserrat">
                        <div className="flex items-center">
                          <BookOpen className="h-3 w-3 mr-1 text-violet-500 dark:text-violet-400" />
                          <span>
                            {follow.account_info.total_posts || 0} posts
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1 text-indigo-500 dark:text-indigo-400" />
                          <span>
                            {follow.account_info.total_followers || 0} followers
                          </span>
                        </div>
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Not following anyone yet"
              description={`${profile.personal_info.fullname} isn't following anyone yet.`}
              icon={<Users className="h-16 w-16 text-gray-400" />}
              className="bg-white dark:bg-gray-800 rounded-xl p-10 border border-gray-100 dark:border-gray-700 shadow-sm"
            />
          )}
        </div>
      ),
    },
  ];

  const handleTabChange = (tabIndex) => {
    setActiveTab(tabsContent[tabIndex].id);
  };

  return (
    <div className="mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Profile Header Card with animated gradient background */}
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <div
            className={`relative bg-gradient-to-br ${getColorForRole(
              profile.role
            )} h-48`}
          >
            {/* Background decoration */}
            <motion.div
              className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"
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
              className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"
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

            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 bg-grid-pattern"></div>
          </div>

          <div className="relative bg-white dark:bg-gray-800 px-6 pb-6">
            <div className="flex flex-col md:flex-row items-center md:items-end -mt-24 md:space-x-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Avatar
                  src={profile.personal_info.profile_img}
                  alt={profile.personal_info.fullname}
                  size="2xl"
                  className="border-4 border-white dark:border-gray-800 shadow-lg rounded-full h-36 w-36"
                />
              </motion.div>

              <div className="flex-1 flex flex-col md:flex-row items-center md:items-end justify-between mt-4 md:mt-0">
                <motion.div
                  className="text-center md:text-left mb-4 md:mb-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white font-playfair">
                    {profile.personal_info.fullname}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 font-montserrat">
                    @{profile.personal_info.username}
                  </p>
                  <div className="mt-2">
                    {profile.role === "admin" ? (
                      <Badge
                        variant="accent"
                        className="capitalize bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
                      >
                        Admin
                      </Badge>
                    ) : profile.role === "blogger" ? (
                      <Badge
                        variant="secondary"
                        className="capitalize bg-gradient-to-r from-violet-500 to-blue-500 text-white"
                      >
                        Blogger
                      </Badge>
                    ) : (
                      <Badge
                        variant="primary"
                        className="capitalize text-white bg-gradient-to-r from-indigo-900 to-indigo-950"
                      >
                        Reader
                      </Badge>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  className="flex space-x-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {currentUser && isCurrentUserProfile() ? (
                    <Button
                      variant="orange"
                      href="/settings"
                      shadowDepth="shallow"
                      glossy={true}
                      icon={<Settings className="h-4 w-4" />}
                      iconPosition="left"
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <Button
                      variant={isFollowing ? "outline" : "primary"}
                      onClick={handleToggleFollow}
                      shadowDepth={isFollowing ? "shallow" : "deep"}
                      glossy={!isFollowing}
                      icon={
                        isFollowing ? (
                          <UserCheck className="h-4 w-4" />
                        ) : (
                          <UserPlus className="h-4 w-4" />
                        )
                      }
                      iconPosition="left"
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </Button>
                  )}
                  <Button
                    variant="white"
                    shadowDepth="shallow"
                    glossy={true}
                    icon={<Share2 className="h-4 w-4" />}
                    iconPosition="left"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      showToast("Profile link copied to clipboard", "success");
                    }}
                  >
                    Share
                  </Button>
                </motion.div>
              </div>
            </div>

            <motion.div
              className="mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {profile.personal_info.bio && (
                <p className="text-gray-700 dark:text-gray-300 mb-4 font-montserrat leading-relaxed">
                  {profile.personal_info.bio}
                </p>
              )}
              <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0 text-sm text-gray-600 dark:text-gray-400 font-montserrat">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-violet-500 dark:text-violet-400" />
                  <span>Joined {formatDate(profile.joinedAt)}</span>
                </div>
                {profile.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-red-500 dark:text-red-400" />
                    <span>{profile.location}</span>
                  </div>
                )}
              </div>

              {profile.social_links &&
                Object.values(profile.social_links).some((link) => link) && (
                  <div className="mt-4 flex flex-wrap gap-4">
                    {profile.social_links.website && (
                      <a
                        href={profile.social_links.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 transition-colors"
                        aria-label="Website"
                      >
                        <Globe className="h-5 w-5" />
                      </a>
                    )}
                    {profile.social_links.twitter && (
                      <a
                        href={profile.social_links.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                        aria-label="Twitter"
                      >
                        <Twitter className="h-5 w-5" />
                      </a>
                    )}
                    {profile.social_links.facebook && (
                      <a
                        href={profile.social_links.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition-colors"
                        aria-label="Facebook"
                      >
                        <Facebook className="h-5 w-5" />
                      </a>
                    )}
                    {profile.social_links.instagram && (
                      <a
                        href={profile.social_links.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400 transition-colors"
                        aria-label="Instagram"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                    )}
                    {profile.social_links.github && (
                      <a
                        href={profile.social_links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                        aria-label="GitHub"
                      >
                        <GitHub className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                )}
            </motion.div>

            {/* Stats Cards Row */}
            <motion.div
              className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <StatCard
                title="Published Blogs"
                value={profile.account_info.total_posts}
                icon={<BookOpen />}
                delay={0.1}
              />
              <StatCard
                title="Total Reads"
                value={profile.account_info.total_reads}
                icon={<Eye />}
                iconBgColor="bg-green-500/20"
                iconColor="text-green-600 dark:text-green-400"
                delay={0.2}
              />
              <StatCard
                title="Total Likes"
                value={profile.account_info.total_likes}
                icon={<Heart />}
                iconBgColor="bg-red-500/20"
                iconColor="text-red-600 dark:text-red-400"
                delay={0.3}
              />
              <StatCard
                title="Followers"
                value={profile.account_info.total_followers}
                icon={<Users />}
                iconBgColor="bg-indigo-500/20"
                iconColor="text-indigo-600 dark:text-indigo-400"
                delay={0.4}
              />
            </motion.div>
          </div>
        </div>

        {/* Custom Styled Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav
              className="flex justify-around md:justify-start px-4"
              aria-label="Tabs"
            >
              {tabsContent.map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(index)}
                  className={`whitespace-nowrap py-4 px-6 font-medium text-sm font-montserrat relative ${
                    activeTab === tab.id
                      ? "text-violet-600 dark:text-violet-400"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-indigo-500"
                      layoutId="activetab"
                    ></motion.div>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {tabsContent.find((tab) => tab.id === activeTab)?.content}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
