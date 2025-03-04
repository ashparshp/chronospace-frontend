// src/services/adminService.js
import api from "./api";

export const adminService = {
  // Get all users (paginated)
  getAllUsers: async (
    page = 1,
    limit = 10,
    query = "",
    role = "all",
    status = "all"
  ) => {
    return api.get(
      `/admin/users?page=${page}&limit=${limit}&query=${query}&role=${role}&status=${status}`
    );
  },

  // Update user role
  updateUserRole: async (userId, role) => {
    return api.post("/admin/update-user-role", { userId, role });
  },

  // Update account status
  updateAccountStatus: async (userId, status) => {
    return api.post("/admin/update-account-status", { userId, status });
  },

  // Get all blogs (admin view)
  getAllBlogs: async (
    page = 1,
    limit = 10,
    query = "",
    status = "all",
    author = "",
    featured = "all"
  ) => {
    return api.get(
      `/admin/blogs?page=${page}&limit=${limit}&query=${query}&status=${status}&author=${author}&featured=${featured}`
    );
  },

  // Toggle featured status of a blog
  toggleFeatureBlog: async (blog_id) => {
    return api.post("/admin/toggle-feature-blog", { blog_id });
  },

  // Get pending blogger applications
  getPendingBloggerApplications: async (page = 1, limit = 10) => {
    return api.get(
      `/admin/pending-blogger-applications?page=${page}&limit=${limit}`
    );
  },

  // Review blogger application
  reviewBloggerApplication: async (request_id, status, review_notes = "") => {
    return api.post("/admin/review-blogger-application", {
      request_id,
      status,
      review_notes,
    });
  },

  // Get dashboard statistics
  getDashboardStats: async () => {
    return api.get("/admin/dashboard-stats");
  },
};
