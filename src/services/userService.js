import api from "./api";

export const userService = {
  getProfile: async (username) => {
    return api.post("/users/get-profile", { username });
  },

  updateProfileImage: async (url) => {
    return api.post("/users/update-profile-img", { url });
  },

  updateProfile: async (username, bio, social_links) => {
    return api.post("/users/update-profile", { username, bio, social_links });
  },

  followUser: async (userId) => {
    return api.post("/users/follow-user", { userId });
  },

  checkIsFollowing: async (userId) => {
    return api.post("/users/is-following", { userId });
  },

  getFollowers: async (userId, page = 1, limit = 10) => {
    return api.post("/users/get-followers", { userId, page, limit });
  },

  getFollowing: async (userId, page = 1, limit = 10) => {
    return api.post("/users/get-following", { userId, page, limit });
  },

  applyForBlogger: async (reason, writing_samples = []) => {
    return api.post("/users/apply-blogger", { reason, writing_samples });
  },

  checkBloggerApplicationStatus: async () => {
    return api.get("/users/blogger-application-status");
  },

  searchUsers: async (query, page = 1, limit = 10) => {
    return api.post("/users/search-users", { query, page, limit });
  },
};
