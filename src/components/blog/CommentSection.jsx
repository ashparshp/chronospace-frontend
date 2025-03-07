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
