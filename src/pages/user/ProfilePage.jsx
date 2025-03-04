// src/pages/user/ProfilePage.jsx
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

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get profile data
        const profileResponse = await userService.getProfile(username);
        setProfile(profileResponse.data);

        // Check if current user is following this profile
        if (currentUser && currentUser._id !== profileResponse.data._id) {
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

  // Fetch blogs when profile is loaded
  useEffect(() => {
    if (profile && activeTab === "blogs") {
      fetchUserBlogs();
    }
  }, [profile, activeTab]);

  // Fetch followers when tab changes to followers
  useEffect(() => {
    if (profile && activeTab === "followers") {
      fetchFollowers();
    }
  }, [profile, activeTab]);

  // Fetch following when tab changes to following
  useEffect(() => {
    if (profile && activeTab === "following") {
      fetchFollowing();
    }
  }, [profile, activeTab]);

  // Fetch user's blogs
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

  // Load more blogs
  const handleLoadMoreBlogs = () => {
    fetchUserBlogs(blogPage + 1);
  };

  // Fetch followers
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

  // Fetch following
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

  // Toggle follow user
  const handleToggleFollow = async () => {
    if (!currentUser) {
      navigate("/signin", { state: { from: `/profile/${username}` } });
      return;
    }

    try {
      const response = await userService.followUser(profile._id);
      setIsFollowing(response.data.followed);

      // Update follower count
      setProfile((prev) => ({
        ...prev,
        account_info: {
          ...prev.account_info,
          total_followers: response.data.followed
            ? prev.account_info.total_followers + 1
            : prev.account_info.total_followers - 1,
        },
      }));

      // Update current user following count
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

  // Loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
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

  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <EmptyState
          title="Profile Not Found"
          description={
            error === "User not found"
              ? "The user you are looking for does not exist or has been removed."
              : "There was a problem loading this profile."
          }
          icon={
            <svg
              className="h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          }
          actionText="Return to Homepage"
          actionLink="/"
        />
      </div>
    );
  }

  // Format dates
  const formatDate = (date) => {
    return format(new Date(date), "MMMM yyyy");
  };

  // Prepare tabs content
  const tabsContent = [
    {
      label: `Blogs (${profile.account_info.total_posts})`,
      id: "blogs",
      content: (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Published Blogs
            </h3>
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
                    className="animate-pulse bg-white dark:bg-gray-800 rounded-lg shadow p-4"
                  >
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  </div>
                ))
              ) : blogs.length > 0 ? (
                <>
                  {blogs.map((blog) => (
                    <Card
                      key={blog.blog_id}
                      className="p-4 cursor-pointer"
                      animate
                      onClick={() => navigate(`/blog/${blog.blog_id}`)}
                    >
                      <div className="flex items-start space-x-4">
                        {blog.banner && (
                          <img
                            src={blog.banner}
                            alt={blog.title}
                            className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                            {blog.title}
                          </h4>
                          {blog.des && (
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-2">
                              {blog.des}
                            </p>
                          )}
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <span>
                              {format(
                                new Date(blog.publishedAt),
                                "MMM d, yyyy"
                              )}
                            </span>
                            <span className="mx-2">•</span>
                            <span>
                              {blog.estimated_read_time || "5"} min read
                            </span>
                            <span className="mx-2">•</span>
                            <div className="flex items-center space-x-3">
                              <span className="flex items-center">
                                <Eye className="h-3 w-3 mr-1" />
                                {blog.activity.total_reads}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}

                  {/* Load more button */}
                  {hasMoreBlogs && (
                    <div className="flex justify-center mt-6">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLoadMoreBlogs}
                        disabled={blogsLoading}
                        isLoading={blogsLoading}
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
                  icon={
                    <svg
                      className="h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                      />
                    </svg>
                  }
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
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Followers
          </h3>

          {followersLoading ? (
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
          ) : followers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {followers.map((follower) => (
                <Card
                  key={follower._id}
                  className="p-4"
                  animate
                  onClick={() =>
                    navigate(`/profile/${follower.personal_info.username}`)
                  }
                >
                  <div className="flex items-center space-x-4">
                    <Avatar
                      src={follower.personal_info.profile_img}
                      alt={follower.personal_info.fullname}
                      size="md"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {follower.personal_info.fullname}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        @{follower.personal_info.username}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No followers yet"
              description={`${profile.personal_info.fullname} doesn't have any followers yet.`}
              icon={<Users className="h-12 w-12 text-gray-400" />}
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
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Following
          </h3>

          {followingLoading ? (
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
          ) : following.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {following.map((follow) => (
                <Card
                  key={follow._id}
                  className="p-4"
                  animate
                  onClick={() =>
                    navigate(`/profile/${follow.personal_info.username}`)
                  }
                >
                  <div className="flex items-center space-x-4">
                    <Avatar
                      src={follow.personal_info.profile_img}
                      alt={follow.personal_info.fullname}
                      size="md"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {follow.personal_info.fullname}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        @{follow.personal_info.username}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Not following anyone yet"
              description={`${profile.personal_info.fullname} isn't following anyone yet.`}
              icon={<Users className="h-12 w-12 text-gray-400" />}
            />
          )}
        </div>
      ),
    },
  ];

  // Handle tab change
  const handleTabChange = (tabIndex) => {
    setActiveTab(tabsContent[tabIndex].id);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Profile Header */}
        <Card className="overflow-hidden">
          {/* Cover Photo (placeholder gradient) */}
          <div className="h-48 bg-gradient-to-r from-primary-500 to-secondary-500"></div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-end -mt-24 md:space-x-6">
              {/* Profile Picture */}
              <Avatar
                src={profile.personal_info.profile_img}
                alt={profile.personal_info.fullname}
                size="2xl"
                className="border-4 border-white dark:border-gray-800 rounded-full h-36 w-36"
              />

              <div className="flex-1 flex flex-col md:flex-row items-center md:items-end justify-between mt-4 md:mt-0">
                <div className="text-center md:text-left mb-4 md:mb-0">
                  {/* Name and Username */}
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {profile.personal_info.fullname}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    @{profile.personal_info.username}
                  </p>

                  {/* Role Badge */}
                  <div className="mt-2">
                    {profile.role === "admin" ? (
                      <Badge variant="accent" className="capitalize">
                        Admin
                      </Badge>
                    ) : profile.role === "blogger" ? (
                      <Badge variant="secondary" className="capitalize">
                        Blogger
                      </Badge>
                    ) : (
                      <Badge variant="primary" className="capitalize">
                        Reader
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  {currentUser && currentUser._id === profile._id ? (
                    <Button variant="outline" href="/settings">
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <Button
                      variant={isFollowing ? "outline" : "primary"}
                      onClick={handleToggleFollow}
                    >
                      {isFollowing ? (
                        <>
                          <UserCheck className="h-4 w-4 mr-2" />
                          Following
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Follow
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Bio and Info */}
            <div className="mt-6">
              {profile.personal_info.bio && (
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {profile.personal_info.bio}
                </p>
              )}

              <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Joined {formatDate(profile.joinedAt)}</span>
                </div>

                {profile.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{profile.location}</span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              {profile.social_links &&
                Object.values(profile.social_links).some((link) => link) && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    {profile.social_links.website && (
                      <a
                        href={profile.social_links.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                      >
                        <Globe className="h-5 w-5" />
                      </a>
                    )}
                    {profile.social_links.twitter && (
                      <a
                        href={profile.social_links.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                      >
                        <Twitter className="h-5 w-5" />
                      </a>
                    )}
                    {profile.social_links.facebook && (
                      <a
                        href={profile.social_links.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500"
                      >
                        <Facebook className="h-5 w-5" />
                      </a>
                    )}
                    {profile.social_links.instagram && (
                      <a
                        href={profile.social_links.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                    )}
                    {profile.social_links.github && (
                      <a
                        href={profile.social_links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <GitHub className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                )}
            </div>

            {/* Stats */}
            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6 grid grid-cols-4 gap-2 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {profile.account_info.total_posts}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Posts
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {profile.account_info.total_reads}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Reads
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {profile.account_info.total_followers}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Followers
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {profile.account_info.total_following}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Following
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Profile Content Tabs */}
        <Tabs tabs={tabsContent} defaultTab={0} onChange={handleTabChange} />
      </motion.div>
    </div>
  );
};

export default ProfilePage;
