import axios from "axios";
import { API_URL } from "../config/constants";

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to include token in requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Register new user
const register = async (userData) => {
  return await api.post("/auth/signup", userData);
};

// Verify email address
const verifyEmail = async (token) => {
  return await api.post("/auth/verify-email", { token });
};

// Support for direct link email verification
const verifyEmailGet = async (token) => {
  return await api.get(`/auth/verify-email/${token}`);
};

const verifyEmailPost = async (token) => {
  return await api.post("/auth/verify-email", { token });
};

// User login with email and password
const login = async (email, password) => {
  return await api.post("/auth/signin", { email, password });
};

// Google authentication
const googleAuth = async (accessToken) => {
  return await api.post("/auth/google-auth", { access_token: accessToken });
};

// Request password reset
const requestPasswordReset = async (email) => {
  return await api.post("/auth/request-password-reset", { email });
};

// Reset password with token
const resetPassword = async (token, password) => {
  return await api.post("/auth/reset-password", { token, password });
};

// Change password (authenticated)
const changePassword = async (currentPassword, newPassword) => {
  return await api.post("/auth/change-password", {
    currentPassword,
    newPassword,
  });
};

// Export all auth services
export const authService = {
  register,
  verifyEmail,
  verifyEmailGet,
  verifyEmailPost,
  login,
  googleAuth,
  requestPasswordReset,
  resetPassword,
  changePassword,
};

export default authService;
