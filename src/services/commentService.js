import api from "./api";

export const commentService = {
  addComment: async (commentData) => {
    return api.post("/interactions/add-comment", commentData);
  },

  getBlogComments: async (blog_id, skip = 0, limit = 5) => {
    return api.post("/interactions/get-blog-comments", {
      blog_id,
      skip,
      limit,
    });
  },

  getCommentReplies: async (_id, skip = 0, limit = 5) => {
    return api.post("/interactions/get-replies", { _id, skip, limit });
  },

  deleteComment: async (_id) => {
    return api.post("/interactions/delete-comment", { _id });
  },
};
