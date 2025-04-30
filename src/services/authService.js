import axios from "axios";
import { API_URL } from "../config/constants";

const api = axios.create({
  baseURL: API_URL,
});

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

const register = async (userData) => {
  return await api.post("/auth/signup", userData);
};

const verifyEmail = async (token) => {
  return await api.post("/auth/verify-email", { token });
};

const verifyEmailGet = async (token) => {
  return await api.get(`/auth/verify-email/${token}`);
};

const verifyEmailPost = async (token) => {
  return await api.post("/auth/verify-email", { token });
};

const login = async (email, password) => {
  return await api.post("/auth/signin", { email, password });
};

const googleAuth = async (accessToken) => {
  return await api.post("/auth/google-auth", { access_token: accessToken });
};

const requestPasswordReset = async (email) => {
  return await api.post("/auth/request-password-reset", { email });
};

const resetPassword = async (token, password) => {
  return await api.post("/auth/reset-password", { token, password });
};

const changePassword = async (currentPassword, newPassword) => {
  return await api.post("/auth/change-password", {
    currentPassword,
    newPassword,
  });
};

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
