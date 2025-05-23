import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Bell, Check, Settings } from "lucide-react";
import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

const NotificationDropdown = ({
  notifications = [],
  hasNewNotifications = false,
  onMarkAsRead,
  onMarkAllAsRead,
  fetchNotifications,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.seen).length;

  const handleClickOutside = useCallback((event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  const handleNotificationClick = (notification) => {
    if (!notification.seen && onMarkAsRead) {
      onMarkAsRead(notification._id);
    }
    navigate("/dashboard?tab=notifications");
    setIsOpen(false);
  };

  const handleDropdownToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (!isOpen && fetchNotifications) {
      fetchNotifications();
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "blog_comment":
        return <Badge variant="primary" className="text-sm mr-2">Comment</Badge>;
      case "follow":
        return <Badge variant="secondary" className="text-sm mr-2">Follow</Badge>;
      case "like":
        return <Badge variant="accent" className="text-sm mr-2">Like</Badge>;
      default:
        return <Badge variant="info" className="text-sm mr-2">Notice</Badge>;
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={handleDropdownToggle}
        className="relative p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-black transition-colors duration-200"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, type: "spring", stiffness: 500, damping: 30 }}
            className="absolute right-0 mt-2 w-80 bg-white dark:bg-black rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 overflow-hidden"
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/30 dark:to-secondary-900/30">
              <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={() => onMarkAllAsRead && onMarkAllAsRead()}
                    className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                    aria-label="Mark all as read"
                  >
                    <Check size={16} className="mr-1 inline-block" />
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => {
                    navigate("/dashboard?tab=notifications");
                    setIsOpen(false);
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <Settings size={16} />
                </button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                  {notifications.map((notification) => (
                    <motion.li
                      key={notification._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-black/50 transition-colors duration-200 ${
                        !notification.seen ? "bg-primary-50/50 dark:bg-primary-900/20" : ""
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start">
                        {notification.from?.profile_img ? (
                          <Avatar
                            src={notification.from.profile_img}
                            alt={notification.from.fullname || "User"}
                            size="sm"
                            className="mt-1"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white">
                            <Bell size={14} />
                          </div>
                        )}
                        <div className="ml-3 flex-1">
                          <div className="flex justify-between">
                            <div className="flex items-center">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <span className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-sm text-gray-800 mt-1">
                            {notification.message}
                          </p>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <div className="p-6 text-center">
                  <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <Bell size={24} className="text-gray-400" />
                  </div>
                  <p className="text-gray-500">No notifications yet</p>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-gray-100 text-center">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-primary-600"
                onClick={() => {
                  navigate("/dashboard?tab=notifications");
                  setIsOpen(false);
                }}
              >
                View All Notifications
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;
