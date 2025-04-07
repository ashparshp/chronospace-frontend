import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Bell, 
  PenSquare, 
  User, 
  ChevronDown, 
  LogOut, 
  Settings,
  Shield,
  Home,
  Compass,
  LayoutDashboard,
  MessageSquare,
  Star,
  Heart,
  ChevronRight,
  Menu
} from 'lucide-react';

const Navbar = () => {
  const [theme, setTheme] = useState('light');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('Home');

  // Common color classes based on theme
  const headerBg = theme === 'dark'
    ? 'bg-gray-900/90 text-gray-100 border-gray-800/50'
    : 'bg-white/90 text-gray-800 border-gray-200';
  const dropdownBg = theme === 'dark'
    ? 'bg-gray-900 border-gray-800'
    : 'bg-white border-gray-200';

  // Subtle pill-style active/inactive classes
  const activeNavClasses = theme === 'dark'
    ? 'bg-indigo-900 text-indigo-400'
    : 'bg-indigo-500/10 text-indigo-600';
  const inactiveNavClasses = theme === 'dark'
    ? 'text-gray-300 hover:bg-gray-800/50'
    : 'text-gray-700 hover:bg-gray-50';

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Framer Motion variants (unchanged)
  const navItemVariants = {
    hover: {
      y: -2,
      transition: { type: 'spring', stiffness: 300, damping: 10 }
    },
    active: {
      color: theme === 'dark' ? '#818cf8' : '#4f46e5'
    }
  };

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.1, ease: 'easeOut' }
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.2, ease: 'easeOut' }
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.1, ease: 'easeIn' }
    }
  };

  const underlineVariants = {
    hidden: { width: 0, opacity: 0 },
    hover: { width: '60%', opacity: 0.7, transition: { duration: 0.2 } },
    active: { width: '80%', opacity: 1, transition: { duration: 0.2 } }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.15, 1],
      opacity: [0.7, 1, 0.7],
      transition: { repeat: Infinity, duration: 2 }
    }
  };

  const navItems = [
    { name: 'Home', icon: <Home className="w-4 h-4" /> },
    { name: 'Explore', icon: <Compass className="w-4 h-4" /> },
    { name: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: 'Admin', icon: <Shield className="w-4 h-4" /> }
  ];

  return (
    <div className={theme === 'dark' ? 'bg-gray-950' : 'bg-gray-100'}>
      {/* Header / Navbar */}
      <header className={`w-full border-b sticky top-0 z-50 backdrop-blur-sm ${headerBg}`}>
        {/* Container spanning full width */}
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Group: Hamburger & Logo */}
            <div className="flex items-center space-x-4">
              {/* Hamburger for Mobile */}
              <div className="md:hidden">
                <motion.button 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.button>
              </div>
              {/* Logo */}
              <motion.a 
                href="#"
                className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                ChronoSpace
              </motion.a>
            </div>

            {/* Center Group: Desktop Navigation & Search */}
            <div className="hidden md:flex flex-col flex-grow items-center">
              <nav className="flex justify-evenly w-full">
                {navItems.map((item) => (
                  <motion.a
                    key={item.name}
                    href="#"
                    className={`px-4 py-2 text-sm font-medium rounded-full relative group transition-colors duration-200 ${
                      activeNav === item.name ? activeNavClasses : inactiveNavClasses
                    }`}
                    onClick={() => setActiveNav(item.name)}
                    variants={navItemVariants}
                    whileHover="hover"
                    animate={activeNav === item.name ? 'active' : ''}
                  >
                    <span className="mr-1.5">{item.icon}</span>
                    {item.name}
                    <motion.span 
                      className="absolute h-0.5 bottom-0 left-1/2 transform -translate-x-1/2 rounded-full bg-indigo-500"
                      variants={underlineVariants}
                      initial="hidden"
                      animate={activeNav === item.name ? 'active' : 'hidden'}
                      whileHover={activeNav !== item.name ? 'hover' : ''}
                    />
                  </motion.a>
                ))}
              </nav>
              <div className="mt-2 w-full max-w-lg">
                <motion.div className="w-full relative" whileHover={{ scale: 1.01 }}>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search blogs..."
                    className={`w-full pl-10 pr-4 py-2 border rounded-full text-sm ${
                      theme === 'dark'
                        ? 'bg-gray-800/60 border-gray-700 text-gray-200 focus:border-indigo-500'
                        : 'bg-gray-100 border-gray-200 text-gray-900 focus:border-indigo-400'
                    } focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500 transition-all duration-200`}
                  />
                </motion.div>
              </div>
            </div>

            {/* Right Group: Icons */}
            <div className="flex items-center space-x-4">
              {/* Custom Theme Toggle */}
              <div className="flex">
                <button 
                  onClick={toggleTheme} 
                  className={`w-20 h-10 rounded-full overflow-hidden relative transition-colors duration-500 ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-blue-300'
                  }`}
                >
                  <div className={`absolute transform transition-all duration-500 ${
                    theme === 'dark' ? 'translate-x-12 -translate-y-8' : 'translate-x-2 translate-y-1'
                  }`}>
                    <div className="w-6 h-6 rounded-full bg-yellow-400"></div>
                  </div>
                  <div className={`absolute transform transition-all duration-500 ${
                    theme === 'dark' ? 'translate-x-4 translate-y-1 opacity-100' : 'translate-x-16 translate-y-1 opacity-0'
                  }`}>
                    <div className="w-5 h-5 rounded-full bg-gray-200"></div>
                  </div>
                  <div className={`absolute top-2 left-2 transition-opacity duration-500 ${
                    theme === 'dark' ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <div className="w-1 h-1 rounded-full bg-white"></div>
                  </div>
                  <div className={`absolute top-6 left-12 transition-opacity duration-500 ${
                    theme === 'dark' ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <div className="w-1 h-1 rounded-full bg-white"></div>
                  </div>
                </button>
              </div>

              {/* Notifications */}
              <div className="relative">
                <motion.button 
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  <motion.div 
                    className="absolute -top-0.5 -right-0.5"
                    variants={pulseVariants}
                    animate="pulse"
                  >
                    <span className={`inline-flex rounded-full h-5 w-5 items-center justify-center text-xs font-medium ${
                      theme === 'dark' ? 'bg-indigo-500' : 'bg-indigo-600'
                    } text-white`}>
                      3
                    </span>
                  </motion.div>
                </motion.button>
                
                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div 
                      className={`absolute right-0 mt-2 w-80 rounded-lg overflow-hidden border ${
                        theme === 'dark' ? 'shadow-xl' : ''
                      } ${dropdownBg} z-50`}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={dropdownVariants}
                    >
                      <div className="p-4 border-b flex justify-between items-center border-gray-200 dark:border-gray-800">
                        <h3 className="font-medium flex items-center">
                          <Bell className="w-4 h-4 mr-2" /> Notifications
                          <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
                            theme === 'dark'
                              ? 'bg-indigo-900/50 text-indigo-300'
                              : 'bg-indigo-100 text-indigo-600'
                          }`}>
                            3 new
                          </span>
                        </h3>
                        <motion.button 
                          className={`text-xs font-medium px-2 py-1 rounded-md ${
                            theme === 'dark'
                              ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setNotificationsOpen(false)}
                        >
                          Clear all
                        </motion.button>
                      </div>
                      <div className="max-h-[250px] overflow-y-auto">
                        {[
                          {
                            title: 'New comment on your post',
                            message: 'Sarah wrote: "Great article! I especially liked the section about design principles."',
                            time: '2 min ago',
                            read: false,
                            icon: <MessageSquare className="w-4 h-4" />
                          },
                          {
                            title: 'Your post was featured',
                            message: 'Congratulations! Your post "Why Side Projects Matter" was featured on the homepage.',
                            time: '1 hour ago',
                            read: false,
                            icon: <Star className="w-4 h-4" />
                          },
                          {
                            title: 'New follower',
                            message: 'David Wilson started following you.',
                            time: 'Yesterday',
                            read: true,
                            icon: <Heart className="w-4 h-4" />
                          }
                        ].map((notification, i) => (
                          <motion.div 
                            key={i} 
                            className={`p-4 border-b last:border-b-0 flex items-start gap-3 cursor-pointer ${
                              theme === 'dark'
                                ? 'border-gray-800 hover:bg-gray-800/50'
                                : 'border-gray-100 hover:bg-gray-50'
                            } ${
                              !notification.read
                                ? theme === 'dark'
                                  ? 'bg-indigo-900/10'
                                  : 'bg-indigo-50/30'
                                : ''
                            }`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ x: 2 }}
                          >
                            <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                              !notification.read
                                ? theme === 'dark'
                                  ? 'bg-indigo-500/20 text-indigo-400'
                                  : 'bg-indigo-100 text-indigo-600'
                                : theme === 'dark'
                                  ? 'bg-gray-800 text-gray-400'
                                  : 'bg-gray-100 text-gray-500'
                            }`}>
                              {notification.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium ${
                                notification.read
                                  ? theme === 'dark'
                                    ? 'text-gray-400'
                                    : 'text-gray-500'
                                  : theme === 'dark'
                                  ? 'text-gray-100'
                                  : 'text-gray-800'
                              }`}>
                                {notification.title}
                              </p>
                              <p className={`text-xs mt-1 line-clamp-2 ${
                                theme === 'dark'
                                  ? 'text-gray-400'
                                  : 'text-gray-500'
                              }`}>
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                {notification.time}
                              </p>
                            </div>
                            {!notification.read && (
                              <motion.div 
                                className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0 mt-2"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                              />
                            )}
                          </motion.div>
                        ))}
                      </div>
                      <div className={`p-3 text-center border-t ${
                        theme === 'dark'
                          ? 'border-gray-800 bg-gray-900/70'
                          : 'border-gray-100 bg-gray-50/70'
                      }`}>
                        <motion.a 
                          href="#"
                          className={`text-sm flex items-center justify-center ${
                            theme === 'dark'
                              ? 'text-indigo-400 hover:text-indigo-300'
                              : 'text-indigo-600 hover:text-indigo-700'
                          }`}
                          whileHover={{ x: 3 }}
                        >
                          View all notifications
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </motion.a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Profile */}
              <div className="relative">
                <motion.button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-3 focus:outline-none"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-indigo-500/30">
                      <img 
                        src="/api/placeholder/40/40" 
                        alt="User avatar" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <motion.div
                      animate={{ rotate: userMenuOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </motion.div>
                  </div>
                </motion.button>
                
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div 
                      className={`absolute right-0 mt-3 w-72 py-2 rounded-lg border overflow-hidden z-50 ${
                        theme === 'dark' ? 'shadow-xl' : ''
                      } ${dropdownBg}`}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={dropdownVariants}
                    >
                      <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-800">
                        <div className="flex items-center">
                          <div className="relative">
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-indigo-500">
                              <img 
                                src="/api/placeholder/64/64" 
                                alt="User avatar" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <motion.div 
                              className={`absolute bottom-0 right-0 w-5 h-5 rounded-full flex items-center justify-center ${
                                theme === 'dark' ? 'bg-gray-900' : 'bg-white'
                              } border-2 border-indigo-500`}
                              whileHover={{ scale: 1.2 }}
                            >
                              <PenSquare className="w-2.5 h-2.5 text-indigo-500" />
                            </motion.div>
                          </div>
                          <div className="ml-4 flex flex-col gap-1">
                            <motion.p 
                              className={`text-base font-medium ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}
                              whileHover={{ x: 2 }}
                            >
                              ashparsh pandey
                            </motion.p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              ashparsh@gmail.com
                            </p>
                            <div className="flex">
                              <motion.span 
                                className={`inline-block text-xs py-0.5 px-2 rounded-full ${
                                  theme === 'dark'
                                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                    : 'bg-blue-100 text-blue-700 border border-blue-200'
                                }`}
                                whileHover={{ scale: 1.05, y: -1 }}
                              >
                                Author
                              </motion.span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="py-1">
                        {[
                          { name: 'Profile', icon: <User className="w-4 h-4 mr-3" /> },
                          { name: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4 mr-3" /> },
                          { name: 'Settings', icon: <Settings className="w-4 h-4 mr-3" /> },
                          { name: 'Admin Panel', icon: <Shield className="w-4 h-4 mr-3" /> }
                        ].map((item, i) => (
                          <motion.a 
                            key={item.name}
                            href="#"
                            className={`flex items-center px-4 py-2.5 text-sm ${
                              theme === 'dark'
                                ? 'hover:bg-gray-800 text-gray-300 hover:text-gray-100'
                                : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                            }`}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 + 0.1 }}
                            whileHover={{ x: 3 }}
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>
                              {item.icon}
                            </span>
                            {item.name}
                          </motion.a>
                        ))}
                        
                        <div className={`border-t my-1 ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}></div>
                        
                        <motion.a 
                          href="#"
                          className={`flex items-center px-4 py-2.5 text-sm ${
                            theme === 'dark'
                              ? 'text-red-400 hover:bg-gray-800 hover:text-red-300'
                              : 'text-red-600 hover:bg-gray-100 hover:text-red-700'
                          }`}
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                          whileHover={{ x: 3 }}
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Logout
                        </motion.a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            className={`md:hidden border-t p-4 backdrop-blur-sm ${headerBg}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {navItems.map((item) => (
              <motion.a
                key={item.name}
                href="#"
                className={`block px-4 py-2 rounded-full text-base font-medium transition-colors duration-200 ${
                  activeNav === item.name ? activeNavClasses : inactiveNavClasses
                }`}
                onClick={() => {
                  setActiveNav(item.name);
                  setMobileMenuOpen(false);
                }}
                whileHover={{ x: 5 }}
              >
                {item.name}
              </motion.a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
