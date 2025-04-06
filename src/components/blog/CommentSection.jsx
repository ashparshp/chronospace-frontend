// src/components/blog/CommentSection.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { commentService } from "../../services/commentService";
import { useNotification } from "../../context/NotificationContext";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import TextArea from "../ui/TextArea";
import { format } from "date-fns";
import {
  Reply,
  Trash2,
  ChevronDown,
  ChevronUp,
  Heart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DeleteConfirmationModal from "../ui/DeleteConfirmationModal";

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
  const [likedComments, setLikedComments] = useState({});

  // State for deletion modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // { commentId, isReply, parentId }

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

    if (!blogId) {
      showToast("Unable to add comment: Blog ID is missing", "error");
      return;
    }

    setSubmitting(true);
    try {
      const response = await commentService.addComment({
        _id: blogId,
        comment: commentText,
      });
      console.log("Comment added successfully:", response.data);
      setCommentText("");
      fetchComments();
      showToast("Comment added successfully", "success");
    } catch (error) {
      console.error("Error adding comment:", error);
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

      const response = await commentService.getCommentReplies(commentId);
      setExpandedReplies((prev) => ({
        ...prev,
        [commentId]: response.data.replies,
      }));
      setShowReplies((prev) => ({ ...prev, [commentId]: true }));
      showToast("Reply added successfully", "success");
    } catch (error) {
      console.error("Error adding reply:", error);
      showToast(
        error.response?.data?.error || "Failed to add reply",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Open delete modal when user clicks delete
  const confirmDelete = (commentId, isReply = false, parentId = null) => {
    setDeleteTarget({ commentId, isReply, parentId });
    setIsDeleteModalOpen(true);
  };

  // Handle the actual deletion after confirmation
  const handleDeleteCommentConfirmed = async () => {
    if (!deleteTarget) return;
    const { commentId, isReply, parentId } = deleteTarget;
    try {
      await commentService.deleteComment(commentId);

      if (isReply && parentId) {
        const response = await commentService.getCommentReplies(parentId);
        setExpandedReplies((prev) => ({
          ...prev,
          [parentId]: response.data.replies,
        }));
      } else {
        fetchComments();
      }

      showToast("Comment deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting comment:", error);
      showToast(
        error.response?.data?.error || "Failed to delete comment",
        "error"
      );
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
    }
  };

  // Cancel deletion
  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  // Like/unlike comment
  const handleLikeComment = (commentId) => {
    setLikedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  // Format comment date
  const formatCommentDate = (date) => {
    return format(new Date(date), "MMM d, yyyy • h:mm a");
  };

  // Animation variants
  const commentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.2 },
    },
  };

  const repliesVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
        <span className="mr-1">Comments</span>
        <span className="px-2 py-0.5 bg-gray-100 dark:bg-black rounded-full text-sm font-normal">
          {comments.length}
        </span>
      </h3>

      {/* Comment Form */}
      {currentUser ? (
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <div className="flex items-start space-x-4">
            <Avatar
              src={currentUser.profile_img}
              alt={currentUser.fullname}
              size="md"
              className="mt-2"
              animate
            />
            <TextArea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              rows={3}
              className="flex-1 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-gray-700"
              maxLength={1000}
              showCount
            />
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="gradient"
              disabled={submitting || !commentText.trim()}
              isLoading={submitting}
              className="px-6"
            >
              Post Comment
            </Button>
          </div>
        </form>
      ) : (
        <motion.div
          className="bg-gray-50 dark:bg-black rounded-xl p-6 text-center border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Please sign in to join the conversation.
          </p>
          <Button variant="gradient" href="/signin" className="px-8">
            Sign In
          </Button>
        </motion.div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {loading && comments.length === 0 ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-200 dark:bg-black h-10 w-10"></div>
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-gray-200 dark:bg-black rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-black rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-black rounded w-1/2"></div>
              </div>
            </div>
          ))
        ) : comments.length > 0 ? (
          <>
            {comments.map((comment, index) => (
              <motion.div
                key={comment._id}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={commentVariants}
                custom={index}
                className="border-b border-gray-100 dark:border-gray-800 pb-6"
                transition={{ delay: index * 0.1 }}
              >
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
                    className="cursor-pointer mt-1"
                    animate
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4
                          className="font-medium text-gray-900 dark:text-gray-100 cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
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
                      <div className="relative">
                        {currentUser &&
                          (currentUser._id === comment.commented_by._id ||
                            currentUser._id === blogAuthorId) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                confirmDelete(comment._id, false, null)
                              }
                              className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 p-1"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                      </div>
                    </div>
                    <div className="mt-2 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-black/50 p-3 rounded-lg">
                      {comment.comment}
                    </div>
                    <div className="mt-2 flex items-center space-x-4">
                      <button
                        onClick={() => handleLikeComment(comment._id)}
                        className={`flex items-center text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 ${
                          likedComments[comment._id]
                            ? "text-primary-600 dark:text-primary-400"
                            : ""
                        }`}
                      >
                        <Heart
                          className={`h-4 w-4 mr-1 ${
                            likedComments[comment._id] ? "fill-current" : ""
                          }`}
                        />
                        <span className="text-xs">Like</span>
                      </button>
                      {currentUser && (
                        <button
                          onClick={() =>
                            setReplyingTo(
                              replyingTo === comment._id ? null : comment._id
                            )
                          }
                          className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 flex items-center"
                        >
                          <Reply className="h-4 w-4 mr-1" />
                          <span className="text-xs">Reply</span>
                        </button>
                      )}
                    </div>
                    <AnimatePresence>
                      {replyingTo === comment._id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 space-y-4"
                        >
                          <form
                            onSubmit={(e) => handleSubmitReply(e, comment._id)}
                            className="ml-6 border-l-2 border-gray-100 dark:border-gray-800 pl-4"
                          >
                            <TextArea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder={`Reply to ${comment.commented_by.personal_info.fullname}...`}
                              rows={2}
                              className="bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-gray-700"
                            />
                            <div className="flex justify-end space-x-2 mt-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
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
                                size="sm"
                                disabled={submitting || !replyText.trim()}
                                isLoading={submitting}
                              >
                                Reply
                              </Button>
                            </div>
                          </form>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {comment.children && comment.children.length > 0 && (
                      <div className="mt-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleReplies(comment._id)}
                          disabled={loadingReplies[comment._id]}
                          className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
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
                        <AnimatePresence>
                          {showReplies[comment._id] &&
                            expandedReplies[comment._id] && (
                              <motion.div
                                key={`replies-${comment._id}`}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={repliesVariants}
                                className="mt-4 pl-8 space-y-4 border-l-2 border-gray-100 dark:border-gray-800"
                              >
                                {expandedReplies[comment._id].map(
                                  (reply, replyIndex) => (
                                    <motion.div
                                      key={reply._id}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{
                                        opacity: 1,
                                        x: 0,
                                        transition: {
                                          delay: replyIndex * 0.05,
                                        },
                                      }}
                                      className="flex space-x-3"
                                    >
                                      <Avatar
                                        src={
                                          reply.commented_by.personal_info
                                            .profile_img
                                        }
                                        alt={
                                          reply.commented_by.personal_info
                                            .fullname
                                        }
                                        size="sm"
                                        onClick={() =>
                                          navigate(
                                            `/profile/${reply.commented_by.personal_info.username}`
                                          )
                                        }
                                        className="cursor-pointer mt-1"
                                        animate
                                      />
                                      <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                          <div>
                                            <h5
                                              className="font-medium text-gray-900 dark:text-gray-100 text-sm cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
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
                                              {formatCommentDate(
                                                reply.commentedAt
                                              )}
                                            </p>
                                          </div>
                                          {currentUser &&
                                            (currentUser._id ===
                                              reply.commented_by._id ||
                                              currentUser._id === blogAuthorId) && (
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                  confirmDelete(
                                                    reply._id,
                                                    true,
                                                    comment._id
                                                  )
                                                }
                                                className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 p-1"
                                              >
                                                <Trash2 className="h-3 w-3" />
                                              </Button>
                                            )}
                                        </div>
                                        <div className="mt-1 text-gray-800 dark:text-gray-200 text-sm bg-gray-50 dark:bg-black/50 p-2 rounded-lg">
                                          {reply.comment}
                                        </div>
                                        <div className="mt-1 flex items-center space-x-3">
                                          <button
                                            onClick={() =>
                                              handleLikeComment(reply._id)
                                            }
                                            className={`flex items-center text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 text-xs ${
                                              likedComments[reply._id]
                                                ? "text-primary-600 dark:text-primary-400"
                                                : ""
                                            }`}
                                          >
                                            <Heart
                                              className={`h-3 w-3 mr-1 ${
                                                likedComments[reply._id]
                                                  ? "fill-current"
                                                  : ""
                                              }`}
                                            />
                                            Like
                                          </button>
                                        </div>
                                      </div>
                                    </motion.div>
                                  )
                                )}
                              </motion.div>
                            )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            {hasMore && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={loadMoreComments}
                  disabled={loading}
                  isLoading={loading}
                  className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-black shadow-sm"
                >
                  Load More Comments
                </Button>
              </div>
            )}
          </>
        ) : (
          <motion.div
            className="text-center py-12 bg-gray-50 dark:bg-black rounded-xl border border-gray-100 dark:border-gray-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <svg
              className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              No comments yet. Be the first to comment!
            </p>
          </motion.div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onConfirm={handleDeleteCommentConfirmed}
        onCancel={handleCancelDelete}
        message="Are you sure you want to delete this comment?"
      />
    </div>
  );
};

export default CommentSection;
