import api from "./api";

export const notificationService = {
  checkNewNotifications: async () => {
    return api.get("/interactions/new-notifications");
  },

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

  countNotifications: async (filter = "all") => {
    return api.post("/interactions/all-notifications-count", { filter });
  },

  markAllNotificationsRead: async () => {
    return api.post("/interactions/mark-all-notifications-read");
  },

  deleteNotification: async (notification_id) => {
    return api.post("/interactions/delete-notification", { notification_id });
  },
};
