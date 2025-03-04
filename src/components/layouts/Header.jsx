// src/components/layouts/Header.jsx
import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useNotification } from "../../context/NotificationContext";
import {
  Sun,
  Moon,
  Menu,
  X,
  Search,
  Bell,
  Edit,
  User,
  LogOut,
  Settings,
  ChevronDown,
} from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentUser, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const { hasNewNotifications } = useNotification();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsProfileMenuOpen(false);
    };

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

  // Toggle profile dropdown menu, stopping event propagation
  const toggleProfileMenu = (e) => {
    e.stopPropagation();
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  // Header className based on scroll state
  const headerClass = `sticky top-0 z-50 w-full transition-all duration-300 ${
    scrolled
      ? "bg-white dark:bg-gray-900 shadow-md"
      : "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md"
  }`;

  return (
    <header className={headerClass}>
      <div className="container-custom mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 text-transparent bg-clip-text">
            ChronoSpace
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-primary-600 dark:text-primary-400 font-medium"
                : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/search"
            className={({ isActive }) =>
              isActive
                ? "text-primary-600 dark:text-primary-400 font-medium"
                : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
            }
          >
            Explore
          </NavLink>

          {/* Conditional links based on authentication */}
          {currentUser && (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive
                    ? "text-primary-600 dark:text-primary-400 font-medium"
                    : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                }
              >
                Dashboard
              </NavLink>

              {/* Show editor link for bloggers and admins */}
              {(currentUser.role === "blogger" ||
                currentUser.role === "admin") && (
                <NavLink
                  to="/editor"
                  className={({ isActive }) =>
                    isActive
                      ? "text-primary-600 dark:text-primary-400 font-medium"
                      : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                  }
                >
                  Write
                </NavLink>
              )}

              {/* Admin dashboard link */}
              {currentUser.role === "admin" && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    isActive
                      ? "text-primary-600 dark:text-primary-400 font-medium"
                      : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                  }
                >
                  Admin
                </NavLink>
              )}
            </>
          )}
        </nav>

        {/* Right Section: Search & User Actions */}
        <div className="flex items-center space-x-4">
          {/* Desktop Search */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center relative"
          >
            <input
              type="text"
              name="search"
              placeholder="Search blogs..."
              className="w-48 lg:w-64 px-4 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
            <button
              type="submit"
              className="absolute right-3 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
            >
              <Search size={18} />
            </button>
          </form>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* User Menu (when logged in) */}
          {currentUser ? (
            <div className="relative">
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <Link
                  to="/dashboard?tab=notifications"
                  className="relative p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label="Notifications"
                >
                  <Bell size={20} />
                  {hasNewNotifications && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                  )}
                </Link>

                {/* Write button (for bloggers and admins) */}
                {(currentUser.role === "blogger" ||
                  currentUser.role === "admin") && (
                  <Link
                    to="/editor"
                    className="hidden sm:flex items-center space-x-1 p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    aria-label="Create new blog"
                  >
                    <Edit size={20} />
                  </Link>
                )}

                {/* Profile Menu Trigger */}
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center space-x-2"
                  aria-label="User menu"
                >
                  <div className="relative w-9 h-9 overflow-hidden rounded-full border-2 border-gray-200 dark:border-gray-700">
                    <img
                      src={currentUser.profile_img}
                      alt={currentUser.fullname}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="hidden lg:block text-gray-700 dark:text-gray-300">
                    {currentUser.fullname}
                  </span>
                  <ChevronDown className="hidden lg:block w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Profile Dropdown Menu */}
              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link
                      to={`/profile/${currentUser.username}`}
                      className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                    <Link
                      to="/dashboard"
                      className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
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
                      Dashboard
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                    {currentUser.role === "admin" && (
                      <Link
                        to="/admin"
                        className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
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
                        Admin Panel
                      </Link>
                    )}
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                    <button
                      onClick={logout}
                      className="flex items-center w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/signin"
                className="hidden sm:block px-4 py-1.5 text-primary-600 dark:text-primary-400 border border-primary-600 dark:border-primary-500 rounded-lg text-sm hover:bg-primary-50 dark:hover:bg-primary-900 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-1.5 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white dark:bg-gray-900 shadow-md"
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
                  className="w-full px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
                <button
                  type="submit"
                  className="absolute right-3 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  <Search size={18} />
                </button>
              </form>

              {/* Mobile Navigation Links */}
              <nav className="flex flex-col space-y-3">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive
                      ? "text-primary-600 dark:text-primary-400 font-medium"
                      : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </NavLink>
                <NavLink
                  to="/search"
                  className={({ isActive }) =>
                    isActive
                      ? "text-primary-600 dark:text-primary-400 font-medium"
                      : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Explore
                </NavLink>

                {/* Conditional links based on authentication */}
                {currentUser ? (
                  <>
                    <NavLink
                      to="/dashboard"
                      className={({ isActive }) =>
                        isActive
                          ? "text-primary-600 dark:text-primary-400 font-medium"
                          : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                      }
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </NavLink>

                    <NavLink
                      to={`/profile/${currentUser.username}`}
                      className={({ isActive }) =>
                        isActive
                          ? "text-primary-600 dark:text-primary-400 font-medium"
                          : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                      }
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </NavLink>

                    <NavLink
                      to="/settings"
                      className={({ isActive }) =>
                        isActive
                          ? "text-primary-600 dark:text-primary-400 font-medium"
                          : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                      }
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Settings
                    </NavLink>

                    {/* Show editor link for bloggers and admins */}
                    {(currentUser.role === "blogger" ||
                      currentUser.role === "admin") && (
                      <NavLink
                        to="/editor"
                        className={({ isActive }) =>
                          isActive
                            ? "text-primary-600 dark:text-primary-400 font-medium"
                            : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                        }
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Write
                      </NavLink>
                    )}

                    {/* Admin dashboard link */}
                    {currentUser.role === "admin" && (
                      <NavLink
                        to="/admin"
                        className={({ isActive }) =>
                          isActive
                            ? "text-primary-600 dark:text-primary-400 font-medium"
                            : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                        }
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin
                      </NavLink>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="text-left text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-3 pt-2">
                    <Link
                      to="/signin"
                      className="px-4 py-2 text-center text-primary-600 dark:text-primary-400 border border-primary-600 dark:border-primary-500 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="px-4 py-2 text-center bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Get Started
                    </Link>
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
