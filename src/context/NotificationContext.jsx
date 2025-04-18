// src/context/NotificationContext.js
import { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthContext";
import { notificationService } from "../services/notificationService";
import toast from "react-hot-toast";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  // Check for new notifications when user is logged in
  useEffect(() => {
    if (!currentUser) {
      setHasNewNotifications(false);
      return;
    }
    const checkNewNotifications = async () => {
      try {
        const response = await notificationService.checkNewNotifications();
        setHasNewNotifications(response.data.new_notification_available);
      } catch (error) {
        if (
          error.response?.status !== 401 &&
          error.response?.status !== 403
        ) {
          console.error("Error checking new notifications:", error);
        }
      }
    };

    // Check immediately and then at 2-minute intervals
    checkNewNotifications();
    const intervalId = setInterval(checkNewNotifications, 2 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [currentUser]);

  // Fetch notifications (paginated)
  const fetchNotifications = async (page = 1, filter = "all", limit = 10) => {
    if (!currentUser) return [];
    try {
      setLoading(true);
      const response = await notificationService.getNotifications(
        page,
        filter,
        limit
      );
      if (page === 1) {
        setNotifications(response.data.notifications);
      } else {
        setNotifications((prev) => [
          ...prev,
          ...response.data.notifications,
        ]);
      }
      // Count total notifications
      const countResponse = await notificationService.countNotifications(filter);
      setTotalNotifications(countResponse.data.totalDocs);
      // Reset new notifications flag after fetching
      setHasNewNotifications(false);
      return response.data.notifications;
    } catch (error) {
      if (
        error.response?.status !== 401 &&
        error.response?.status !== 403
      ) {
        console.error("Error fetching notifications:", error);
      }
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Automatically fetch notifications when user logs in
  useEffect(() => {
    if (currentUser) {
      fetchNotifications(1, "all", 10);
    }
  }, [currentUser]);

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!currentUser) return;
    try {
      await notificationService.markAllNotificationsRead();
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, seen: true }))
      );
      setHasNewNotifications(false);
      // Re-fetch to sync with server state
      await fetchNotifications(1, "all", 10);
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  // Mark a specific notification as read
  const markAsRead = async (notificationId) => {
    if (!currentUser) return;
    setNotifications((prev) =>
      prev.map((notification) =>
        notification._id === notificationId
          ? { ...notification, seen: true }
          : notification
      )
    );
  };

  // Delete a notification
  const deleteNotification = async (notificationId) => {
    if (!currentUser) return;
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications((prev) =>
        prev.filter((notification) => notification._id !== notificationId)
      );
      setTotalNotifications((prev) => prev - 1);
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  // Show toast notifications
  const showToast = (message, type = "success") => {
    if (type === "success") {
      toast.success(message);
    } else if (type === "error") {
      toast.error(message);
    } else {
      toast(message);
    }
  };

  const value = {
    notifications,
    hasNewNotifications,
    totalNotifications,
    loading,
    fetchNotifications,
    markAllAsRead,
    markAsRead,
    deleteNotification,
    showToast,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
