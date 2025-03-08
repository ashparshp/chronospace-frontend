// src/pages/blog/BlogPage.jsx
import { useState, useEffect, createContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  Heart,
  MessageSquare,
  Eye,
  Share2,
  Bookmark,
  Edit,
} from "lucide-react";
import { blogService } from "../../services/blogService";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import BlogContent from "../../components/blog-content.component";
import CommentSection from "../../components/blog/CommentSection";
import Avatar from "../../components/ui/Avatar";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Card from "../../components/ui/Card";
import { BLOG_VISIBILITY } from "../../config/constants";

export const BlogContext = createContext({});

const BlogPage = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { showToast } = useNotification();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [readingProgress, setReadingProgress] = useState(0);
  const [commentsWrapper, setCommentsWrapper] = useState(false);
  const [totalParentCommentsLoaded, setTotalParentCommentsLoaded] = useState(0);

  // Fetch blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await blogService.getBlog(blogId);

        if (!response.data || !response.data.blog) {
          throw new Error("Invalid response format from server");
        }

        const blogData = response.data.blog;
        setBlog(blogData);

        // Check if user has liked this blog
        if (currentUser && blogData._id) {
          try {
            const likedResponse = await blogService.checkLikedByUser(
              blogData._id
            );
            setLiked(!!likedResponse.data.result);
          } catch (likeError) {
            console.error("Error checking like status:", likeError);
          }
        }

        // Fetch related blogs if tags exist
        if (blogData.tags && blogData.tags.length > 0) {
          try {
            const relatedResponse = await blogService.searchBlogs({
              tag: blogData.tags[0],
              eliminate_blog: blogId,
              limit: 3,
            });

            if (relatedResponse.data && relatedResponse.data.blogs) {
              setRelatedBlogs(relatedResponse.data.blogs);
            }
          } catch (relatedError) {
            console.error("Error fetching related blogs:", relatedError);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching blog:", error);
        setError(
          error.response?.data?.error ||
            error.message ||
            "Failed to load blog content"
        );
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId, currentUser]);

  // Reading progress calculation
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setReadingProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Toggle like
  const handleToggleLike = async () => {
    if (!currentUser) {
      navigate("/signin", { state: { from: `/blog/${blogId}` } });
      return;
    }

    try {
      const response = await blogService.toggleLikeBlog(blog._id, liked);
      setLiked(response.data.liked_by_user);

      // Update like count in UI
      setBlog((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          activity: {
            ...prev.activity,
            total_likes: liked
              ? prev.activity.total_likes - 1
              : prev.activity.total_likes + 1,
          },
        };
      });
    } catch (error) {
      console.error("Error toggling like:", error);
      showToast("Failed to update like status", "error");
    }
  };

  // Handle share
  const handleShare = (platform) => {
    const url = window.location.href;
    const title = blog?.title || "Blog Post";

    let shareUrl;
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          url
        )}&text=${encodeURIComponent(title)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          url
        )}`;
        break;
      case "copy":
        navigator.clipboard
          .writeText(url)
          .then(() => showToast("Link copied to clipboard", "success"))
          .catch(() => showToast("Failed to copy link", "error"));
        return;
      default:
        return;
    }

    window.open(shareUrl, "_blank", "width=600,height=400");
    setShareOpen(false);
  };

  // Format date
  const formatPublishedDate = (date) => {
    if (!date) return "Unknown date";
    try {
      return format(new Date(date), "MMMM d, yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Unknown date";
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-black rounded w-3/4"></div>
        <div className="h-6 bg-gray-200 dark:bg-black rounded w-1/2"></div>
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 bg-gray-200 dark:bg-black rounded-full"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-black rounded w-32"></div>
            <div className="h-3 bg-gray-200 dark:bg-black rounded w-24"></div>
          </div>
        </div>
        <div className="h-80 bg-gray-200 dark:bg-black rounded"></div>
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-4 bg-gray-200 dark:bg-black rounded"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {error === "Blog not found" ? "Blog Not Found" : "Error Loading Blog"}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {error === "Blog not found"
            ? "The blog post you are looking for does not exist or has been removed."
            : "There was a problem loading this blog post. Please try again later."}
        </p>
        <Button variant="primary" onClick={() => navigate("/")}>
          Return to Homepage
        </Button>
      </div>
    );
  }

  // Permission checks for private or followers-only blogs
  if (
    blog?.visibility === BLOG_VISIBILITY.PRIVATE &&
    (!currentUser || (blog.author && currentUser._id !== blog.author._id))
  ) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Private Content
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          This blog is private and only visible to its author.
        </p>
        <Button variant="primary" onClick={() => navigate("/")}>
          Return to Homepage
        </Button>
      </div>
    );
  }

  // Followers-only content check
  if (
    blog?.visibility === BLOG_VISIBILITY.FOLLOWERS_ONLY &&
    (!currentUser ||
      (blog.author && currentUser._id !== blog.author._id && !blog.isFollowing))
  ) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Followers-Only Content
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          This blog is only available to followers of{" "}
          {blog.author?.personal_info?.fullname || "the author"}.
        </p>
        <div className="flex justify-center space-x-4">
          <Button
            variant="primary"
            onClick={() =>
              blog.author && blog.author.personal_info
                ? navigate(`/profile/${blog.author.personal_info.username}`)
                : navigate("/")
            }
          >
            View Author Profile
          </Button>
          <Button variant="outline" onClick={() => navigate("/")}>
            Return to Homepage
          </Button>
        </div>
      </div>
    );
  }

  return (
    <BlogContext.Provider
      value={{
        blog,
        setBlog,
        liked,
        setLiked,
        commentsWrapper,
        setCommentsWrapper,
        totalParentCommentsLoaded,
        setTotalParentCommentsLoaded,
      }}
    >
      <div className="mx-auto">
        {/* Reading progress bar */}
        <div
          className="fixed top-0 left-0 right-0 h-1 bg-primary-600 z-50"
          style={{ width: `${readingProgress}%` }}
        ></div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Blog header */}
            <div className="space-y-4">
              {/* Category & Premium badge */}
              <div className="flex items-center space-x-2">
                {blog?.category && (
                  <Badge
                    variant="secondary"
                    className="uppercase text-xs tracking-wide"
                    onClick={() =>
                      navigate(`/search?category=${blog.category}`)
                    }
                  >
                    {blog.category}
                  </Badge>
                )}

                {blog?.is_premium && (
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
                {blog?.title || "Untitled Blog"}
              </h1>

              {/* Description */}
              {blog?.des && (
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  {blog.des}
                </p>
              )}

              {/* Author and date */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                {blog?.author && blog.author.personal_info ? (
                  <div
                    className="flex items-center space-x-3 cursor-pointer"
                    onClick={() =>
                      navigate(`/profile/${blog.author.personal_info.username}`)
                    }
                  >
                    <Avatar
                      src={blog.author.personal_info.profile_img}
                      alt={blog.author.personal_info.fullname}
                      size="md"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {blog.author.personal_info.fullname}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatPublishedDate(blog.publishedAt)} •{" "}
                        {blog.estimated_read_time || 1} min read
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Avatar size="md" />
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        Unknown Author
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatPublishedDate(blog?.publishedAt)} •{" "}
                        {blog?.estimated_read_time || 1} min read
                      </p>
                    </div>
                  </div>
                )}

                {/* Edit button (if author) */}
                {currentUser &&
                  blog?.author &&
                  blog.author._id === currentUser._id && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/editor/${blogId}`)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  )}
              </div>
            </div>

            {/* Banner image */}
            {blog?.banner && (
              <div className="rounded-lg overflow-hidden">
                <img
                  src={blog.banner}
                  alt={blog.title || "Blog banner"}
                  className="w-full max-h-96 object-cover"
                />
              </div>
            )}

            {/* Blog content - Manual rendering approach */}
            <div className="prose dark:prose-invert max-w-none">
              {blog?.content &&
                blog.content.length > 0 &&
                blog.content[0].blocks && (
                  <div className="blog-content">
                    {blog.content[0].blocks.map((block, index) => (
                      <BlogContent key={index} block={block} />
                    ))}
                  </div>
                )}
            </div>

            {/* Tags */}
            {blog?.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                {blog.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => navigate(`/tag/${tag}`)}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Blog engagement */}
            <div className="flex items-center justify-between py-4 border-t border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center space-x-6">
                {/* Like button */}
                <button
                  onClick={handleToggleLike}
                  className={`flex items-center space-x-1 ${
                    liked
                      ? "text-red-500 dark:text-red-400"
                      : "text-gray-500 dark:text-gray-400"
                  } hover:text-red-500 dark:hover:text-red-400`}
                >
                  <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
                  <span>{blog?.activity?.total_likes || 0}</span>
                </button>

                {/* Comments link */}
                <button
                  onClick={() => {
                    const commentsSection =
                      document.getElementById("comments-section");
                    if (commentsSection) {
                      commentsSection.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>{blog?.activity?.total_comments || 0}</span>
                </button>

                {/* Views count */}
                <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                  <Eye className="h-5 w-5" />
                  <span>{blog?.activity?.total_reads || 0}</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Bookmark button */}
                <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                  <Bookmark className="h-5 w-5" />
                </button>

                {/* Share dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShareOpen(!shareOpen)}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>

                  {shareOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-black rounded-md shadow-lg z-10">
                      <div className="py-1">
                        <button
                          onClick={() => handleShare("facebook")}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-black w-full text-left"
                        >
                          Share on Facebook
                        </button>
                        <button
                          onClick={() => handleShare("twitter")}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-black w-full text-left"
                        >
                          Share on Twitter
                        </button>
                        <button
                          onClick={() => handleShare("linkedin")}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-black w-full text-left"
                        >
                          Share on LinkedIn
                        </button>
                        <button
                          onClick={() => handleShare("copy")}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-black w-full text-left"
                        >
                          Copy Link
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Comments section */}
            <div id="comments-section" className="pt-6">
              {blog && <CommentSection blogId={blog._id} />}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Author card */}
            <Card className="p-6">
              <div className="text-center">
                {blog?.author && blog.author.personal_info ? (
                  <>
                    <Avatar
                      src={blog.author.personal_info.profile_img}
                      alt={blog.author.personal_info.fullname}
                      size="xl"
                      className="mx-auto mb-4"
                    />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {blog.author.personal_info.fullname}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {blog.author.personal_info.bio || `Writer at BlogApp`}
                    </p>

                    {currentUser && currentUser._id !== blog.author._id && (
                      <Button variant="primary" className="w-full">
                        Follow Author
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      className="w-full mt-2"
                      onClick={() =>
                        navigate(
                          `/profile/${blog.author.personal_info.username}`
                        )
                      }
                    >
                      View Profile
                    </Button>
                  </>
                ) : (
                  <>
                    <Avatar size="xl" className="mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Unknown Author
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Writer at BlogApp
                    </p>
                  </>
                )}
              </div>

              {/* Author stats */}
              {blog?.author && (
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {blog.author.account_info?.total_posts || 0}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Posts
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {blog.author.account_info?.total_followers || 0}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Followers
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {blog.author.account_info?.total_reads || 0}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Reads
                    </p>
                  </div>
                </div>
              )}
            </Card>

            {/* Related blogs */}
            {relatedBlogs.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Related Posts
                </h3>

                <div className="space-y-4">
                  {relatedBlogs.map((relatedBlog) => (
                    <Card
                      key={relatedBlog.blog_id}
                      className="p-4 cursor-pointer"
                      onClick={() => navigate(`/blog/${relatedBlog.blog_id}`)}
                    >
                      {relatedBlog.banner && (
                        <img
                          src={relatedBlog.banner}
                          alt={relatedBlog.title || "Related blog"}
                          className="w-full h-40 object-cover rounded-lg mb-3"
                        />
                      )}
                      <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                        {relatedBlog.title || "Untitled Blog"}
                      </h4>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <p>{formatPublishedDate(relatedBlog.publishedAt)}</p>
                        <p>{relatedBlog.estimated_read_time || 1} min read</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Tags cloud */}
            {blog?.tags && blog.tags.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Explore Tags
                </h3>

                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer text-sm py-1.5 px-3"
                      onClick={() => navigate(`/tag/${tag}`)}
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </BlogContext.Provider>
  );
};

export default BlogPage;
