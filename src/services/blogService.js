// src/services/blogService.js
import api from "./api";

export const blogService = {
  // Get a single blog post
  getBlog: async (blog_id, draft = false, mode = "") => {
    return api.post("/blogs/get-blog", { blog_id, draft, mode });
  },

  // Get latest blogs (paginated)
  getLatestBlogs: async (page = 1, limit = 5) => {
    return api.post("/blogs/latest-blogs", { page, limit });
  },

  // Get trending blogs
  getTrendingBlogs: async (limit = 5) => {
    return api.get(`/blogs/trending-blogs?limit=${limit}`);
  },

  // Get featured blogs
  getFeaturedBlogs: async (limit = 3) => {
    return api.get(`/blogs/featured-blogs?limit=${limit}`);
  },

  // Search blogs
  searchBlogs: async (params) => {
    return api.post("/blogs/search-blogs", params);
  },

  // Count search results
  countSearchBlogs: async (params) => {
    return api.post("/blogs/search-blogs-count", params);
  },

  // Like/unlike a blog
  toggleLikeBlog: async (_id, islikedByUser) => {
    return api.post("/blogs/like-blog", { _id, islikedByUser });
  },

  // Check if user has liked a blog
  checkLikedByUser: async (_id) => {
    return api.post("/blogs/isliked-by-user", { _id });
  },

  // Create or update a blog post
  createUpdateBlog: async (blogData) => {
    return api.post("/blogs/create-blog", blogData);
  },

  // Delete a blog post
  deleteBlog: async (blog_id) => {
    return api.post("/blogs/delete-blog", { blog_id });
  },

  // Get user's written blogs
  getUserBlogs: async (
    page = 1,
    draft = false,
    query = "",
    limit = 5,
    deletedDocCount = 0
  ) => {
    return api.post("/blogs/user-written-blogs", {
      page,
      draft,
      query,
      limit,
      deletedDocCount,
    });
  },

  // Count user's written blogs
  countUserBlogs: async (draft = false, query = "") => {
    return api.post("/blogs/user-written-blogs-count", { draft, query });
  },
};
