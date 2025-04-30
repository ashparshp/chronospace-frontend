import api from "./api";

export const adminService = {
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

  updateUserRole: async (userId, role) => {
    return api.post("/admin/update-user-role", { userId, role });
  },

  updateAccountStatus: async (userId, status) => {
    return api.post("/admin/update-account-status", { userId, status });
  },

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

  toggleFeatureBlog: async (blog_id) => {
    return api.post("/admin/toggle-feature-blog", { blog_id });
  },

  getPendingBloggerApplications: async (page = 1, limit = 10) => {
    return api.get(
      `/admin/pending-blogger-applications?page=${page}&limit=${limit}`
    );
  },

  reviewBloggerApplication: async (request_id, status, review_notes = "") => {
    return api.post("/admin/review-blogger-application", {
      request_id,
      status,
      review_notes,
    });
  },

  getDashboardStats: async () => {
    return api.get("/admin/dashboard-stats");
  },
};
