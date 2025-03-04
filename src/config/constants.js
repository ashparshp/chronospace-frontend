// src/config/constants.js
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Code from "@editorjs/code";
import Image from "@editorjs/image";
import Embed from "@editorjs/embed";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";

// API URL - Change this to your backend URL
export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// User Roles
export const USER_ROLES = {
  USER: "user",
  BLOGGER: "blogger",
  ADMIN: "admin",
};

// User Account Status
export const ACCOUNT_STATUS = {
  ACTIVE: "active",
  SUSPENDED: "suspended",
  DELETED: "deleted",
};

// Blog Status
export const BLOG_STATUS = {
  PUBLISHED: "published",
  DRAFT: "draft",
  UNDER_REVIEW: "under_review",
  REJECTED: "rejected",
  ARCHIVED: "archived",
};

// Blog Visibility
export const BLOG_VISIBILITY = {
  PUBLIC: "public",
  PRIVATE: "private",
  FOLLOWERS_ONLY: "followers_only",
};

// Notification Types
export const NOTIFICATION_TYPES = {
  LIKE: "like",
  COMMENT: "comment",
  REPLY: "reply",
  FOLLOW: "follow",
  MENTION: "mention",
  BLOGGER_REQUEST: "blogger_request",
  BLOG_FEATURE: "blog_feature",
  ROLE_UPDATE: "role_update",
  BLOG_APPROVAL: "blog_approval",
  ACCOUNT_STATUS: "account_status",
  BLOG_PUBLISHED: "blog_published",
};

// Blogger Request Status
export const BLOGGER_REQUEST_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  BLOGS_PER_PAGE: 5,
  COMMENTS_PER_PAGE: 5,
  USERS_PER_PAGE: 10,
};

// Blog categories
export const BLOG_CATEGORIES = [
  "technology",
  "programming",
  "science",
  "health",
  "business",
  "lifestyle",
  "education",
  "entertainment",
  "travel",
  "food",
  "sports",
  "finance",
  "art",
  "personal",
  "politics",
  "other",
];

// Form validation
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_REGEX: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/,
  USERNAME_MIN_LENGTH: 3,
  BIO_MAX_LENGTH: 200,
};

// Editor.js tools configuration - FIXED
export const EDITOR_JS_TOOLS = {
  header: {
    class: Header,
    inlineToolbar: true,
    config: {
      levels: [1, 2, 3, 4],
      defaultLevel: 2,
    },
  },
  list: {
    class: List,
    inlineToolbar: true,
  },
  code: {
    class: Code,
  },
  image: {
    class: Image,
    config: {
      // The uploader will be provided separately in the BlogEditor component
      // Don't define it here, as it will be overridden
    },
  },
  embed: {
    class: Embed,
    inlineToolbar: true,
    config: {
      services: {
        youtube: true,
        codesandbox: true,
        codepen: true,
      },
    },
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
  },
  marker: {
    class: Marker,
    inlineToolbar: true,
  },
};
