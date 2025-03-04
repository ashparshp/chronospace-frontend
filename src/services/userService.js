// src/services/userService.js
import api from "./api";

export const userService = {
  // Get user profile
  getProfile: async (username) => {
    return api.post("/users/get-profile", { username });
  },

  // Update profile image
  updateProfileImage: async (url) => {
    return api.post("/users/update-profile-img", { url });
  },

  // Update profile details
  updateProfile: async (username, bio, social_links) => {
    return api.post("/users/update-profile", { username, bio, social_links });
  },

  // Follow/unfollow a user
  followUser: async (userId) => {
    return api.post("/users/follow-user", { userId });
  },

  // Check if user is following another user
  checkIsFollowing: async (userId) => {
    return api.post("/users/is-following", { userId });
  },

  // Get user's followers
  getFollowers: async (userId, page = 1, limit = 10) => {
    return api.post("/users/get-followers", { userId, page, limit });
  },

  // Get user's following
  getFollowing: async (userId, page = 1, limit = 10) => {
    return api.post("/users/get-following", { userId, page, limit });
  },

  // Apply to become a blogger
  applyForBlogger: async (reason, writing_samples = []) => {
    return api.post("/users/apply-blogger", { reason, writing_samples });
  },

  // Check blogger application status
  checkBloggerApplicationStatus: async () => {
    return api.get("/users/blogger-application-status");
  },

  // Search for users
  searchUsers: async (query, page = 1, limit = 10) => {
    return api.post("/users/search-users", { query, page, limit });
  },
};
