// src/services/commentService.js
import api from "./api";

export const commentService = {
  // Add a comment to a blog
  addComment: async (commentData) => {
    return api.post("/interactions/add-comment", commentData);
  },

  // Get blog comments
  getBlogComments: async (blog_id, skip = 0, limit = 5) => {
    return api.post("/interactions/get-blog-comments", {
      blog_id,
      skip,
      limit,
    });
  },

  // Get replies to a comment
  getCommentReplies: async (_id, skip = 0, limit = 5) => {
    return api.post("/interactions/get-replies", { _id, skip, limit });
  },

  // Delete a comment
  deleteComment: async (_id) => {
    return api.post("/interactions/delete-comment", { _id });
  },
};
