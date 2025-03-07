// src/components/auth/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingScreen from "../ui/LoadingScreen";

const ProtectedRoute = () => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // Show loading screen while checking authentication
  if (loading) {
    return <LoadingScreen />;
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Render the protected route
  return <Outlet />;
};

export default ProtectedRoute;

// src/components/auth/RoleBasedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingScreen from "../ui/LoadingScreen";

const RoleBasedRoute = ({ roles }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // Show loading screen while checking authentication
  if (loading) {
    return <LoadingScreen />;
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Redirect to home if user doesn't have required role
  if (!roles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }

  // Render the protected route
  return <Outlet />;
};

export default RoleBasedRoute;

// src/components/blog/BlogCard.jsx

// src/components/blog/BlogCard.jsx
import { useNavigate } from "react-router-dom";
import { format, parseISO, isValid } from "date-fns";
import { Heart, MessageSquare, Eye } from "lucide-react";
import Avatar from "../ui/Avatar";
import Card from "../ui/Card";
import Badge from "../ui/Badge";

const BlogCard = ({ blog, className = "" }) => {
  const navigate = useNavigate();

  const handleBlogClick = () => {
    navigate(`/blog/${blog.blog_id}`);
  };

  const handleAuthorClick = (e) => {
    e.stopPropagation();
    // Only navigate if author exists
    if (blog.author && blog.author.personal_info) {
      navigate(`/profile/${blog.author.personal_info.username}`);
    }
  };

  // Format date safely with better error handling
  const formatDate = (dateString) => {
    if (!dateString) return "No date";

    try {
      // Try to parse the date string
      const date = new Date(dateString);

      // Check if the date is valid
      if (!isNaN(date.getTime())) {
        return format(date, "MMM d, yyyy");
      }

      // Try parseISO as a fallback
      const parsedDate = parseISO(dateString);
      if (isValid(parsedDate)) {
        return format(parsedDate, "MMM d, yyyy");
      }

      return "Invalid date";
    } catch (error) {
      console.error("Error formatting date:", error, dateString);
      return "Invalid date";
    }
  };

  return (
    <Card
      className={`overflow-hidden h-full cursor-pointer transition-shadow hover:shadow-custom-lg ${className}`}
      animate
      onClick={handleBlogClick}
    >
      {/* Blog Banner Image */}
      {blog.banner && (
        <div className="h-48 overflow-hidden">
          <img
            src={blog.banner}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
          />
        </div>
      )}

      <div className="px-6 py-5">
        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="hover:bg-secondary-200 dark:hover:bg-secondary-800 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/tag/${tag}`);
                }}
              >
                {tag}
              </Badge>
            ))}
            {blog.tags.length > 3 && (
              <Badge variant="secondary">+{blog.tags.length - 3}</Badge>
            )}
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
          {blog.title}
        </h3>

        {/* Description */}
        {blog.des && (
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base mb-4 line-clamp-2">
            {blog.des}
          </p>
        )}

        {/* Bottom Info */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
          {/* Author - Add null check for author */}
          {blog.author && blog.author.personal_info ? (
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={handleAuthorClick}
            >
              <Avatar
                src={blog.author.personal_info.profile_img}
                alt={blog.author.personal_info.fullname}
                size="sm"
              />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {blog.author.personal_info.fullname}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(blog.publishedAt)}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Avatar size="sm" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Unknown Author
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(blog.publishedAt)}
                </p>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Heart size={16} />
              <span>{blog.activity?.total_likes || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare size={16} />
              <span>{blog.activity?.total_comments || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye size={16} />
              <span>{blog.activity?.total_reads || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BlogCard;

// src/components/blog/BlogEditor.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditorJS from "@editorjs/editorjs";
import { createImageUploadHandler } from "../../services/uploadService";
import { EDITOR_JS_TOOLS } from "../../config/constants";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import { X, Image, Save, Upload, Check, Eye, ArrowLeft } from "lucide-react";
import { BLOG_CATEGORIES, BLOG_VISIBILITY } from "../../config/constants";
import { blogService } from "../../services/blogService";
import { uploadService } from "../../services/uploadService";
import { useNotification } from "../../context/NotificationContext";

const BlogEditor = ({ initialData = null, isEdit = false }) => {
  const navigate = useNavigate();
  const { showToast } = useNotification();
  const editorRef = useRef(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [category, setCategory] = useState("general");
  const [visibility, setVisibility] = useState("public");
  const [isPremium, setIsPremium] = useState(false);
  const [banner, setBanner] = useState("");
  const [bannerFile, setBannerFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editorReady, setEditorReady] = useState(false);

  // Initialize editor
  // Initialize editor - FIXED VERSION
  useEffect(() => {
    if (editorRef.current) return;

    const editorElement = document.getElementById("editor");
    if (!editorElement) return;

    try {
      const editor = new EditorJS({
        holder: "editor",
        tools: {
          ...EDITOR_JS_TOOLS,
          // Override the image tool with your custom uploader
          image: {
            class: EDITOR_JS_TOOLS.image.class,
            config: {
              uploader: createImageUploadHandler(),
            },
          },
        },
        placeholder: "Let's write an awesome story!",
        data: initialData?.content || {},
        async onChange() {
          if (editorReady) {
            try {
              const data = await editor.save();
              localStorage.setItem("editor-draft", JSON.stringify(data));
            } catch (error) {
              console.error("Error saving draft:", error);
            }
          }
        },
        onReady: () => {
          editorRef.current = editor;
          setEditorReady(true);
        },
      });
    } catch (error) {
      console.error("Error initializing EditorJS:", error);
    }

    // Clean up on unmount
    return () => {
      if (editorRef.current) {
        try {
          editorRef.current.destroy();
        } catch (error) {
          console.error("Error destroying editor:", error);
        }
        editorRef.current = null;
      }
    };
  }, [initialData]); // Only depend on initialData

  // Set initial data if editing
  useEffect(() => {
    if (initialData && initialData.blog_id) {
      setTitle(initialData.title || "");
      setDescription(initialData.des || "");
      setTags(initialData.tags || []);
      setCategory(initialData.category || "general");
      setVisibility(initialData.visibility || "public");
      setIsPremium(initialData.is_premium || false);
      setBanner(initialData.banner || "");
    } else {
      // Check for draft in localStorage
      const savedDraft = localStorage.getItem("editor-draft");
      if (savedDraft) {
        try {
          const draftData = JSON.parse(savedDraft);
          // You might want to prompt the user before loading the draft
          if (editorRef.current) {
            editorRef.current.render(draftData);
          }
        } catch (error) {
          console.error("Error loading draft:", error);
        }
      }
    }
  }, [initialData, editorReady]);

  // Handle tag input
  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  // Add tag
  const addTag = () => {
    const newTag = tagInput.trim().toLowerCase();
    if (newTag && !tags.includes(newTag) && tags.length < 10) {
      setTags([...tags, newTag]);
      setTagInput("");
    }
  };

  // Remove tag
  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  // Handle banner image upload
  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);

      // Show preview
      const reader = new FileReader();
      reader.onload = () => {
        setBanner(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove banner
  const removeBanner = () => {
    setBanner("");
    setBannerFile(null);
  };

  // Save as draft
  const saveAsDraft = async () => {
    if (!title.trim()) {
      showToast("Please add a title for your draft", "error");
      return;
    }

    setSaving(true);
    try {
      const content = await editorRef.current.save();
      let bannerUrl = banner;

      // Upload banner if it's a file
      if (bannerFile) {
        const uploadResult = await uploadService.uploadToS3(
          bannerFile,
          bannerFile.type
        );
        bannerUrl = uploadResult.fileUrl;
      }

      const blogData = {
        title,
        des: description,
        banner: bannerUrl,
        tags,
        content,
        draft: true,
        category,
        visibility,
        is_premium: isPremium,
        id: initialData?.blog_id, // Include ID if editing
      };

      const response = await blogService.createUpdateBlog(blogData);

      // Clear localStorage draft
      localStorage.removeItem("editor-draft");

      showToast("Draft saved successfully", "success");
      navigate(`/dashboard?tab=drafts`);
    } catch (error) {
      console.error("Error saving draft:", error);
      showToast(error.response?.data?.error || "Failed to save draft", "error");
    } finally {
      setSaving(false);
    }
  };

  // Publish blog
  const publishBlog = async () => {
    // Validate fields
    if (!title.trim()) {
      showToast("Please add a title", "error");
      return;
    }

    if (!description.trim() || description.length > 200) {
      showToast("Please add a description (max 200 characters)", "error");
      return;
    }

    if (tags.length === 0) {
      showToast("Please add at least one tag", "error");
      return;
    }

    // Validate content
    const content = await editorRef.current.save();
    if (!content.blocks || content.blocks.length === 0) {
      showToast("Please add some content to your blog", "error");
      return;
    }

    setLoading(true);
    try {
      let bannerUrl = banner;

      // Upload banner if it's a file
      if (bannerFile) {
        const uploadResult = await uploadService.uploadToS3(
          bannerFile,
          bannerFile.type
        );
        bannerUrl = uploadResult.fileUrl;
      }

      const blogData = {
        title,
        des: description,
        banner: bannerUrl,
        tags,
        content,
        draft: false,
        category,
        visibility,
        is_premium: isPremium,
        id: initialData?.blog_id, // Include ID if editing
      };

      const response = await blogService.createUpdateBlog(blogData);

      // Clear localStorage draft
      localStorage.removeItem("editor-draft");

      showToast(
        isEdit ? "Blog updated successfully" : "Blog published successfully",
        "success"
      );
      navigate(`/blog/${response.data.id}`);
    } catch (error) {
      console.error("Error publishing blog:", error);
      showToast(
        error.response?.data?.error || "Failed to publish blog",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Preview function
  const previewBlog = async () => {
    try {
      const content = await editorRef.current.save();
      // Store in sessionStorage for the preview page
      sessionStorage.setItem(
        "blog-preview",
        JSON.stringify({
          title,
          des: description,
          banner,
          tags,
          content,
          category,
          visibility,
          is_premium: isPremium,
        })
      );
      // Open preview in new tab
      window.open("/preview", "_blank");
    } catch (error) {
      console.error("Error creating preview:", error);
      showToast("Failed to create preview", "error");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
      {/* Editor Header/Toolbar */}
      <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back
            </Button>
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {isEdit ? "Edit Blog" : "Create Blog"}
            </h2>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={previewBlog}
              disabled={loading || saving}
            >
              <Eye className="h-4 w-4 mr-1" />
              Preview
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={saveAsDraft}
              disabled={loading || saving}
              isLoading={saving}
            >
              <Save className="h-4 w-4 mr-1" />
              Save Draft
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={publishBlog}
              disabled={loading || saving}
              isLoading={loading}
            >
              <Check className="h-4 w-4 mr-1" />
              {isEdit ? "Update" : "Publish"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Editor Content */}
      <div className="p-6">
        {/* Title Input */}
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Blog Title"
          className="text-2xl font-bold mb-4 border-0 border-b border-gray-200 dark:border-gray-700 rounded-none px-0 py-2 focus:ring-0"
        />

        {/* Banner Upload */}
        <div className="mb-6">
          {banner ? (
            <div className="relative rounded-lg overflow-hidden">
              <img
                src={banner}
                alt="Banner"
                className="w-full h-64 object-cover"
              />
              <Button
                variant="danger"
                size="sm"
                className="absolute top-2 right-2 rounded-full"
                onClick={removeBanner}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
              <div className="flex flex-col items-center">
                <Image className="h-10 w-10 text-gray-400 dark:text-gray-500 mb-2" />
                <p className="text-gray-500 dark:text-gray-400 mb-2">
                  Drag & drop a banner image or click to upload
                </p>
                <label htmlFor="banner-upload" className="cursor-pointer">
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-1" />
                    Upload Banner
                  </Button>
                  <input
                    id="banner-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleBannerUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="mb-6">
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a short description (max 200 characters)"
            maxLength={200}
            className="text-gray-800 dark:text-gray-200"
          />
          <p className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">
            {description.length}/200
          </p>
        </div>

        {/* Tags */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tags (up to 10)
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag, index) => (
              <div
                key={index}
                className="bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1 text-sm flex items-center"
              >
                <span className="text-gray-800 dark:text-gray-200">{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              onBlur={addTag}
              placeholder="Add tags (press Enter or comma to add)"
              disabled={tags.length >= 10}
              className="flex-grow"
            />
            <Button
              variant="outline"
              type="button"
              onClick={addTag}
              disabled={!tagInput.trim() || tags.length >= 10}
              className="ml-2"
            >
              Add
            </Button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {tags.length}/10 tags
          </p>
        </div>

        {/* Blog Properties */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={BLOG_CATEGORIES.map((cat) => ({
              value: cat,
              label: cat.charAt(0).toUpperCase() + cat.slice(1),
            }))}
          />

          <Select
            label="Visibility"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            options={[
              {
                value: BLOG_VISIBILITY.PUBLIC,
                label: "Public - Visible to everyone",
              },
              {
                value: BLOG_VISIBILITY.PRIVATE,
                label: "Private - Only visible to you",
              },
              {
                value: BLOG_VISIBILITY.FOLLOWERS_ONLY,
                label: "Followers Only",
              },
            ]}
          />

          <div className="flex items-center mt-8">
            <input
              type="checkbox"
              id="premium"
              checked={isPremium}
              onChange={(e) => setIsPremium(e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 rounded"
            />
            <label
              htmlFor="premium"
              className="ml-2 text-gray-700 dark:text-gray-300"
            >
              Premium Content
            </label>
          </div>
        </div>

        {/* Editor.js Container */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 min-h-[400px]">
          <div id="editor" className="prose dark:prose-invert max-w-none"></div>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;


// src/components/blog/BlogList.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import BlogCard from "./BlogCard";
import EmptyState from "../ui/EmptyState";
import Button from "../ui/Button";

const BlogList = ({
  blogs = [],
  loading = false,
  error = null,
  onLoadMore,
  hasMore = false,
  emptyTitle = "No blogs found",
  emptyDescription = "No blog posts were found matching your criteria.",
  emptyActionText,
  emptyActionLink,
  emptyActionClick,
  className = "",
}) => {
  const [renderedBlogs, setRenderedBlogs] = useState([]);

  // Update rendered blogs when blogs prop changes
  useEffect(() => {
    setRenderedBlogs(blogs);
  }, [blogs]);

  // Container variants for animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Individual item variants for animation
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (error) {
    return (
      <EmptyState
        title="Error loading blogs"
        description={
          error.message || "Something went wrong. Please try again later."
        }
        actionText="Try Again"
        actionClick={() => window.location.reload()}
        className={className}
      />
    );
  }

  if (!loading && renderedBlogs.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionText={emptyActionText}
        actionLink={emptyActionLink}
        actionClick={emptyActionClick}
        className={className}
      />
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {renderedBlogs.map((blog) => (
          <motion.div key={blog.blog_id} variants={itemVariants}>
            <BlogCard blog={blog} />
          </motion.div>
        ))}

        {/* Loading placeholders */}
        {loading &&
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 h-full"
            >
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mb-4"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mb-3 w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mb-4 w-5/6"></div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  <div>
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                    <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mt-1"></div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                  <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                  <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
      </motion.div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={loading}
            className="px-6"
          >
            {loading ? (
              <>
                <Loader className="animate-spin mr-2 h-4 w-4" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default BlogList;


// src/components/blog/CommentSection.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { commentService } from "../../services/commentService";
import { useNotification } from "../../context/NotificationContext";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import TextArea from "../ui/TextArea";
import { format } from "date-fns";
import { Reply, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CommentSection = ({ blogId, blogAuthorId }) => {
  const { currentUser } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState({});
  const [showReplies, setShowReplies] = useState({});
  const [loadingReplies, setLoadingReplies] = useState({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch comments when blog ID changes
  useEffect(() => {
    if (blogId) {
      fetchComments();
    }
  }, [blogId]);

  // Fetch comments
  const fetchComments = async (pageNum = 1, append = false) => {
    try {
      setLoading(true);
      const response = await commentService.getBlogComments(
        blogId,
        (pageNum - 1) * 5,
        5
      );

      if (append) {
        setComments((prev) => [...prev, ...response.data]);
      } else {
        setComments(response.data);
      }

      setHasMore(response.data.length === 5);
      setPage(pageNum);
    } catch (error) {
      console.error("Error fetching comments:", error);
      showToast("Failed to load comments", "error");
    } finally {
      setLoading(false);
    }
  };

  // Load more comments
  const loadMoreComments = () => {
    fetchComments(page + 1, true);
  };

  // Toggle replies visibility
  const toggleReplies = async (commentId) => {
    if (showReplies[commentId]) {
      setShowReplies((prev) => ({ ...prev, [commentId]: false }));
      return;
    }

    setLoadingReplies((prev) => ({ ...prev, [commentId]: true }));
    try {
      const response = await commentService.getCommentReplies(commentId);
      setExpandedReplies((prev) => ({
        ...prev,
        [commentId]: response.data.replies,
      }));
      setShowReplies((prev) => ({ ...prev, [commentId]: true }));
    } catch (error) {
      console.error("Error fetching replies:", error);
      showToast("Failed to load replies", "error");
    } finally {
      setLoadingReplies((prev) => ({ ...prev, [commentId]: false }));
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      navigate("/signin", { state: { from: location.pathname } });
      return;
    }

    if (!commentText.trim()) {
      showToast("Comment cannot be empty", "error");
      return;
    }

    // Check if we have the required blog ID
    if (!blogId) {
      showToast("Unable to add comment: Blog ID is missing", "error");
      return;
    }

    setSubmitting(true);
    try {
      // Send only the blog ID - the backend will find the author
      const response = await commentService.addComment({
        _id: blogId,
        comment: commentText,
        // Don't send blog_author at all - let the backend handle it
      });

      console.log("Comment added successfully:", response.data);
      setCommentText("");
      fetchComments(); // Refresh comments
      showToast("Comment added successfully", "success");
    } catch (error) {
      console.error("Error adding comment:", error);
      // Log detailed error info
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      const errorMessage =
        error.response?.data?.error || "Failed to add comment";
      showToast(errorMessage, "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Submit a reply to a comment
  const handleSubmitReply = async (e, commentId) => {
    e.preventDefault();

    if (!currentUser) {
      navigate("/signin", { state: { from: location.pathname } });
      return;
    }

    if (!replyText.trim()) {
      showToast("Reply cannot be empty", "error");
      return;
    }

    setSubmitting(true);
    try {
      await commentService.addComment({
        _id: blogId,
        comment: replyText,
        blog_author: blogAuthorId,
        replying_to: commentId,
      });

      setReplyText("");
      setReplyingTo(null);

      // Update replies for this comment
      const response = await commentService.getCommentReplies(commentId);
      setExpandedReplies((prev) => ({
        ...prev,
        [commentId]: response.data.replies,
      }));
      setShowReplies((prev) => ({ ...prev, [commentId]: true }));

      showToast("Reply added successfully", "success");
    } catch (error) {
      console.error("Error adding reply:", error);
      showToast(error.response?.data?.error || "Failed to add reply", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete comment
  const handleDeleteComment = async (
    commentId,
    isReply = false,
    parentId = null
  ) => {
    if (!confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      await commentService.deleteComment(commentId);

      if (isReply && parentId) {
        // Update the replies for this parent comment
        const response = await commentService.getCommentReplies(parentId);
        setExpandedReplies((prev) => ({
          ...prev,
          [parentId]: response.data.replies,
        }));
      } else {
        // Refresh all comments
        fetchComments();
      }

      showToast("Comment deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting comment:", error);
      showToast(
        error.response?.data?.error || "Failed to delete comment",
        "error"
      );
    }
  };

  // Format comment date
  const formatCommentDate = (date) => {
    return format(new Date(date), "MMM d, yyyy • h:mm a");
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
        Comments ({comments.length})
      </h3>

      {/* Comment Form */}
      {currentUser ? (
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <div className="flex items-start space-x-4">
            <Avatar
              src={currentUser.profile_img}
              alt={currentUser.fullname}
              size="md"
            />
            <TextArea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              rows={3}
              className="flex-1"
            />
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              disabled={submitting || !commentText.trim()}
              isLoading={submitting}
            >
              Post Comment
            </Button>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            Please sign in to join the conversation.
          </p>
          <Button variant="primary" href="/signin">
            Sign In
          </Button>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {loading && comments.length === 0 ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-10 w-10"></div>
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))
        ) : comments.length > 0 ? (
          <>
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="border-b border-gray-100 dark:border-gray-800 pb-6"
              >
                {/* Main Comment */}
                <div className="flex space-x-4">
                  <Avatar
                    src={comment.commented_by.personal_info.profile_img}
                    alt={comment.commented_by.personal_info.fullname}
                    size="md"
                    onClick={() =>
                      navigate(
                        `/profile/${comment.commented_by.personal_info.username}`
                      )
                    }
                    className="cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4
                          className="font-medium text-gray-900 dark:text-gray-100 cursor-pointer hover:text-primary-600 dark:hover:text-primary-400"
                          onClick={() =>
                            navigate(
                              `/profile/${comment.commented_by.personal_info.username}`
                            )
                          }
                        >
                          {comment.commented_by.personal_info.fullname}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatCommentDate(comment.commentedAt)}
                        </p>
                      </div>

                      {/* Delete button (if comment author or blog author) */}
                      {currentUser &&
                        (currentUser._id === comment.commented_by._id ||
                          currentUser._id === blogAuthorId) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteComment(comment._id)}
                            className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                    </div>

                    <p className="mt-2 text-gray-800 dark:text-gray-200">
                      {comment.comment}
                    </p>

                    {/* Reply button */}
                    {currentUser && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setReplyingTo(
                            replyingTo === comment._id ? null : comment._id
                          )
                        }
                        className="mt-2 text-gray-600 dark:text-gray-400"
                      >
                        <Reply className="h-4 w-4 mr-1" />
                        Reply
                      </Button>
                    )}

                    {/* Reply form */}
                    {replyingTo === comment._id && (
                      <form
                        onSubmit={(e) => handleSubmitReply(e, comment._id)}
                        className="mt-4 space-y-4"
                      >
                        <TextArea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={`Reply to ${comment.commented_by.personal_info.fullname}...`}
                          rows={2}
                        />
                        <div className="flex justify-end space-x-2">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText("");
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            variant="primary"
                            disabled={submitting || !replyText.trim()}
                            isLoading={submitting}
                          >
                            Reply
                          </Button>
                        </div>
                      </form>
                    )}

                    {/* Replies section */}
                    {comment.children && comment.children.length > 0 && (
                      <div className="mt-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleReplies(comment._id)}
                          disabled={loadingReplies[comment._id]}
                          className="text-gray-600 dark:text-gray-400"
                        >
                          {loadingReplies[comment._id] ? (
                            <span className="flex items-center">
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Loading replies...
                            </span>
                          ) : showReplies[comment._id] ? (
                            <span className="flex items-center">
                              <ChevronUp className="h-4 w-4 mr-1" />
                              Hide replies ({comment.children.length})
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <ChevronDown className="h-4 w-4 mr-1" />
                              Show replies ({comment.children.length})
                            </span>
                          )}
                        </Button>

                        {/* Replies list */}
                        {showReplies[comment._id] &&
                          expandedReplies[comment._id] && (
                            <div className="mt-4 pl-8 space-y-4 border-l-2 border-gray-100 dark:border-gray-800">
                              {expandedReplies[comment._id].map((reply) => (
                                <div key={reply._id} className="flex space-x-3">
                                  <Avatar
                                    src={
                                      reply.commented_by.personal_info
                                        .profile_img
                                    }
                                    alt={
                                      reply.commented_by.personal_info.fullname
                                    }
                                    size="sm"
                                    onClick={() =>
                                      navigate(
                                        `/profile/${reply.commented_by.personal_info.username}`
                                      )
                                    }
                                    className="cursor-pointer"
                                  />
                                  <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h5
                                          className="font-medium text-gray-900 dark:text-gray-100 text-sm cursor-pointer hover:text-primary-600 dark:hover:text-primary-400"
                                          onClick={() =>
                                            navigate(
                                              `/profile/${reply.commented_by.personal_info.username}`
                                            )
                                          }
                                        >
                                          {
                                            reply.commented_by.personal_info
                                              .fullname
                                          }
                                        </h5>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                          {formatCommentDate(reply.commentedAt)}
                                        </p>
                                      </div>

                                      {/* Delete reply button */}
                                      {currentUser &&
                                        (currentUser._id ===
                                          reply.commented_by._id ||
                                          currentUser._id === blogAuthorId) && (
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                              handleDeleteComment(
                                                reply._id,
                                                true,
                                                comment._id
                                              )
                                            }
                                            className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                                          >
                                            <Trash2 className="h-3 w-3" />
                                          </Button>
                                        )}
                                    </div>
                                    <p className="mt-1 text-gray-800 dark:text-gray-200 text-sm">
                                      {reply.comment}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Load more button */}
            {hasMore && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={loadMoreComments}
                  disabled={loading}
                  isLoading={loading}
                >
                  Load More Comments
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              No comments yet. Be the first to comment!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;

// src/components/blog/FeaturedBlogCard.jsx
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { motion } from "framer-motion";
import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";

const FeaturedBlogCard = ({ blog, className = "" }) => {
  const navigate = useNavigate();

  const handleBlogClick = () => {
    navigate(`/blog/${blog.blog_id}`);
  };

  const handleAuthorClick = (e) => {
    e.stopPropagation();
    navigate(`/profile/${blog.author.personal_info.username}`);
  };

  return (
    <motion.div
      className={`relative h-full overflow-hidden rounded-lg cursor-pointer ${className}`}
      whileHover={{ y: -5 }}
      onClick={handleBlogClick}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-black">
        {blog.banner ? (
          <img
            src={blog.banner}
            alt={blog.title}
            className="w-full h-full object-cover opacity-70"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary-800 to-secondary-800 opacity-90"></div>
        )}
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6 text-white">
        {/* Featured Badge */}
        <div className="absolute top-4 left-4">
          <Badge
            variant="accent"
            className="bg-accent-500 text-white px-3 py-1 uppercase text-xs tracking-wider"
          >
            Featured
          </Badge>
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-white/20 text-white hover:bg-white/30"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/tag/${tag}`);
                }}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-shadow">
          {blog.title}
        </h2>

        {/* Description */}
        {blog.des && (
          <p className="text-white/90 mb-4 line-clamp-2 text-shadow">
            {blog.des}
          </p>
        )}

        {/* Author & Date */}
        <div
          className="flex items-center gap-3 mt-4 cursor-pointer"
          onClick={handleAuthorClick}
        >
          <Avatar
            src={blog.author.personal_info.profile_img}
            alt={blog.author.personal_info.fullname}
            size="md"
            className="border-2 border-white"
          />
          <div>
            <p className="font-medium text-white">
              {blog.author.personal_info.fullname}
            </p>
            <p className="text-sm text-white/80">
              {format(new Date(blog.publishedAt), "MMM d, yyyy")} •{" "}
              {blog.estimated_read_time} min read
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FeaturedBlogCard;

// src/components/layouts/Footer.jsx
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container-custom py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1 lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 text-transparent bg-clip-text">
                ChronoSpace
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Your space for timeless content.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                aria-label="Twitter"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0.01 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                aria-label="GitHub"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                aria-label="Instagram"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/search"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Explore
                </Link>
              </li>
              <li>
                <Link
                  to="/search?tag=technology"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Technology
                </Link>
              </li>
              <li>
                <Link
                  to="/search?tag=programming"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Programming
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Guidelines
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="text-gray-600 dark:text-gray-400">
                <a
                  href="mailto:contact@chronospace.com"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  contact@chronospace.com
                </a>
              </li>
              <li className="text-gray-600 dark:text-gray-400">
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Request Feature
                </a>
              </li>
              <li className="text-gray-600 dark:text-gray-400">
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Report Bug
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            &copy; {currentYear} ChronoSpace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

// src/components/layouts/Header.jsx
import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useNotification } from "../../context/NotificationContext";
import {
  Sun,
  Moon,
  Menu,
  X,
  Search,
  Bell,
  Edit,
  User,
  LogOut,
  Settings,
  ChevronDown,
} from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentUser, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const { hasNewNotifications } = useNotification();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsProfileMenuOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = e.target.search.value.trim();
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      e.target.reset();
    }
  };

  // Toggle mobile menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Toggle profile dropdown menu, stopping event propagation
  const toggleProfileMenu = (e) => {
    e.stopPropagation();
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  // Header className based on scroll state
  const headerClass = `sticky top-0 z-50 w-full transition-all duration-300 ${
    scrolled
      ? "bg-white dark:bg-gray-900 shadow-md"
      : "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md"
  }`;

  return (
    <header className={headerClass}>
      <div className="container-custom mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 text-transparent bg-clip-text">
            ChronoSpace
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-primary-600 dark:text-primary-400 font-medium"
                : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/search"
            className={({ isActive }) =>
              isActive
                ? "text-primary-600 dark:text-primary-400 font-medium"
                : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
            }
          >
            Explore
          </NavLink>

          {/* Conditional links based on authentication */}
          {currentUser && (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive
                    ? "text-primary-600 dark:text-primary-400 font-medium"
                    : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                }
              >
                Dashboard
              </NavLink>

              {/* Show editor link for bloggers and admins */}
              {(currentUser.role === "blogger" ||
                currentUser.role === "admin") && (
                <NavLink
                  to="/editor"
                  className={({ isActive }) =>
                    isActive
                      ? "text-primary-600 dark:text-primary-400 font-medium"
                      : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                  }
                >
                  Write
                </NavLink>
              )}

              {/* Admin dashboard link */}
              {currentUser.role === "admin" && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    isActive
                      ? "text-primary-600 dark:text-primary-400 font-medium"
                      : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                  }
                >
                  Admin
                </NavLink>
              )}
            </>
          )}
        </nav>

        {/* Right Section: Search & User Actions */}
        <div className="flex items-center space-x-4">
          {/* Desktop Search */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center relative"
          >
            <input
              type="text"
              name="search"
              placeholder="Search blogs..."
              className="w-48 lg:w-64 px-4 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
            <button
              type="submit"
              className="absolute right-3 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
            >
              <Search size={18} />
            </button>
          </form>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* User Menu (when logged in) */}
          {currentUser ? (
            <div className="relative">
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <Link
                  to="/dashboard?tab=notifications"
                  className="relative p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label="Notifications"
                >
                  <Bell size={20} />
                  {hasNewNotifications && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                  )}
                </Link>

                {/* Write button (for bloggers and admins) */}
                {(currentUser.role === "blogger" ||
                  currentUser.role === "admin") && (
                  <Link
                    to="/editor"
                    className="hidden sm:flex items-center space-x-1 p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    aria-label="Create new blog"
                  >
                    <Edit size={20} />
                  </Link>
                )}

                {/* Profile Menu Trigger */}
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center space-x-2"
                  aria-label="User menu"
                >
                  <div className="relative w-9 h-9 overflow-hidden rounded-full border-2 border-gray-200 dark:border-gray-700">
                    <img
                      src={currentUser.profile_img}
                      alt={currentUser.fullname}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="hidden lg:block text-gray-700 dark:text-gray-300">
                    {currentUser.fullname}
                  </span>
                  <ChevronDown className="hidden lg:block w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Profile Dropdown Menu */}
              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link
                      to={`/profile/${currentUser.username}`}
                      className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                    <Link
                      to="/dashboard"
                      className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                      Dashboard
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                    {currentUser.role === "admin" && (
                      <Link
                        to="/admin"
                        className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                        Admin Panel
                      </Link>
                    )}
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                    <button
                      onClick={logout}
                      className="flex items-center w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/signin"
                className="hidden sm:block px-4 py-1.5 text-primary-600 dark:text-primary-400 border border-primary-600 dark:border-primary-500 rounded-lg text-sm hover:bg-primary-50 dark:hover:bg-primary-900 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-1.5 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white dark:bg-gray-900 shadow-md"
          >
            <div className="container-custom mx-auto px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center relative"
              >
                <input
                  type="text"
                  name="search"
                  placeholder="Search blogs..."
                  className="w-full px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
                <button
                  type="submit"
                  className="absolute right-3 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  <Search size={18} />
                </button>
              </form>

              {/* Mobile Navigation Links */}
              <nav className="flex flex-col space-y-3">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive
                      ? "text-primary-600 dark:text-primary-400 font-medium"
                      : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </NavLink>
                <NavLink
                  to="/search"
                  className={({ isActive }) =>
                    isActive
                      ? "text-primary-600 dark:text-primary-400 font-medium"
                      : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Explore
                </NavLink>

                {/* Conditional links based on authentication */}
                {currentUser ? (
                  <>
                    <NavLink
                      to="/dashboard"
                      className={({ isActive }) =>
                        isActive
                          ? "text-primary-600 dark:text-primary-400 font-medium"
                          : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                      }
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </NavLink>

                    <NavLink
                      to={`/profile/${currentUser.username}`}
                      className={({ isActive }) =>
                        isActive
                          ? "text-primary-600 dark:text-primary-400 font-medium"
                          : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                      }
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </NavLink>

                    <NavLink
                      to="/settings"
                      className={({ isActive }) =>
                        isActive
                          ? "text-primary-600 dark:text-primary-400 font-medium"
                          : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                      }
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Settings
                    </NavLink>

                    {/* Show editor link for bloggers and admins */}
                    {(currentUser.role === "blogger" ||
                      currentUser.role === "admin") && (
                      <NavLink
                        to="/editor"
                        className={({ isActive }) =>
                          isActive
                            ? "text-primary-600 dark:text-primary-400 font-medium"
                            : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                        }
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Write
                      </NavLink>
                    )}

                    {/* Admin dashboard link */}
                    {currentUser.role === "admin" && (
                      <NavLink
                        to="/admin"
                        className={({ isActive }) =>
                          isActive
                            ? "text-primary-600 dark:text-primary-400 font-medium"
                            : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                        }
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin
                      </NavLink>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="text-left text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-3 pt-2">
                    <Link
                      to="/signin"
                      className="px-4 py-2 text-center text-primary-600 dark:text-primary-400 border border-primary-600 dark:border-primary-500 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="px-4 py-2 text-center bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;

// src/components/layouts/MainLayout.jsx
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTop from "../ui/ScrollToTop";
import { useTheme } from "../../context/ThemeContext";

const MainLayout = () => {
  const { darkMode } = useTheme();

  // Update meta theme color based on dark mode
  useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", darkMode ? "#111827" : "#FFFFFF");
    }
  }, [darkMode]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <ScrollToTop />
      <Header />
      <main className="flex-grow container-custom py-6 sm:py-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;

// src/components/ui/Alert.jsx
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const Alert = ({
  title,
  children,
  variant = "info",
  onClose,
  className = "",
  ...props
}) => {
  // Define variant styles
  const variantStyles = {
    info: "bg-blue-50 text-blue-800 dark:bg-indigo-900/50 dark:text-blue-300",
    success:
      "bg-green-50 text-green-800 dark:bg-green-900/50 dark:text-green-300",
    warning:
      "bg-yellow-50 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
    error: "bg-red-50 text-red-800 dark:bg-red-900/50 dark:text-red-300",
  };

  // Define icon for each variant
  const variantIcon = {
    info: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
    ),
    success: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    ),
    warning: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    ),
    error: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
    ),
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`rounded-lg p-4 ${
          variantStyles[variant] || variantStyles.info
        } ${className}`}
        role="alert"
        {...props}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">{variantIcon[variant]}</div>
          <div className="ml-3 w-full">
            <div className="flex justify-between items-start">
              {title && <p className="text-sm font-medium">{title}</p>}
              {onClose && (
                <button
                  type="button"
                  className="inline-flex rounded-md text-current hover:bg-opacity-20 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-current"
                  onClick={onClose}
                >
                  <span className="sr-only">Close</span>
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            {children && <div className="mt-2 text-sm">{children}</div>}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Alert;

// src/components/ui/Avatar.jsx
const Avatar = ({ src, alt, size = "md", className = "", ...props }) => {
    // Define size styles
    const sizeStyles = {
      xs: "w-6 h-6",
      sm: "w-8 h-8",
      md: "w-10 h-10",
      lg: "w-12 h-12",
      xl: "w-16 h-16",
      "2xl": "w-20 h-20",
    };
  
    const initials = alt
      ? alt
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .substring(0, 2)
      : "U";
  
    if (!src) {
      return (
        <div
          className={`flex items-center justify-center rounded-full bg-primary-500 text-white font-medium ${
            sizeStyles[size] || sizeStyles.md
          } ${className}`}
          {...props}
        >
          {initials}
        </div>
      );
    }
  
    return (
      <img
        src={src}
        alt={alt}
        className={`rounded-full object-cover ${
          sizeStyles[size] || sizeStyles.md
        } ${className}`}
        {...props}
      />
    );
  };
  
  export default Avatar;

  // src/components/ui/Badge.jsx
const Badge = ({
    children,
    variant = "primary",
    size = "md",
    className = "",
    ...props
  }) => {
    // Define variant styles
    const variantStyles = {
      primary:
        "bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300",
      secondary:
        "bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-300",
      accent:
        "bg-accent-100 text-accent-800 dark:bg-accent-900 dark:text-accent-300",
      success:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      warning:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      danger: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      info: "bg-blue-100 text-blue-800 dark:bg-indigo-900 dark:text-blue-300",
    };
  
    // Define size styles
    const sizeStyles = {
      sm: "px-2 py-0.5 text-xs",
      md: "px-2.5 py-0.5 text-sm",
      lg: "px-3 py-1 text-base",
    };
  
    return (
      <span
        className={`inline-flex items-center font-medium rounded-full ${
          variantStyles[variant] || variantStyles.primary
        } ${sizeStyles[size] || sizeStyles.md} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  };
  
  export default Badge;

  // src/components/ui/Button.jsx
import { Link } from "react-router-dom";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  isLoading = false,
  type = "button",
  href,
  onClick,
  ...props
}) => {
  // Define base styles
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  // Define variant styles
  const variantStyles = {
    primary:
      "bg-primary hover:bg-primary-700 text-white focus:ring-primary-500",
    secondary:
      "bg-secondary hover:bg-secondary-600 text-white focus:ring-secondary-500",
    accent: "bg-accent hover:bg-accent-600 text-white focus:ring-accent-500",
    outline:
      "border border-primary text-primary hover:bg-primary-50 dark:hover:bg-primary-900 focus:ring-primary-500",
    ghost:
      "text-primary hover:bg-primary-50 dark:hover:bg-primary-900 focus:ring-primary-500",
    danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500",
  };

  // Define size styles
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  // Combine styles
  const buttonStyles = `
    ${baseStyles}
    ${variantStyles[variant] || variantStyles.primary}
    ${sizeStyles[size] || sizeStyles.md}
    ${disabled || isLoading ? "opacity-50 cursor-not-allowed" : ""}
    ${className}
  `;

  // If href is provided, render a Link component
  if (href) {
    return (
      <Link to={href} className={buttonStyles} {...props}>
        {isLoading ? (
          <span className="mr-2">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </span>
        ) : null}
        {children}
      </Link>
    );
  }

  // Otherwise, render a button
  return (
    <button
      type={type}
      className={buttonStyles}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <span className="mr-2">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </span>
      ) : null}
      {children}
    </button>
  );
};

export default Button;

// src/components/ui/Card.jsx
import { motion } from "framer-motion";

const Card = ({
  children,
  className = "",
  animate = false,
  onClick,
  ...props
}) => {
  const baseStyles =
    "bg-white dark:bg-gray-800 rounded-lg shadow-custom overflow-hidden";

  if (animate) {
    return (
      <motion.div
        className={`${baseStyles} ${className}`}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        whileTap={{ y: 0 }}
        onClick={onClick}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${baseStyles} ${className}`} onClick={onClick} {...props}>
      {children}
    </div>
  );
};

export default Card;

// src/components/ui/EmptyState.jsx
import { Link } from "react-router-dom";
import Button from "./Button";

const EmptyState = ({
  title,
  description,
  icon,
  actionText,
  actionLink,
  actionClick,
  className = "",
  ...props
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}
      {...props}
    >
      {icon && (
        <div className="text-gray-400 dark:text-gray-500 mb-4">{icon}</div>
      )}
      {title && (
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
          {description}
        </p>
      )}
      {actionText && actionLink && (
        <Button href={actionLink} variant="primary" size="md">
          {actionText}
        </Button>
      )}
      {actionText && actionClick && (
        <Button onClick={actionClick} variant="primary" size="md">
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;

// src/components/ui/Input.jsx
import { forwardRef } from "react";

const Input = forwardRef(
  (
    {
      label,
      name,
      type = "text",
      placeholder,
      error,
      className = "",
      required = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-4 py-2 rounded-lg border ${
            error
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 dark:border-gray-700 focus:ring-primary-500 focus:border-primary-500"
          } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;

// src/components/ui/LoadingScreen.jsx
import { motion } from "framer-motion";

const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="w-20 h-20 relative"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-500 rounded-full opacity-70"></div>
          <div className="absolute inset-2 bg-background-light dark:bg-background-dark rounded-full"></div>
          <div className="absolute inset-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"></div>
        </motion.div>
        <motion.h2
          className="mt-6 text-xl font-medium text-text-light dark:text-text-dark"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Loading...
        </motion.h2>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;

// src/components/ui/Modal.jsx
import { Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  className = "",
  showCloseButton = true,
  ...props
}) => {
  // Define size styles
  const sizeStyles = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-xl",
    xl: "max-w-2xl",
    "2xl": "max-w-4xl",
    full: "max-w-full mx-4",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Fragment>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full ${
                sizeStyles[size] || sizeStyles.md
              } bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden ${className}`}
              {...props}
            >
              {/* Header */}
              {title && (
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {title}
                  </h3>
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                      aria-label="Close"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              )}

              {/* Body */}
              <div className="px-6 py-4">{children}</div>
            </motion.div>
          </div>
        </Fragment>
      )}
    </AnimatePresence>
  );
};

export default Modal;


// src/components/ui/ScrollToTop.jsx
import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { pathname } = useLocation();

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 400) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Reset scroll position on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-primary-600 text-white rounded-full p-3 shadow-lg hover:bg-primary-700 focus:outline-none z-30"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;

// src/components/ui/Select.jsx
import { forwardRef } from "react";

const Select = forwardRef(
  (
    {
      label,
      name,
      options = [],
      placeholder,
      error,
      className = "",
      required = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={name}
          name={name}
          disabled={disabled}
          className={`w-full px-4 py-2 rounded-lg border ${
            error
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 dark:border-gray-700 focus:ring-primary-500 focus:border-primary-500"
          } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;

// src/components/ui/Tabs.jsx
import { useState } from "react";

const Tabs = ({
  tabs = [],
  defaultTab = 0,
  onChange,
  className = "",
  ...props
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (index) => {
    setActiveTab(index);
    if (onChange) {
      onChange(index);
    }
  };

  return (
    <div className={`${className}`} {...props}>
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => handleTabChange(index)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === index
                  ? "border-primary-500 text-primary-600 dark:text-primary-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-700"
              }`}
              aria-current={activeTab === index ? "page" : undefined}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-4">{tabs[activeTab]?.content}</div>
    </div>
  );
};

export default Tabs;

// src/components/ui/TextArea.jsx
import { forwardRef } from "react";

const TextArea = forwardRef(
  (
    {
      label,
      name,
      placeholder,
      error,
      className = "",
      required = false,
      disabled = false,
      rows = 4,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={name}
          name={name}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          className={`w-full px-4 py-2 rounded-lg border ${
            error
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 dark:border-gray-700 focus:ring-primary-500 focus:border-primary-500"
          } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";

export default TextArea;

// src/config/constants.js
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Code from "@editorjs/code";
import Image from "@editorjs/image";
import Embed from "@editorjs/embed";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";

// API URL - Change this to your backend URL
export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// User Roles
export const USER_ROLES = {
  USER: "user",
  BLOGGER: "blogger",
  ADMIN: "admin",
};

// User Account Status
export const ACCOUNT_STATUS = {
  ACTIVE: "active",
  SUSPENDED: "suspended",
  DELETED: "deleted",
};

// Blog Status
export const BLOG_STATUS = {
  PUBLISHED: "published",
  DRAFT: "draft",
  UNDER_REVIEW: "under_review",
  REJECTED: "rejected",
  ARCHIVED: "archived",
};

// Blog Visibility
export const BLOG_VISIBILITY = {
  PUBLIC: "public",
  PRIVATE: "private",
  FOLLOWERS_ONLY: "followers_only",
};

// Notification Types
export const NOTIFICATION_TYPES = {
  LIKE: "like",
  COMMENT: "comment",
  REPLY: "reply",
  FOLLOW: "follow",
  MENTION: "mention",
  BLOGGER_REQUEST: "blogger_request",
  BLOG_FEATURE: "blog_feature",
  ROLE_UPDATE: "role_update",
  BLOG_APPROVAL: "blog_approval",
  ACCOUNT_STATUS: "account_status",
  BLOG_PUBLISHED: "blog_published",
};

// Blogger Request Status
export const BLOGGER_REQUEST_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  BLOGS_PER_PAGE: 5,
  COMMENTS_PER_PAGE: 5,
  USERS_PER_PAGE: 10,
};

// Blog categories
export const BLOG_CATEGORIES = [
  "technology",
  "programming",
  "science",
  "health",
  "business",
  "lifestyle",
  "education",
  "entertainment",
  "travel",
  "food",
  "sports",
  "finance",
  "art",
  "personal",
  "politics",
  "other",
];

// Form validation
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_REGEX: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/,
  USERNAME_MIN_LENGTH: 3,
  BIO_MAX_LENGTH: 200,
};

// Editor.js tools configuration - FIXED
export const EDITOR_JS_TOOLS = {
  header: {
    class: Header,
    inlineToolbar: true,
    config: {
      levels: [1, 2, 3, 4],
      defaultLevel: 2,
    },
  },
  list: {
    class: List,
    inlineToolbar: true,
  },
  code: {
    class: Code,
  },
  image: {
    class: Image,
    config: {
      // The uploader will be provided separately in the BlogEditor component
      // Don't define it here, as it will be overridden
    },
  },
  embed: {
    class: Embed,
    inlineToolbar: true,
    config: {
      services: {
        youtube: true,
        codesandbox: true,
        codepen: true,
      },
    },
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
  },
  marker: {
    class: Marker,
    inlineToolbar: true,
  },
};

import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { signInWithGoogle } from "../services/firebase";
import { API_URL } from "../config/constants";
import { authService } from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          const userData = JSON.parse(localStorage.getItem("user"));
          if (userData) {
            setCurrentUser(userData);
          }
        } catch (error) {
          console.error("Auth initialization error:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          delete axios.defaults.headers.common["Authorization"];
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authService.login(email, password);
      const { access_token, ...user } = response.data;

      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(user));

      axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

      setCurrentUser(user);
      return user;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      const { user: googleUser, accessToken } = await signInWithGoogle();

      const response = await authService.googleAuth(accessToken);
      const { access_token, ...user } = response.data;

      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(user));

      axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

      setCurrentUser(user);
      return user;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    setCurrentUser(null);
    navigate("/");
  };

  const verifyEmail = async (token) => {
    try {
      setLoading(true);
      const response = await authService.verifyEmail(token);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const requestPasswordReset = async (email) => {
    try {
      setLoading(true);
      const response = await authService.requestPasswordReset(email);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, password) => {
    try {
      setLoading(true);
      const response = await authService.resetPassword(token, password);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUserData = (updatedData) => {
    const updatedUser = { ...currentUser, ...updatedData };
    setCurrentUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const value = {
    currentUser,
    loading,
    register,
    login,
    loginWithGoogle,
    logout,
    verifyEmail,
    requestPasswordReset,
    resetPassword,
    updateUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// src/context/NotificationContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthContext";
import { notificationService } from "../services/notificationService";
import toast from "react-hot-toast";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  // Check for new notifications when user is logged in
  useEffect(() => {
    if (!currentUser) return;

    const checkNewNotifications = async () => {
      try {
        const response = await notificationService.checkNewNotifications();
        setHasNewNotifications(response.data.new_notification_available);
      } catch (error) {
        console.error("Error checking new notifications:", error);
      }
    };

    // Check immediately
    checkNewNotifications();

    // Set up interval for checking (every 2 minutes)
    const intervalId = setInterval(checkNewNotifications, 2 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [currentUser]);

  // Fetch notifications (paginated)
  const fetchNotifications = async (page = 1, filter = "all", limit = 10) => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const response = await notificationService.getNotifications(
        page,
        filter,
        limit
      );

      if (page === 1) {
        setNotifications(response.data.notifications);
      } else {
        setNotifications((prev) => [...prev, ...response.data.notifications]);
      }

      // Count total notifications
      const countResponse = await notificationService.countNotifications(
        filter
      );
      setTotalNotifications(countResponse.data.totalDocs);

      // Reset new notifications flag after fetching
      setHasNewNotifications(false);

      return response.data.notifications;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!currentUser) return;

    try {
      await notificationService.markAllNotificationsRead();
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, seen: true }))
      );
      setHasNewNotifications(false);
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  // Delete a notification
  const deleteNotification = async (notificationId) => {
    if (!currentUser) return;

    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications((prev) =>
        prev.filter((notification) => notification._id !== notificationId)
      );
      setTotalNotifications((prev) => prev - 1);
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  // Show toast notification
  const showToast = (message, type = "success") => {
    if (type === "success") {
      toast.success(message);
    } else if (type === "error") {
      toast.error(message);
    } else {
      toast(message);
    }
  };

  const value = {
    notifications,
    hasNewNotifications,
    totalNotifications,
    loading,
    fetchNotifications,
    markAllAsRead,
    deleteNotification,
    showToast,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// src/context/ThemeContext.jsx
import { createContext, useState, useEffect, useContext } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
    } else {
      // Check system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setDarkMode(prefersDark);
    }
  }, []);

  // Update document classes when theme changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    // Save theme preference
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Toggle theme
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Set specific theme
  const setTheme = (isDark) => {
    setDarkMode(isDark);
  };

  const value = {
    darkMode,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// src/pages/admin/AdminBloggerApplicationsPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  ClipboardCheck,
  UserCheck,
  UserX,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  RefreshCw,
  Clock,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import { adminService } from "../../services/adminService";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import TextArea from "../../components/ui/TextArea";
import Avatar from "../../components/ui/Avatar";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import EmptyState from "../../components/ui/EmptyState";
import { BLOGGER_REQUEST_STATUS } from "../../config/constants";

const AdminBloggerApplicationsPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { showToast } = useNotification();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedApp, setExpandedApp] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [modalType, setModalType] = useState("");
  const [reviewNote, setReviewNote] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  // Check if user is admin
  const isAdmin = currentUser && currentUser.role === "admin";

  // Fetch applications
  useEffect(() => {
    if (!isAdmin) return;

    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await adminService.getPendingBloggerApplications(
          page,
          10
        );
        setApplications(response.data.requests);
        setTotalPages(response.data.total_pages);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching blogger applications:", error);
        setError("Failed to load blogger applications");
        setLoading(false);
      }
    };

    fetchApplications();
  }, [isAdmin, page]);

  // Toggle application details expansion
  const toggleApplicationExpand = (id) => {
    if (expandedApp === id) {
      setExpandedApp(null);
    } else {
      setExpandedApp(id);
    }
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Open approval modal
  const openApproveModal = (application) => {
    setModalData(application);
    setModalType("approve");
    setReviewNote(
      `Your application to become a blogger has been approved! Welcome to the ChronoSpace blogger community.`
    );
    setModalOpen(true);
  };

  // Open rejection modal
  const openRejectModal = (application) => {
    setModalData(application);
    setModalType("reject");
    setReviewNote(
      `Thank you for your interest in becoming a blogger on ChronoSpace. After reviewing your application, we've determined that it doesn't meet our current needs. We encourage you to continue engaging with our community and consider applying again in the future with more writing samples.`
    );
    setModalOpen(true);
  };

  // Handle application review submission
  const handleReviewSubmit = async () => {
    if (!modalData || !modalType) return;

    try {
      setReviewLoading(true);

      const status =
        modalType === "approve"
          ? BLOGGER_REQUEST_STATUS.APPROVED
          : BLOGGER_REQUEST_STATUS.REJECTED;

      await adminService.reviewBloggerApplication(
        modalData._id,
        status,
        reviewNote
      );

      // Remove the application from the list
      setApplications(applications.filter((app) => app._id !== modalData._id));

      // Show success message
      showToast(
        `Application ${
          modalType === "approve" ? "approved" : "rejected"
        } successfully`,
        "success"
      );

      // Close modal
      setModalOpen(false);
      setModalData(null);
      setReviewNote("");
    } catch (error) {
      console.error("Error reviewing application:", error);
      showToast("Failed to process application", "error");
    } finally {
      setReviewLoading(false);
    }
  };

  // Format date
  const formatDate = (date) => {
    return format(new Date(date), "MMM d, yyyy h:mm a");
  };

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

  return (
    <div className=" mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Blogger Applications
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Review and manage user applications to become bloggers
            </p>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>

            <Button variant="primary" href="/admin" size="sm">
              <svg
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Dashboard
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Card className="p-6">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start space-x-4">
                    <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : applications.length > 0 ? (
            <div className="space-y-6">
              {/* Applications List */}
              <div className="space-y-4">
                {applications.map((application) => (
                  <div
                    key={application._id}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      {/* Applicant Info */}
                      <div className="flex items-start space-x-4">
                        <Avatar
                          src={application.user.personal_info.profile_img}
                          alt={application.user.personal_info.fullname}
                          size="lg"
                          onClick={() =>
                            navigate(
                              `/profile/${application.user.personal_info.username}`
                            )
                          }
                          className="cursor-pointer"
                        />
                        <div>
                          <h3
                            className="font-bold text-gray-900 dark:text-white text-lg cursor-pointer hover:text-primary-600 dark:hover:text-primary-400"
                            onClick={() =>
                              navigate(
                                `/profile/${application.user.personal_info.username}`
                              )
                            }
                          >
                            {application.user.personal_info.fullname}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            @{application.user.personal_info.username}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <Clock className="h-4 w-4 inline-block mr-1" />
                            Applied {formatDate(application.createdAt)}
                          </p>

                          {/* Stats */}
                          <div className="flex space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                            <span>
                              {application.user.account_info.total_posts} posts
                            </span>
                            <span>
                              {application.user.account_info.total_reads} reads
                            </span>
                            <span>
                              {application.user.account_info.total_followers}{" "}
                              followers
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-row sm:flex-col gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => openApproveModal(application)}
                        >
                          <UserCheck className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openRejectModal(application)}
                        >
                          <UserX className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>

                    {/* Toggle Details Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleApplicationExpand(application._id)}
                      className="mt-4 w-full flex items-center justify-center text-gray-600 dark:text-gray-400"
                    >
                      {expandedApp === application._id ? (
                        <>
                          <ChevronUp className="h-4 w-4 mr-1" />
                          Hide Details
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4 mr-1" />
                          View Details
                        </>
                      )}
                    </Button>

                    {/* Application Details */}
                    {expandedApp === application._id && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          Application Reason:
                        </h4>
                        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md mb-4">
                          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                            {application.reason}
                          </p>
                        </div>

                        {application.writing_samples &&
                          application.writing_samples.length > 0 && (
                            <>
                              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                Writing Samples:
                              </h4>
                              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
                                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                                  {application.writing_samples.join("\n\n")}
                                </p>
                              </div>
                            </>
                          )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center pt-4">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 1}
                      onClick={() => handlePageChange(page - 1)}
                    >
                      Previous
                    </Button>

                    <div className="flex items-center px-4 py-1 text-sm text-gray-700 dark:text-gray-300">
                      Page {page} of {totalPages}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === totalPages}
                      onClick={() => handlePageChange(page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <EmptyState
              title="No Pending Applications"
              description="There are no blogger applications waiting for review."
              icon={<ClipboardCheck className="h-12 w-12 text-gray-400" />}
              actionText="Go to Dashboard"
              actionLink="/admin"
            />
          )}
        </Card>
      </motion.div>

      {/* Review Modal (Approve/Reject) */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          modalType === "approve" ? "Approve Application" : "Reject Application"
        }
        size="lg"
      >
        {modalData && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4 mb-4">
              <Avatar
                src={modalData.user.personal_info.profile_img}
                alt={modalData.user.personal_info.fullname}
                size="md"
              />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {modalData.user.personal_info.fullname}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  @{modalData.user.personal_info.username}
                </p>
              </div>
            </div>

            <TextArea
              label={
                modalType === "approve"
                  ? "Approval Notes (Optional)"
                  : "Rejection Reason"
              }
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              placeholder={
                modalType === "approve"
                  ? "Add any notes for the applicant (optional)"
                  : "Provide a reason for rejecting this application"
              }
              rows={4}
            />

            <p className="text-sm text-gray-500 dark:text-gray-400">
              {modalType === "approve"
                ? "This user will be granted blogger privileges and notified of their approval."
                : "This user will be notified that their application has been rejected."}
            </p>

            <div className="flex justify-end space-x-3 mt-2">
              <Button
                variant="ghost"
                onClick={() => setModalOpen(false)}
                disabled={reviewLoading}
              >
                Cancel
              </Button>
              <Button
                variant={modalType === "approve" ? "primary" : "danger"}
                onClick={handleReviewSubmit}
                disabled={modalType === "reject" && !reviewNote.trim()}
                isLoading={reviewLoading}
              >
                {modalType === "approve"
                  ? "Approve Application"
                  : "Reject Application"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminBloggerApplicationsPage;

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
                className="animate-pulse bg-white dark:bg-gray-800 rounded-lg shadow p-4"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="flex-1 space-y-2">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  </div>
                  <div className="flex flex-row sm:flex-col gap-2 mt-3 sm:mt-0">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
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
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { adminService } from "../../services/adminService";
import { format } from "date-fns";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Avatar from "../../components/ui/Avatar";
import EmptyState from "../../components/ui/EmptyState";

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

  if (loading) {
    return (
      <div className="mx-auto space-y-8 animate-pulse">
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
    <div className="mx-auto">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  Total Users
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats?.users?.total?.toLocaleString() || 0}
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
                  {stats?.users?.bloggers?.toLocaleString() || 0}
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Active</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {stats?.users?.active?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  Total Blogs
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats?.blogs?.total?.toLocaleString() || 0}
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
                  {stats?.blogs?.published?.toLocaleString() || 0}
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Drafts</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {stats?.blogs?.drafts?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  Total Comments
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats?.comments?.total?.toLocaleString() || 0}
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

          <Card className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  Pending Applications
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats?.applications?.pending?.toLocaleString() || 0}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                            {blog.activity?.total_reads?.toLocaleString() || 0}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Heart className="h-3 w-3 mr-1" />
                          <span>
                            {blog.activity?.total_likes?.toLocaleString() || 0}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          <span>
                            {blog.activity?.total_comments?.toLocaleString() ||
                              0}
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
                        {author.account_info?.total_reads?.toLocaleString() ||
                          0}{" "}
                        reads
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

// src/pages/admin/AdminUsersPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  User,
  Users,
  Shield,
  AlertCircle,
  CheckCircle,
  Edit,
  UserCheck,
  UserX,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import { adminService } from "../../services/adminService";
import { USER_ROLES, ACCOUNT_STATUS } from "../../config/constants";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Avatar from "../../components/ui/Avatar";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import EmptyState from "../../components/ui/EmptyState";
import Alert from "../../components/ui/Alert";

const AdminUsersPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { showToast } = useNotification();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    role: "all",
    status: "all",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState({});

  // Check if user is admin
  const isAdmin = currentUser && currentUser.role === "admin";

  // Fetch users data
  useEffect(() => {
    if (!isAdmin) return;

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await adminService.getAllUsers(
          page,
          10,
          search,
          filters.role,
          filters.status
        );

        setUsers(response.data.users);
        setTotalPages(response.data.total_pages);
        setTotalUsers(response.data.total);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load users");
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isAdmin, page, search, filters]);

  // Handle search input
  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(e.target.search.value);
    setPage(1);
  };

  // Handle filter change
  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPage(1);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      role: "all",
      status: "all",
    });
    setSearch("");
    setPage(1);
  };

  // Handle pagination
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "N/A";
    return format(new Date(date), "MMM d, yyyy");
  };

  // Get user role badge variant
  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case "admin":
        return "success";
      case "blogger":
        return "info";
      default:
        return "secondary";
    }
  };

  // Get user status badge variant
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "suspended":
        return "warning";
      case "deleted":
        return "danger";
      default:
        return "secondary";
    }
  };

  // Open action menu for a user
  const toggleActionMenu = (userId) => {
    setIsActionMenuOpen((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  // Close all action menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsActionMenuOpen({});
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Set selected user and open modal
  const handleEditRole = (user) => {
    setSelectedUser(user);
    setShowRoleModal(true);
    setIsActionMenuOpen({});
  };

  const handleEditStatus = (user) => {
    setSelectedUser(user);
    setShowStatusModal(true);
    setIsActionMenuOpen({});
  };

  // Update user role
  const updateUserRole = async (userId, role) => {
    try {
      setModalLoading(true);

      await adminService.updateUserRole(userId, role);

      // Update user in the list
      setUsers((prev) =>
        prev.map((user) => (user._id === userId ? { ...user, role } : user))
      );

      showToast("User role updated successfully", "success");
      setShowRoleModal(false);
    } catch (error) {
      console.error("Error updating role:", error);
      showToast(
        error.response?.data?.error || "Failed to update user role",
        "error"
      );
    } finally {
      setModalLoading(false);
    }
  };

  // Update user status
  const updateUserStatus = async (userId, status) => {
    try {
      setModalLoading(true);

      await adminService.updateAccountStatus(userId, status);

      // Update user in the list
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, account_status: status } : user
        )
      );

      showToast("User status updated successfully", "success");
      setShowStatusModal(false);
    } catch (error) {
      console.error("Error updating status:", error);
      showToast(
        error.response?.data?.error || "Failed to update user status",
        "error"
      );
    } finally {
      setModalLoading(false);
    }
  };

  // View user profile
  const viewUserProfile = (username) => {
    navigate(`/profile/${username}`);
  };

  // If not admin
  if (!isAdmin) {
    return (
      <EmptyState
        title="Access Denied"
        description="You need administrator privileges to access this page."
        actionText="Go to Home"
        actionLink="/"
        icon={<Shield className="h-12 w-12 text-red-500" />}
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
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/admin")}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Dashboard
              </Button>

              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                User Management
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage user accounts, roles, and permissions
            </p>
          </div>

          <div className="flex space-x-2">
            <form onSubmit={handleSearch} className="flex">
              <Input
                name="search"
                placeholder="Search users..."
                defaultValue={search}
                className="rounded-r-none"
                icon={<Search className="h-5 w-5 text-gray-400" />}
              />
              <Button
                type="submit"
                variant="primary"
                className="rounded-l-none"
              >
                Search
              </Button>
            </form>

            <Button
              variant="outline"
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  isFilterOpen: !prev.isFilterOpen,
                }))
              }
            >
              <Filter className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        {filters.isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Role"
                value={filters.role}
                onChange={(e) => handleFilterChange("role", e.target.value)}
                options={[
                  { value: "all", label: "All Roles" },
                  { value: "user", label: "User" },
                  { value: "blogger", label: "Blogger" },
                  { value: "admin", label: "Admin" },
                ]}
              />

              <Select
                label="Status"
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                options={[
                  { value: "all", label: "All Status" },
                  { value: "active", label: "Active" },
                  { value: "suspended", label: "Suspended" },
                  { value: "deleted", label: "Deleted" },
                ]}
              />

              <div className="flex items-end">
                <Button variant="ghost" onClick={clearFilters} size="sm">
                  Clear Filters
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Users List */}
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    User
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Role
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Joined
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {loading ? (
                  // Loading skeleton
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                          <div className="ml-4">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 mt-1"></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-8 ml-auto"></div>
                      </td>
                    </tr>
                  ))
                ) : users.length > 0 ? (
                  users.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Avatar
                            src={user.personal_info.profile_img}
                            alt={user.personal_info.fullname}
                            size="md"
                            className="cursor-pointer"
                            onClick={() =>
                              viewUserProfile(user.personal_info.username)
                            }
                          />
                          <div className="ml-4">
                            <div
                              className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer hover:text-primary-600 dark:hover:text-primary-400"
                              onClick={() =>
                                viewUserProfile(user.personal_info.username)
                              }
                            >
                              {user.personal_info.fullname}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              @{user.personal_info.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {user.personal_info.email}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {user.email_verified ? (
                            <span className="flex items-center text-green-600 dark:text-green-400">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </span>
                          ) : (
                            <span className="flex items-center text-yellow-600 dark:text-yellow-400">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Not verified
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant={getRoleBadgeVariant(user.role)}
                          className="capitalize"
                        >
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant={getStatusBadgeVariant(user.account_status)}
                          className="capitalize"
                        >
                          {user.account_status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {formatDate(user.joinedAt)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Last login: {formatDate(user.last_login)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleActionMenu(user._id);
                            }}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                          >
                            <MoreHorizontal className="h-5 w-5" />
                          </button>

                          {isActionMenuOpen[user._id] && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10">
                              <div
                                className="py-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  onClick={() =>
                                    viewUserProfile(user.personal_info.username)
                                  }
                                >
                                  <User className="h-4 w-4 mr-2" />
                                  View Profile
                                </button>
                                <button
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  onClick={() => handleEditRole(user)}
                                >
                                  <Shield className="h-4 w-4 mr-2" />
                                  Change Role
                                </button>
                                <button
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  onClick={() => handleEditStatus(user)}
                                >
                                  {user.account_status === "active" ? (
                                    <>
                                      <UserX className="h-4 w-4 mr-2" />
                                      Suspend Account
                                    </>
                                  ) : (
                                    <>
                                      <UserCheck className="h-4 w-4 mr-2" />
                                      Activate Account
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                    >
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {users.length > 0 && (
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing <span className="font-medium">{users.length}</span> of{" "}
                <span className="font-medium">{totalUsers}</span> users
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={page === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Edit Role Modal */}
      <Modal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        title="Change User Role"
        size="sm"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <Avatar
                src={selectedUser.personal_info.profile_img}
                alt={selectedUser.personal_info.fullname}
                size="md"
              />
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {selectedUser.personal_info.fullname}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  @{selectedUser.personal_info.username}
                </p>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400">
              Select a new role for this user:
            </p>

            <div className="grid grid-cols-1 gap-3">
              {Object.values(USER_ROLES).map((role) => (
                <div
                  key={role}
                  className={`p-4 border rounded-lg cursor-pointer ${
                    selectedUser.role === role
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => updateUserRole(selectedUser._id, role)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {role === "admin" ? (
                        <Shield className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                      ) : role === "blogger" ? (
                        <Edit className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                      ) : (
                        <User className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
                      )}
                      <span className="font-medium capitalize">{role}</span>
                    </div>
                    {selectedUser.role === role && (
                      <CheckCircle className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-7">
                    {role === "admin"
                      ? "Full access to all features and admin controls"
                      : role === "blogger"
                      ? "Can create and publish blog content"
                      : "Basic account with commenting privileges"}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="ghost"
                onClick={() => setShowRoleModal(false)}
                disabled={modalLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Status Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Change Account Status"
        size="sm"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <Avatar
                src={selectedUser.personal_info.profile_img}
                alt={selectedUser.personal_info.fullname}
                size="md"
              />
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {selectedUser.personal_info.fullname}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  @{selectedUser.personal_info.username}
                </p>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400">
              Select a new status for this account:
            </p>

            <div className="grid grid-cols-1 gap-3">
              {Object.values(ACCOUNT_STATUS).map((status) => (
                <div
                  key={status}
                  className={`p-4 border rounded-lg cursor-pointer ${
                    selectedUser.account_status === status
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => updateUserStatus(selectedUser._id, status)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {status === "active" ? (
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                      ) : status === "suspended" ? (
                        <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                      ) : (
                        <UserX className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                      )}
                      <span className="font-medium capitalize">{status}</span>
                    </div>
                    {selectedUser.account_status === status && (
                      <CheckCircle className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-7">
                    {status === "active"
                      ? "User has full access to the platform"
                      : status === "suspended"
                      ? "User is temporarily blocked from accessing the platform"
                      : "User account has been permanently deleted"}
                  </p>
                </div>
              ))}
            </div>

            <Alert variant="warning" className="mt-4">
              <p className="text-sm">
                {selectedUser.account_status === "active"
                  ? "Suspending or deleting an account will immediately revoke the user's access to the platform."
                  : "Activating this account will restore the user's access to the platform."}
              </p>
            </Alert>

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="ghost"
                onClick={() => setShowStatusModal(false)}
                disabled={modalLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminUsersPage;

// src/pages/auth/RequestPasswordResetPage.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import { Mail, ChevronLeft } from "lucide-react";

// Form validation schema
const requestResetSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const RequestPasswordResetPage = () => {
  const { requestPasswordReset, loading } = useAuth();
  const { showToast } = useNotification();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(requestResetSchema),
    defaultValues: {
      email: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setError(null);

      // Request password reset
      await requestPasswordReset(data.email);

      // Show success message
      setSuccess(true);
      showToast("Password reset email sent", "success");
    } catch (error) {
      console.error("Password reset request error:", error);
      setError(
        error.response?.data?.error ||
          "Failed to request password reset. Please try again later."
      );
    }
  };

  // If request successful, show success message
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full"
        >
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-indigo-900 mb-4">
              <svg
                className="h-6 w-6 text-blue-600 dark:text-blue-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Check Your Email
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              If an account exists with the email you provided, we've sent
              instructions on how to reset your password. Please check your
              inbox and spam folder.
            </p>
            <div className="space-y-3">
              <Button variant="primary" href="/signin" className="w-full">
                Return to Sign In
              </Button>
              <Button variant="outline" href="/" className="w-full">
                Return to Homepage
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full"
      >
        <div className="mb-6">
          <Link
            to="/"
            className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to home
          </Link>
        </div>

        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 text-transparent bg-clip-text">
              ChronoSpace
            </h1>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Reset Your Password
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Enter your email to receive a password reset link
          </p>
        </div>

        {/* Error alert */}
        {error && (
          <Alert
            variant="error"
            title="Request Error"
            onClose={() => setError(null)}
            className="mb-6"
          >
            {error}
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Input
              label="Email Address"
              {...register("email")}
              placeholder="john@example.com"
              type="email"
              error={errors.email?.message}
              required
              icon={<Mail className="h-5 w-5 text-gray-400" />}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
            isLoading={loading}
          >
            Send Reset Link
          </Button>
        </form>

        <p className="mt-8 text-center text-gray-600 dark:text-gray-400">
          Remember your password?{" "}
          <Link
            to="/signin"
            className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RequestPasswordResetPage;

// src/pages/auth/ResetPasswordPage.jsx
import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import { Eye, EyeOff, Lock, ChevronLeft } from "lucide-react";
import { VALIDATION } from "../../config/constants";

// Form validation schema
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(20, "Password must be less than 20 characters long")
      .regex(
        VALIDATION.PASSWORD_REGEX,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword, loading } = useAuth();
  const { showToast } = useNotification();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setError(null);

      // Reset password
      await resetPassword(token, data.password);

      // Show success message
      setSuccess(true);
      showToast("Password has been reset successfully", "success");
    } catch (error) {
      console.error("Password reset error:", error);
      setError(
        error.response?.data?.error ||
          "Password reset failed. The token may be invalid or expired."
      );
    }
  };

  // If reset successful, show success message
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full"
        >
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 mb-4">
              <svg
                className="h-6 w-6 text-green-600 dark:text-green-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Password Reset Successful
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Your password has been reset successfully. You can now sign in
              with your new password.
            </p>
            <div className="space-y-3">
              <Button variant="primary" href="/signin" className="w-full">
                Sign In
              </Button>
              <Button variant="outline" href="/" className="w-full">
                Return to Homepage
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full"
      >
        <div className="mb-6">
          <Link
            to="/"
            className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to home
          </Link>
        </div>

        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 text-transparent bg-clip-text">
              ChronoSpace
            </h1>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Reset Your Password
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Enter your new password below
          </p>
        </div>

        {/* Error alert */}
        {error && (
          <Alert
            variant="error"
            title="Password Reset Error"
            onClose={() => setError(null)}
            className="mb-6"
          >
            {error}
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Input
              label="New Password"
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              error={errors.password?.message}
              required
              icon={<Lock className="h-5 w-5 text-gray-400" />}
              appendIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              }
            />
          </div>

          <div>
            <Input
              label="Confirm New Password"
              {...register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              required
              icon={<Lock className="h-5 w-5 text-gray-400" />}
              appendIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              }
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
            isLoading={loading}
          >
            Reset Password
          </Button>
        </form>

        <p className="mt-8 text-center text-gray-600 dark:text-gray-400">
          Remember your password?{" "}
          <Link
            to="/signin"
            className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;

// src/pages/auth/SignInPage.jsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import { Eye, EyeOff, Mail, Lock, ChevronLeft } from "lucide-react";

// Form validation schema
const signinSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const SignInPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle, loading } = useAuth();
  const { showToast } = useNotification();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  // Get redirect path from location state
  const from = location.state?.from || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setError(null);

      // Sign in user
      await login(data.email, data.password);

      // Show success message and redirect
      showToast("Sign in successful!", "success");
      navigate(from);
    } catch (error) {
      console.error("Sign in error:", error);
      setError(
        error.response?.data?.error ||
          "Sign in failed. Please check your credentials and try again."
      );
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      setError(null);
      await loginWithGoogle();
      navigate(from);
    } catch (error) {
      console.error("Google login error:", error);
      setError(
        error.response?.data?.error || "Google login failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white dark:bg-gray-900">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-6">
            <Link
              to="/"
              className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to home
            </Link>
          </div>

          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 text-transparent bg-clip-text">
                ChronoSpace
              </h1>
            </Link>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome Back
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Sign in to your account
            </p>
          </div>

          {/* Error alert */}
          {error && (
            <Alert
              variant="error"
              title="Sign In Error"
              onClose={() => setError(null)}
              className="mb-6"
            >
              {error}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Input
                label="Email Address"
                {...register("email")}
                placeholder="john@example.com"
                type="email"
                error={errors.email?.message}
                required
                icon={<Mail className="h-5 w-5 text-gray-400" />}
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <Link
                  to="/request-password-reset"
                  className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="mt-1">
                <Input
                  {...register("password")}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  error={errors.password?.message}
                  icon={<Lock className="h-5 w-5 text-gray-400" />}
                  appendIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  }
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
              isLoading={loading}
            >
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
            <span className="flex-shrink mx-4 text-gray-600 dark:text-gray-400">
              or
            </span>
            <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
          </div>

          {/* Social login */}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
              <path fill="none" d="M1 1h22v22H1z" />
            </svg>
            Continue with Google
          </Button>

          <p className="mt-8 text-center text-gray-600 dark:text-gray-400">
            Don't have an account yet?{" "}
            <Link
              to="/signup"
              className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right side - Image/Info */}
      <div className="hidden md:flex md:flex-1 bg-gradient-to-br from-primary-600 to-secondary-600">
        <div className="w-full flex items-center justify-center p-12">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-md text-white"
          >
            <h2 className="text-3xl font-bold mb-6">Welcome to ChronoSpace</h2>
            <p className="text-lg mb-8">
              Your space for timeless content. Discover high-quality articles,
              share your thoughts, and connect with a community of passionate
              writers.
            </p>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-white font-medium">Discover Content</h3>
                  <p className="text-indigo-100">
                    Explore articles from our talented writers
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-white font-medium">
                    Join the Conversation
                  </h3>
                  <p className="text-indigo-100">
                    Engage with content through comments and likes
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-white font-medium">
                    Personalized Experience
                  </h3>
                  <p className="text-indigo-100">
                    Follow your favorite authors and topics
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;

// src/pages/auth/SignUpPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Check,
  ChevronLeft,
} from "lucide-react";
import { VALIDATION } from "../../config/constants";

// Form validation schema
const signupSchema = z
  .object({
    fullname: z
      .string()
      .min(3, "Full name must be at least 3 characters long")
      .max(50, "Full name must be less than 50 characters long"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(20, "Password must be less than 20 characters long")
      .regex(
        VALIDATION.PASSWORD_REGEX,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const SignUpPage = () => {
  const navigate = useNavigate();
  const { register: signup, loading, loginWithGoogle } = useAuth();
  const { showToast } = useNotification();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setError(null);

      // Register user
      const response = await signup({
        fullname: data.fullname,
        email: data.email,
        password: data.password,
      });

      // Show success message
      setSuccess(true);
      showToast(
        "Registration successful! Please check your email to verify your account.",
        "success"
      );

      // Clear form (not needed with success state redirect)
    } catch (error) {
      console.error("Registration error:", error);
      setError(
        error.response?.data?.error || "Registration failed. Please try again."
      );
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      setError(null);
      await loginWithGoogle();
      navigate("/");
    } catch (error) {
      console.error("Google login error:", error);
      setError(
        error.response?.data?.error || "Google login failed. Please try again."
      );
    }
  };

  // If registration successful, show verification message
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full"
        >
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 mb-4">
              <Check className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Registration Successful
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We've sent a verification link to your email address. Please check
              your inbox and verify your account.
            </p>
            <div className="space-y-3">
              <Button variant="primary" href="/signin" className="w-full">
                Proceed to Sign In
              </Button>
              <Button variant="outline" href="/" className="w-full">
                Return to Homepage
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white dark:bg-gray-900">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-6">
            <Link
              to="/"
              className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to home
            </Link>
          </div>

          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 text-transparent bg-clip-text">
                ChronoSpace
              </h1>
            </Link>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Create an Account
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Join our community of bloggers and readers
            </p>
          </div>

          {/* Error alert */}
          {error && (
            <Alert
              variant="error"
              title="Registration Error"
              onClose={() => setError(null)}
              className="mb-6"
            >
              {error}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Input
                label="Full Name"
                {...register("fullname")}
                placeholder="John Doe"
                error={errors.fullname?.message}
                required
                icon={<User className="h-5 w-5 text-gray-400" />}
              />
            </div>

            <div>
              <Input
                label="Email Address"
                {...register("email")}
                placeholder="john@example.com"
                type="email"
                error={errors.email?.message}
                required
                icon={<Mail className="h-5 w-5 text-gray-400" />}
              />
            </div>

            <div>
              <Input
                label="Password"
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                error={errors.password?.message}
                required
                icon={<Lock className="h-5 w-5 text-gray-400" />}
                appendIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                }
              />
            </div>

            <div>
              <Input
                label="Confirm Password"
                {...register("confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                required
                icon={<Lock className="h-5 w-5 text-gray-400" />}
                appendIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                }
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
              isLoading={loading}
            >
              Create Account
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
            <span className="flex-shrink mx-4 text-gray-600 dark:text-gray-400">
              or
            </span>
            <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
          </div>

          {/* Social login */}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
              <path fill="none" d="M1 1h22v22H1z" />
            </svg>
            Continue with Google
          </Button>

          <p className="mt-8 text-center text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right side - Image/Info */}
      <div className="hidden md:flex md:flex-1 bg-gradient-to-br from-primary-600 to-secondary-600">
        <div className="w-full flex items-center justify-center p-12">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-md text-white"
          >
            <h2 className="text-3xl font-bold mb-6">Join ChronoSpace</h2>
            <p className="text-lg mb-8">
              Create an account to unlock the full potential of ChronoSpace.
              Share your thoughts, follow your favorite writers, and become part
              of our growing community.
            </p>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-white font-medium">
                    Personalized Experience
                  </h3>
                  <p className="text-indigo-100">
                    Discover blogs tailored to your interests
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-white font-medium">
                    Engage with the Community
                  </h3>
                  <p className="text-indigo-100">
                    Comment, like, and share your favorite posts
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-white font-medium">Become a Blogger</h3>
                  <p className="text-indigo-100">
                    Share your knowledge and passion with the world
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;

// src/pages/auth/VerifyEmailPage.jsx
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import { CheckCircle, XCircle, Loader } from "lucide-react";

const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { verifyEmail } = useAuth();
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [error, setError] = useState(null);

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("error");
        setError("No verification token provided");
        return;
      }

      try {
        await verifyEmail(token);
        setStatus("success");
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
        setError(
          error.response?.data?.error ||
            "Email verification failed. The token may be invalid or expired."
        );
      }
    };

    verify();
  }, [token, verifyEmail]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full"
      >
        <div className="text-center">
          {status === "loading" ? (
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-indigo-900 mb-4">
              <Loader className="h-6 w-6 text-blue-600 dark:text-blue-300 animate-spin" />
            </div>
          ) : status === "success" ? (
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
          ) : (
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 mb-4">
              <XCircle className="h-6 w-6 text-red-600 dark:text-red-300" />
            </div>
          )}

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {status === "loading"
              ? "Verifying Your Email"
              : status === "success"
              ? "Email Verified Successfully"
              : "Verification Failed"}
          </h2>

          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {status === "loading"
              ? "Please wait while we verify your email address..."
              : status === "success"
              ? "Your email has been verified. You can now sign in to your account."
              : error}
          </p>

          {status !== "loading" && (
            <div className="space-y-3">
              {status === "success" ? (
                <Button variant="primary" href="/signin" className="w-full">
                  Sign In to Your Account
                </Button>
              ) : (
                <>
                  <Button variant="primary" href="/signup" className="w-full">
                    Try Signing Up Again
                  </Button>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    If you continue to face issues, please{" "}
                    <a
                      href="mailto:support@chronospace.com"
                      className="text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      contact support
                    </a>
                    .
                  </p>
                </>
              )}

              <Button variant="outline" href="/" className="w-full">
                Return to Homepage
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;

// src/pages/blog/BlogPage.jsx
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  Heart,
  MessageSquare,
  Eye,
  Share2,
  Bookmark,
  Edit,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
} from "lucide-react";
import EditorJS from "@editorjs/editorjs";
import { blogService } from "../../services/blogService";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import CommentSection from "../../components/blog/CommentSection";
import Avatar from "../../components/ui/Avatar";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Card from "../../components/ui/Card";
import { BLOG_VISIBILITY } from "../../config/constants";

const BlogPage = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { showToast } = useNotification();
  const editorRef = useRef(null);
  const editorContainerRef = useRef(null);
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [readingProgress, setReadingProgress] = useState(0);

  // Initialize Editor.js with proper error handling
  const initEditor = (content) => {
    try {
      // First, check if we need to destroy an existing editor
      if (
        editorRef.current &&
        typeof editorRef.current.destroy === "function"
      ) {
        editorRef.current.destroy();
        editorRef.current = null;
      }

      // Make sure the container exists in the DOM before initializing
      if (!editorContainerRef.current) {
        console.warn("Editor container not found in the DOM");
        return;
      }

      // Initialize the editor with a slight delay to ensure DOM is ready
      setTimeout(() => {
        try {
          editorRef.current = new EditorJS({
            holder: "editorjs-container",
            tools: {},
            data: content || {},
            readOnly: true,
            minHeight: 0,
          });
        } catch (err) {
          console.error("Error initializing editor:", err);
        }
      }, 100);
    } catch (error) {
      console.error("Error in initEditor:", error);
    }
  };

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

        // Wait for next render cycle before initializing editor
        setTimeout(() => {
          if (blogData.content) {
            initEditor(blogData.content);
          } else {
            console.warn("Blog content is missing or empty");
            initEditor({});
          }
        }, 0);

        // Check if user has liked this blog
        if (currentUser && blogData._id) {
          try {
            const likedResponse = await blogService.checkLikedByUser(
              blogData._id
            );
            setLiked(!!likedResponse.data.result);
          } catch (likeError) {
            console.error("Error checking like status:", likeError);
            // Continue execution even if like check fails
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
            // Continue execution even if related blogs fetch fails
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

    // Cleanup function
    return () => {
      if (
        editorRef.current &&
        typeof editorRef.current.destroy === "function"
      ) {
        try {
          editorRef.current.destroy();
          editorRef.current = null;
        } catch (error) {
          console.error("Error destroying editor:", error);
        }
      }
    };
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
    const title = blog?.title || "ChronoSpace Blog";

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
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          </div>
        </div>
        <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-4 bg-gray-200 dark:bg-gray-700 rounded"
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
        <Button variant="primary" href="/">
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
        <Button variant="primary" href="/">
          Return to Homepage
        </Button>
      </div>
    );
  }

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
          <Button variant="outline" href="/">
            Return to Homepage
          </Button>
        </div>
      </div>
    );
  }

  return (
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
                  onClick={() => navigate(`/search?category=${blog.category}`)}
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
                    href={`/editor/${blogId}`}
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

          {/* Blog content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="prose dark:prose-invert max-w-none"
          >
            <div id="editorjs-container" ref={editorContainerRef}></div>
          </motion.div>

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
              {/* Bookmark button (placeholder, functionality would be implemented in a full app) */}
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
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10">
                    <div className="py-1">
                      <button
                        onClick={() => handleShare("facebook")}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                      >
                        <Facebook className="h-4 w-4 mr-2" />
                        Share on Facebook
                      </button>
                      <button
                        onClick={() => handleShare("twitter")}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                      >
                        <Twitter className="h-4 w-4 mr-2" />
                        Share on Twitter
                      </button>
                      <button
                        onClick={() => handleShare("linkedin")}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                      >
                        <Linkedin className="h-4 w-4 mr-2" />
                        Share on LinkedIn
                      </button>
                      <button
                        onClick={() => handleShare("copy")}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                      >
                        <LinkIcon className="h-4 w-4 mr-2" />
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
                    {blog.author.personal_info.bio || `Writer at ChronoSpace`}
                  </p>

                  {currentUser && currentUser._id !== blog.author._id && (
                    <Button variant="primary" className="w-full">
                      Follow Author
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    className="w-full mt-2"
                    href={`/profile/${blog.author.personal_info.username}`}
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
                    Writer at ChronoSpace
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
                    animate
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
  );
};

export default BlogPage;

