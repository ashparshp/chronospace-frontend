import { useState, useEffect, useRef } from "react";
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
  Bell,
  Moon,
  Sun,
  TrendingUp,
  BookOpen,
  Home,
  Compass,
  LayoutDashboard,
  Shield,
  PenLine,
} from "lucide-react";

import NotificationDropdown from "../notifications/NotificationDropdown";
import ThemeToggle from "../ui/ThemeToggle";
import Button from "../ui/Button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isNavDropdownOpen, setIsNavDropdownOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const navDropdownRef = useRef(null);

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
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
      if (
        navDropdownRef.current &&
        !navDropdownRef.current.contains(event.target)
      ) {
        setIsNavDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
      ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-md border-b border-gray-200 dark:border-gray-800"
      : "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
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

  // Get icon component for navigation items
  const getNavIcon = (label) => {
    switch (label.toLowerCase()) {
      case "home":
        return <Home className="w-5 h-5 mr-2" />;
      case "explore":
        return <Compass className="w-5 h-5 mr-2" />;
      case "dashboard":
        return <LayoutDashboard className="w-5 h-5 mr-2" />;
      case "write":
        return <PenLine className="w-5 h-5 mr-2" />;
      case "admin":
        return <Shield className="w-5 h-5 mr-2" />;
      default:
        return null;
    }
  };

  return (
    <header className={headerClass}>
      <div className="container-custom mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="font-playfair text-2xl font-bold"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">
              ChronoSpace
            </span>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center relative">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `relative px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? "text-violet-600 dark:text-violet-400 font-medium bg-violet-50 dark:bg-violet-900/20"
                  : "text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              } mr-2`
            }
          >
            Home
          </NavLink>
          <div className="relative" ref={navDropdownRef}>
            <button
              onClick={toggleNavDropdown}
              className="md:inline-flex lg:hidden items-center gap-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm"
            >
              <span>Menu</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {isNavDropdownOpen && (
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
                className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
              >
                <div className="flex flex-col space-y-1 p-2">
                  {[
                    {
                      to: "/search",
                      label: "Explore",
                      icon: <Compass className="w-4 h-4 mr-2" />,
                    },
                    ...(currentUser
                      ? [
                          {
                            to: "/dashboard",
                            label: "Dashboard",
                            icon: <LayoutDashboard className="w-4 h-4 mr-2" />,
                          },
                        ]
                      : []),
                    ...(currentUser &&
                    (currentUser.role === "blogger" ||
                      currentUser.role === "admin")
                      ? [
                          {
                            to: "/editor",
                            label: "Write",
                            icon: <PenLine className="w-4 h-4 mr-2" />,
                          },
                        ]
                      : []),
                    ...(currentUser && currentUser.role === "admin"
                      ? [
                          {
                            to: "/admin",
                            label: "Admin",
                            icon: <Shield className="w-4 h-4 mr-2" />,
                          },
                        ]
                      : []),
                  ].map((item, i) => (
                    <motion.div
                      key={item.to}
                      custom={i}
                      initial="hidden"
                      animate="visible"
                      variants={navItemVariants}
                    >
                      <NavLink
                        to={item.to}
                        onClick={() => setIsNavDropdownOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                            isActive
                              ? "text-violet-600 dark:text-violet-400 font-medium bg-violet-50 dark:bg-violet-900/20"
                              : "text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                          }`
                        }
                      >
                        {item.icon}
                        {item.label}
                      </NavLink>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
          <div className="hidden lg:flex items-center space-x-1">
            {[
              {
                to: "/search",
                label: "Explore",
                icon: <Compass className="w-4 h-4 mr-1.5" />,
              },
              ...(currentUser
                ? [
                    {
                      to: "/dashboard",
                      label: "Dashboard",
                      icon: <LayoutDashboard className="w-4 h-4 mr-1.5" />,
                    },
                  ]
                : []),
              ...(currentUser &&
              (currentUser.role === "blogger" || currentUser.role === "admin")
                ? [
                    {
                      to: "/editor",
                      label: "Write",
                      icon: <PenLine className="w-4 h-4 mr-1.5" />,
                    },
                  ]
                : []),
              ...(currentUser && currentUser.role === "admin"
                ? [
                    {
                      to: "/admin",
                      label: "Admin",
                      icon: <Shield className="w-4 h-4 mr-1.5" />,
                    },
                  ]
                : []),
            ].map((item, i) => (
              <motion.div
                key={item.to}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={navItemVariants}
              >
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "text-violet-600 dark:text-violet-400 font-medium bg-violet-50 dark:bg-violet-900/20"
                        : "text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    }`
                  }
                >
                  {item.icon}
                  <span className="font-montserrat">{item.label}</span>
                </NavLink>
              </motion.div>
            ))}
          </div>
        </nav>

        {/* Right Section: Search & User Actions */}
        <div className="flex items-center space-x-3">
          {/* Desktop Search */}
          <motion.form
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center relative"
          >
            <div className="relative">
              <input
                type="text"
                name="search"
                placeholder="Search blogs..."
                className="w-48 lg:w-64 px-4 py-2 pl-10 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500/50 text-sm transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-600 focus:border-violet-400 shadow-sm"
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400"
                size={16}
              />
            </div>
            <button
              type="submit"
              className="absolute right-3 top-2.5 text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </motion.form>

          {/* Theme Toggle */}
          <div className="hidden sm:block">
            <ThemeToggle.ThemeToggleMini />
          </div>

          {/* User Menu (when logged in) */}
          {currentUser ? (
            <motion.div
              className="relative flex items-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              ref={profileMenuRef}
            >
              {/* Notification Dropdown */}
              <div className="relative">
                <NotificationDropdown
                  notifications={notifications || []}
                  hasNewNotifications={hasNewNotifications}
                  onMarkAsRead={markAsRead}
                  onMarkAllAsRead={markAllAsRead}
                  fetchNotifications={fetchNotifications}
                />
              </div>

              {/* Write button (for bloggers and admins) */}
              {(currentUser.role === "blogger" ||
                currentUser.role === "admin") && (
                <Link
                  to="/editor"
                  className="hidden sm:flex items-center space-x-1 p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                  aria-label="Create new blog"
                >
                  <Edit size={18} />
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
                <div className="relative w-9 h-9 overflow-hidden rounded-full border-2 border-gray-200 dark:border-gray-700 hover:border-violet-500 dark:hover:border-violet-400 transition-colors duration-300 shadow-sm">
                  <img
                    src={currentUser.profile_img}
                    alt={currentUser.fullname}
                    className="w-full h-full object-cover"
                  />
                  {hasNewNotifications && (
                    <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900"></span>
                  )}
                </div>
                <span className="hidden lg:block text-gray-700 dark:text-gray-300 font-medium font-montserrat">
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
                    className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 z-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex items-center space-x-3">
                        <img
                          src={currentUser.profile_img}
                          alt={currentUser.fullname}
                          className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-700"
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white font-montserrat">
                            {currentUser.fullname}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 font-montserrat">
                            @{currentUser.username}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="py-1">
                      {[
                        {
                          to: `/profile/${currentUser.username}`,
                          icon: <User className="w-4 h-4 mr-2" />,
                          label: "Profile",
                        },
                        {
                          to: "/dashboard",
                          icon: <LayoutDashboard className="w-4 h-4 mr-2" />,
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
                                icon: <Shield className="w-4 h-4 mr-2" />,
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
                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            {item.icon}
                            <span className="font-montserrat">
                              {item.label}
                            </span>
                          </Link>
                        </motion.div>
                      ))}
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-700 py-1">
                      <motion.button
                        initial={{ opacity: 0, x: -10 }}
                        animate={{
                          opacity: 1,
                          x: 0,
                          transition: { delay: 0.2 },
                        }}
                        onClick={logout}
                        className="flex items-center w-full px-4 py-2 text-sm text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors duration-200"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        <span className="font-montserrat">Logout</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              className="flex items-center space-x-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Button
                href="/signin"
                variant="white"
                className="bg-orange-100 dark:text-gray-900"
                shadowDepth="shallow"
              >
                Sign In
              </Button>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button href="/signup" variant="primary" shadowDepth="shallow">
                  Get Started
                </Button>
              </motion.div>
            </motion.div>
          )}
          {/* Mobile Menu Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            aria-label="Menu"
            whileTap={{ scale: 0.9 }}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
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
            className="md:hidden bg-white dark:bg-gray-800 shadow-md border-t border-gray-100 dark:border-gray-700"
          >
            <div className="container-custom mx-auto px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center relative"
              >
                <div className="relative w-full">
                  <input
                    type="text"
                    name="search"
                    placeholder="Search blogs..."
                    className="w-full px-4 py-2 pl-10 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500/50 text-sm transition-all duration-300 border border-gray-200 dark:border-gray-600 focus:border-violet-400"
                  />
                  <Search
                    className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400"
                    size={16}
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-2.5 text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </form>

              {/* Mobile Navigation Links */}
              <nav className="flex flex-col space-y-1 py-2">
                {[
                  {
                    to: "/",
                    label: "Home",
                    icon: <Home className="w-5 h-5 mr-3" />,
                  },
                  {
                    to: "/search",
                    label: "Explore",
                    icon: <Compass className="w-5 h-5 mr-3" />,
                  },
                  ...(currentUser
                    ? [
                        {
                          to: "/dashboard",
                          label: "Dashboard",
                          icon: <LayoutDashboard className="w-5 h-5 mr-3" />,
                        },
                        {
                          to: `/profile/${currentUser.username}`,
                          label: "Profile",
                          icon: <User className="w-5 h-5 mr-3" />,
                        },
                        {
                          to: "/settings",
                          label: "Settings",
                          icon: <Settings className="w-5 h-5 mr-3" />,
                        },
                        ...(currentUser.role === "blogger" ||
                        currentUser.role === "admin"
                          ? [
                              {
                                to: "/editor",
                                label: "Write",
                                icon: <PenLine className="w-5 h-5 mr-3" />,
                              },
                            ]
                          : []),
                        ...(currentUser.role === "admin"
                          ? [
                              {
                                to: "/admin",
                                label: "Admin",
                                icon: <Shield className="w-5 h-5 mr-3" />,
                              },
                            ]
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
                        `flex items-center px-4 py-2.5 rounded-lg ${
                          isActive
                            ? "text-violet-600 dark:text-violet-400 font-medium bg-violet-50 dark:bg-violet-900/20"
                            : "text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        } transition-colors duration-200`
                      }
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.icon}
                      <span className="font-montserrat">{item.label}</span>
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
                    className="flex items-center px-4 py-2.5 rounded-lg text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors duration-200 w-full"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    <span className="font-montserrat">Logout</span>
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
                        className="px-4 py-2.5 text-center text-violet-600 dark:text-violet-400 border border-violet-600 dark:border-violet-500 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/30 transition-colors duration-300 block font-montserrat"
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
                        className="px-4 py-2.5 text-center bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg hover:from-violet-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg block font-montserrat"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Get Started
                      </Link>
                    </motion.div>
                  </div>
                )}
              </nav>

              {/* Theme Toggle in Mobile Menu */}
              <div className="py-2 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300 font-montserrat text-sm">
                  Theme Mode
                </span>
                <ThemeToggle.ThemeToggleMini />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
