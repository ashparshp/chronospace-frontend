// src/components/layouts/Header.jsx
import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import {
  Menu,
  X,
  Search,
  Edit,
  User,
  LogOut,
  Settings,
  ChevronDown,
} from "lucide-react";

import NotificationDropdown from "../notifications/NotificationDropdown";
import ThemeToggle from "../ui/ThemeToggle";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isNavDropdownOpen, setIsNavDropdownOpen] = useState(false);
  const toggleNavDropdown = () => setIsNavDropdownOpen(!isNavDropdownOpen);
  const { currentUser, logout } = useAuth();
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    fetchNotifications,
    hasNewNotifications,
  } = useNotification();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setIsProfileMenuOpen(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = e.target.search.value.trim();
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      e.target.reset();
    }
  };

  // Toggle mobile menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Toggle profile dropdown menu (stopping event propagation)
  const toggleProfileMenu = (e) => {
    e.stopPropagation();
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  // Header className based on scroll state
  const headerClass = `sticky top-0 z-50 w-full transition-all duration-300 ${
    scrolled
      ? "bg-surface-light dark:bg-surface-dark shadow-md"
      : "glass-effect"
  }`;

  // Animation variants for nav items
  const navItemVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
      },
    }),
  };

  const linkHoverStyle =
    "relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary-600 dark:after:bg-primary-400 after:transition-all after:duration-300 hover:after:w-full";

  return (
    <header className={headerClass}>
      <div className="container-custom mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold bg-gradient-primary text-transparent bg-clip-text"
          >
            ChronoSpace
          </motion.span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center relative">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${linkHoverStyle} ${
                isActive
                  ? "text-primary-600 dark:text-primary-400 font-semibold"
                  : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
              } mr-6`
            }
          >
            Home
          </NavLink>
          <button
            onClick={toggleNavDropdown}
            className="md:inline-flex lg:hidden items-center gap-1 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
          >
            <span>Menu</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          <div
            className={`absolute right-0 top-full mt-2 w-56 rounded-lg bg-white dark:bg-zinc-900 shadow-xl border border-gray-200 dark:border-zinc-700 ${
              isNavDropdownOpen ? "block" : "hidden"
            } lg:hidden`}
          >
            <div className="flex flex-col space-y-2 px-4 py-2">
              {[
                { to: "/", label: "Home" },
                { to: "/search", label: "Explore" },
                ...(currentUser ? [{ to: "/dashboard", label: "Dashboard" }] : []),
                ...(currentUser &&
                (currentUser.role === "blogger" || currentUser.role === "admin")
                  ? [{ to: "/editor", label: "Write" }]
                  : []),
                ...(currentUser && currentUser.role === "admin"
                  ? [{ to: "/admin", label: "Admin" }]
                  : []),
              ]
                .slice(1)
                .map((item, i) => (
                  <motion.div
                    key={item.to}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={navItemVariants}
                    className="transition-colors duration-200 px-4 py-2"
                  >
                    <NavLink
                      to={item.to}
                      onClick={() => setIsNavDropdownOpen(false)}
                      className={({ isActive }) =>
                        `${linkHoverStyle} ${
                          isActive
                            ? "text-primary-600 dark:text-primary-400 font-semibold"
                            : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  </motion.div>
                ))}
            </div>
          </div>
          <div className="hidden lg:flex items-center space-x-8 px-6">
            {[
              { to: "/", label: "Home" },
              { to: "/search", label: "Explore" },
              ...(currentUser ? [{ to: "/dashboard", label: "Dashboard" }] : []),
              ...(currentUser &&
              (currentUser.role === "blogger" || currentUser.role === "admin")
                ? [{ to: "/editor", label: "Write" }]
                : []),
              ...(currentUser && currentUser.role === "admin"
                ? [{ to: "/admin", label: "Admin" }]
                : []),
            ]
              .slice(1)
              .map((item, i) => (
                <motion.div
                  key={item.to}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={navItemVariants}
                  className="transition-colors duration-200"
                >
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `${linkHoverStyle} ${
                        isActive
                          ? "text-primary-600 dark:text-primary-400 font-semibold"
                          : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </motion.div>
              ))}
          </div>
        </nav>

        {/* Right Section: Search & User Actions */}
        <div className="flex items-center space-x-4">
          {/* Desktop Search */}
          <motion.form
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center relative"
          >
            <input
              type="text"
              name="search"
              placeholder="Search blogs..."
              className="w-48 lg:w-64 px-4 py-1.5 rounded-full bg-gray-100 dark:bg-black text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm transition-all duration-300 border border-gray-300 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 focus:border-primary-400"
            />
            <button
              type="submit"
              className="absolute right-3 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
            >
              <Search size={18} />
            </button>
          </motion.form>
          {/* Theme Toggle */}
          <ThemeToggle.ThemeToggleMini />
          {/* User Menu (when logged in) */}
          {currentUser ? (
            <motion.div
              className="relative flex items-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              {/* Notification Dropdown */}
              <NotificationDropdown
                notifications={notifications || []}
                hasNewNotifications={hasNewNotifications}
                onMarkAsRead={markAsRead}
                onMarkAllAsRead={markAllAsRead}
                fetchNotifications={fetchNotifications}
              />

              {/* Write button (for bloggers and admins) */}
              {(currentUser.role === "blogger" ||
                currentUser.role === "admin") && (
                <Link
                  to="/editor"
                  className="hidden sm:flex items-center space-x-1 p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-black transition-colors duration-200"
                  aria-label="Create new blog"
                >
                  <Edit size={20} />
                </Link>
              )}

              {/* Profile Menu Trigger */}
              <motion.button
                onClick={toggleProfileMenu}
                className="flex items-center space-x-2"
                aria-label="User menu"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative w-9 h-9 overflow-hidden rounded-full border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-400 transition-colors duration-300">
                  <img
                    src={currentUser.profile_img}
                    alt={currentUser.fullname}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="hidden lg:block text-gray-700 dark:text-gray-300 font-medium">
                  {currentUser.fullname}
                </span>
                <ChevronDown className="hidden lg:block w-4 h-4 text-gray-500 dark:text-gray-400" />
              </motion.button>

              {/* Profile Dropdown Menu */}
              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{
                      duration: 0.2,
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                    className="absolute right-0 mt-60 w-48 bg-white dark:bg-black rounded-xl shadow-custom overflow-hidden border border-gray-100 dark:border-gray-700 py-1 z-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {[
                      {
                        to: `/profile/${currentUser.username}`,
                        icon: <User className="w-4 h-4 mr-2" />,
                        label: "Profile",
                      },
                      {
                        to: "/dashboard",
                        icon: (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                          </svg>
                        ),
                        label: "Dashboard",
                      },
                      {
                        to: "/settings",
                        icon: <Settings className="w-4 h-4 mr-2" />,
                        label: "Settings",
                      },
                      ...(currentUser.role === "admin"
                        ? [
                            {
                              to: "/admin",
                              icon: (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-4 h-4 mr-2"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                  />
                                </svg>
                              ),
                              label: "Admin Panel",
                            },
                          ]
                        : []),
                    ].map((item, i) => (
                      <motion.div
                        key={item.to}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{
                          opacity: 1,
                          x: 0,
                          transition: { delay: i * 0.05 },
                        }}
                      >
                        <Link
                          to={item.to}
                          className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-black transition-colors duration-200"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          {item.icon}
                          {item.label}
                        </Link>
                      </motion.div>
                    ))}

                    <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                    <motion.button
                      initial={{ opacity: 0, x: -10 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        transition: { delay: 0.2 },
                      }}
                      onClick={logout}
                      className="flex items-center w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-black transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Link
                to="/signin"
                className="hidden sm:block px-4 py-1.5 text-primary-600 dark:text-primary-400 border border-primary-600 dark:border-primary-500 rounded-lg text-sm hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-all duration-300"
              >
                Sign In
              </Link>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/signup"
                  className="px-4 py-1.5 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg text-sm hover:from-primary-700 hover:to-accent-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Get Started
                </Link>
              </motion.div>
            </motion.div>
          )}
          {/* Mobile Menu Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-black transition-colors duration-200"
            aria-label="Menu"
            whileTap={{ scale: 0.9 }}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-white dark:bg-black shadow-md border-t border-gray-100 dark:border-gray-800"
          >
            <div className="container-custom mx-auto px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center relative"
              >
                <input
                  type="text"
                  name="search"
                  placeholder="Search blogs..."
                  className="w-full px-4 py-2 rounded-full bg-gray-100 dark:bg-black text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm transition-all duration-300 border border-transparent focus:border-primary-400"
                />
                <button
                  type="submit"
                  className="absolute right-3 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                >
                  <Search size={18} />
                </button>
              </form>

              {/* Mobile Navigation Links */}
              <nav className="flex flex-col space-y-3">
                {[
                  { to: "/", label: "Home" },
                  { to: "/search", label: "Explore" },
                  ...(currentUser
                    ? [
                        { to: "/dashboard", label: "Dashboard" },
                        {
                          to: `/profile/${currentUser.username}`,
                          label: "Profile",
                        },
                        { to: "/settings", label: "Settings" },
                        ...(currentUser.role === "blogger" ||
                        currentUser.role === "admin"
                          ? [{ to: "/editor", label: "Write" }]
                          : []),
                        ...(currentUser.role === "admin"
                          ? [{ to: "/admin", label: "Admin" }]
                          : []),
                      ]
                    : []),
                ].map((item, i) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      transition: { delay: i * 0.05 },
                    }}
                  >
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        isActive
                          ? "text-primary-600 dark:text-primary-400 font-medium flex items-center"
                          : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 flex items-center"
                      }
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </NavLink>
                  </motion.div>
                ))}

                {currentUser ? (
                  <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      transition: { delay: 0.25 },
                    }}
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="text-left text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200 flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </motion.button>
                ) : (
                  <div className="flex flex-col space-y-3 pt-2">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Link
                        to="/signin"
                        className="px-4 py-2 text-center text-primary-600 dark:text-primary-400 border border-primary-600 dark:border-primary-500 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors duration-300 block"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Link
                        to="/signup"
                        className="px-4 py-2 text-center bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg hover:from-primary-700 hover:to-accent-700 transition-all duration-300 shadow-md block"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Get Started
                      </Link>
                    </motion.div>
                  </div>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
