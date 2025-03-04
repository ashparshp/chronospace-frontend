// src/pages/blog/EditorPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import { blogService } from "../../services/blogService";
import BlogEditor from "../../components/blog/BlogEditor";
import EmptyState from "../../components/ui/EmptyState";
import LoadingScreen from "../../components/ui/LoadingScreen";

const EditorPage = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { showToast } = useNotification();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(!!blogId);
  const [error, setError] = useState(null);

  // Fetch blog data for editing
  useEffect(() => {
    const fetchBlog = async () => {
      if (!blogId) return;

      try {
        setLoading(true);
        setError(null);

        const response = await blogService.getBlog(blogId, true, "edit");
        setBlog(response.data.blog);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching blog:", error);

        // Handle specific errors
        if (error.response?.status === 404) {
          setError("Blog not found");
        } else if (error.response?.status === 403) {
          setError("You are not authorized to edit this blog");
        } else {
          setError("Failed to load blog for editing");
        }

        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  // Check if user is blogger or admin
  const isAuthorized =
    currentUser &&
    (currentUser.role === "blogger" || currentUser.role === "admin");

  // If not authorized
  if (!isAuthorized) {
    return (
      <EmptyState
        title="Access Denied"
        description="You need to be a blogger to access the editor. Apply to become a blogger in your dashboard."
        actionText="Go to Dashboard"
        actionLink="/dashboard?tab=blogger-application"
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
    return <LoadingScreen />;
  }

  // Error state
  if (error) {
    return (
      <EmptyState
        title="Error"
        description={error}
        actionText="Go to Dashboard"
        actionLink="/dashboard"
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto"
    >
      <BlogEditor initialData={blog} isEdit={!!blogId} />
    </motion.div>
  );
};

export default EditorPage;
