// src/services/authService.js
import api from "./api";

export const authService = {
  // Register new user
  register: async (userData) => {
    return api.post("/auth/signup", userData);
  },

  // Verify email with token
  verifyEmail: async (token) => {
    return api.post("/auth/verify-email", { token });
  },

  // Login with email and password
  login: async (email, password) => {
    return api.post("/auth/signin", { email, password });
  },

  // Authenticate with Google token
  googleAuth: async (access_token) => {
    return api.post("/auth/google-auth", { access_token });
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    return api.post("/auth/request-password-reset", { email });
  },

  // Reset password with token
  resetPassword: async (token, password) => {
    return api.post("/auth/reset-password", { token, password });
  },

  // Change password (authenticated)
  changePassword: async (currentPassword, newPassword) => {
    return api.post("/auth/change-password", { currentPassword, newPassword });
  },
};
