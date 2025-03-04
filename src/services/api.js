// src/services/api.js
import axios from "axios";
import { API_URL } from "../config/constants";

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
});

// Add request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for handling 401 unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 unauthorized (expired token)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

export default api;
