// src/services/notificationService.js
import api from "./api";

export const notificationService = {
  // Check for new notifications
  checkNewNotifications: async () => {
    return api.get("/interactions/new-notifications");
  },

  // Get notifications (paginated)
  getNotifications: async (
    page = 1,
    filter = "all",
    limit = 10,
    deletedDocCount = 0
  ) => {
    return api.post("/interactions/notifications", {
      page,
      filter,
      limit,
      deletedDocCount,
    });
  },

  // Count total notifications
  countNotifications: async (filter = "all") => {
    return api.post("/interactions/all-notifications-count", { filter });
  },

  // Mark all notifications as read
  markAllNotificationsRead: async () => {
    return api.post("/interactions/mark-all-notifications-read");
  },

  // Delete a notification
  deleteNotification: async (notification_id) => {
    return api.post("/interactions/delete-notification", { notification_id });
  },
};
