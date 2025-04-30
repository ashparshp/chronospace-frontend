import api from "./api";

export const blogService = {
  getBlog: async (blog_id, draft = false, mode = "") => {
    return api.post("/blogs/get-blog", { blog_id, draft, mode });
  },

  getLatestBlogs: async (page = 1, limit = 5) => {
    return api.post("/blogs/latest-blogs", { page, limit });
  },

  getTrendingBlogs: async (limit = 5) => {
    return api.get(`/blogs/trending-blogs?limit=${limit}`);
  },

  getFeaturedBlogs: async (limit = 3) => {
    return api.get(`/blogs/featured-blogs?limit=${limit}`);
  },

  searchBlogs: async (params) => {
    return api.post("/blogs/search-blogs", params);
  },

  countSearchBlogs: async (params) => {
    return api.post("/blogs/search-blogs-count", params);
  },

  toggleLikeBlog: async (_id, islikedByUser) => {
    return api.post("/blogs/like-blog", { _id, islikedByUser });
  },

  checkLikedByUser: async (_id) => {
    return api.post("/blogs/isliked-by-user", { _id });
  },

  createUpdateBlog: async (blogData) => {
    return api.post("/blogs/create-blog", blogData);
  },

  deleteBlog: async (blog_id) => {
    return api.post("/blogs/delete-blog", { blog_id });
  },

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

  countUserBlogs: async (draft = false, query = "") => {
    return api.post("/blogs/user-written-blogs-count", { draft, query });
  },
};
