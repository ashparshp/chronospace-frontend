import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  User,
  Users,
  Shield,
  AlertCircle,
  CheckCircle,
  Edit,
  UserCheck,
  UserX,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  UserPlus,
  Mail,
  Calendar,
  Settings,
  BarChart3,
} from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import { adminService } from "../../services/adminService";
import { USER_ROLES, ACCOUNT_STATUS } from "../../config/constants";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Avatar from "../../components/ui/Avatar";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import EmptyState from "../../components/ui/EmptyState";
import Alert from "../../components/ui/Alert";
import StatCard from "../../components/ui/StatsCard";

const AdminUsersPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { showToast } = useNotification();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    role: "all",
    status: "all",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState({});

  // Stats for summary cards
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    bloggers: 0,
    admins: 0,
  });

  // Check if user is admin
  const isAdmin = currentUser && currentUser.role === "admin";

  // Fetch users data
  useEffect(() => {
    if (!isAdmin) return;

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await adminService.getAllUsers(
          page,
          10,
          search,
          filters.role,
          filters.status
        );

        setUsers(response.data.users);
        setTotalPages(response.data.total_pages);
        setTotalUsers(response.data.total);

        // Calculate stats
        setStats({
          totalUsers: response.data.total || 0,
          activeUsers: response.data.users.filter(
            (user) => user.account_status === "active"
          ).length,
          bloggers: response.data.users.filter(
            (user) => user.role === "blogger"
          ).length,
          admins: response.data.users.filter((user) => user.role === "admin")
            .length,
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load users");
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isAdmin, page, search, filters]);

  // Handle search input
  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(e.target.search.value);
    setPage(1);
  };

  // Handle filter change
  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPage(1);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      role: "all",
      status: "all",
    });
    setSearch("");
    setPage(1);
  };

  // Handle pagination
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "N/A";
    return format(new Date(date), "MMM d, yyyy");
  };

  // Get user role badge variant
  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case "admin":
        return "success";
      case "blogger":
        return "info";
      default:
        return "secondary";
    }
  };

  // Get user status badge variant
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "suspended":
        return "warning";
      case "deleted":
        return "danger";
      default:
        return "secondary";
    }
  };

  // Open action menu for a user
  const toggleActionMenu = (userId, e) => {
    e.stopPropagation();
    setIsActionMenuOpen((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  // Close all action menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsActionMenuOpen({});
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Set selected user and open modal
  const handleEditRole = (user) => {
    setSelectedUser(user);
    setShowRoleModal(true);
    setIsActionMenuOpen({});
  };

  const handleEditStatus = (user) => {
    setSelectedUser(user);
    setShowStatusModal(true);
    setIsActionMenuOpen({});
  };

  // Update user role
  const updateUserRole = async (userId, role) => {
    try {
      setModalLoading(true);

      await adminService.updateUserRole(userId, role);

      // Update user in the list
      setUsers((prev) =>
        prev.map((user) => (user._id === userId ? { ...user, role } : user))
      );

      showToast("User role updated successfully", "success");
      setShowRoleModal(false);
    } catch (error) {
      console.error("Error updating role:", error);
      showToast(
        error.response?.data?.error || "Failed to update user role",
        "error"
      );
    } finally {
      setModalLoading(false);
    }
  };

  // Update user status
  const updateUserStatus = async (userId, status) => {
    try {
      setModalLoading(true);

      await adminService.updateAccountStatus(userId, status);

      // Update user in the list
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, account_status: status } : user
        )
      );

      showToast("User status updated successfully", "success");
      setShowStatusModal(false);
    } catch (error) {
      console.error("Error updating status:", error);
      showToast(
        error.response?.data?.error || "Failed to update user status",
        "error"
      );
    } finally {
      setModalLoading(false);
    }
  };

  // View user profile
  const viewUserProfile = (username) => {
    navigate(`/profile/${username}`);
  };

  // If not admin
  if (!isAdmin) {
    return (
      <EmptyState
        title="Access Denied"
        description="You need administrator privileges to access this page."
        actionText="Go to Home"
        actionLink="/"
        icon={<Shield className="h-16 w-16 text-red-500" />}
        className="bg-white dark:bg-gray-800 rounded-xl p-10 border border-gray-100 dark:border-gray-700 shadow-sm"
      />
    );
  }

  return (
    <div className="mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Admin Header - Styled to match new design */}
        <div className="rounded-2xl overflow-hidden shadow-lg mb-8">
          <div className="relative bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 py-8 px-6">
            {/* Background decoration */}
            <motion.div
              className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-violet-500/20 to-indigo-500/20 dark:from-violet-500/10 dark:to-indigo-500/10 rounded-full blur-2xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.7, 0.5],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            ></motion.div>
            <motion.div
              className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-indigo-500/20 to-violet-500/20 dark:from-indigo-500/10 dark:to-violet-500/10 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.4, 0.6, 0.4],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            ></motion.div>

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="mb-6 md:mb-0">
                  <Button
                    variant="white"
                    size="sm"
                    onClick={() => navigate("/admin")}
                    className="mb-4"
                    icon={<ArrowLeft className="h-4 w-4" />}
                    iconPosition="left"
                    shadowDepth="shallow"
                  >
                    Back to Dashboard
                  </Button>

                  <motion.h1
                    className="font-playfair text-3xl md:text-4xl font-bold mb-2 tracking-tight leading-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">
                      User Management
                    </span>
                  </motion.h1>

                  <motion.p
                    className="font-montserrat text-lg leading-relaxed text-gray-700 dark:text-gray-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    Manage user accounts, roles, and permissions across the
                    platform
                  </motion.p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <form onSubmit={handleSearch} className="flex">
                    <Input
                      name="search"
                      placeholder="Search users..."
                      defaultValue={search}
                      className="rounded-r-none bg-white dark:bg-gray-900"
                      icon={<Search className="h-5 w-5 text-gray-400" />}
                    />
                    <Button
                      type="submit"
                      variant="primary"
                      className="rounded-l-none"
                      glossy={true}
                      shadowDepth="deep"
                    >
                      Search
                    </Button>
                  </form>

                  <Button
                    variant="white"
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        isFilterOpen: !prev.isFilterOpen,
                      }))
                    }
                    shadowDepth="shallow"
                    glossy={true}
                    icon={<Filter className="h-4 w-4" />}
                    iconPosition="left"
                  >
                    {filters.isFilterOpen ? "Hide Filters" : "Show Filters"}
                  </Button>
                </div>
              </div>

              {/* User Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                <StatCard
                  title="Total Users"
                  value={totalUsers}
                  icon={<Users />}
                  delay={0.1}
                />
                <StatCard
                  title="Active Users"
                  value={stats.activeUsers}
                  icon={<UserCheck />}
                  iconBgColor="bg-green-500/20"
                  iconColor="text-green-600 dark:text-green-400"
                  delay={0.2}
                />
                <StatCard
                  title="Bloggers"
                  value={stats.bloggers}
                  icon={<Edit />}
                  iconBgColor="bg-indigo-500/20"
                  iconColor="text-indigo-600 dark:text-indigo-400"
                  delay={0.3}
                />
                <StatCard
                  title="Administrators"
                  value={stats.admins}
                  icon={<Shield />}
                  iconBgColor="bg-amber-500/20"
                  iconColor="text-amber-600 dark:text-amber-400"
                  delay={0.4}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        {filters.isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 border border-gray-100 dark:border-gray-800 shadow-md">
              <h3 className="font-playfair text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Filter Users
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-montserrat">
                    Role
                  </label>
                  <Select
                    value={filters.role}
                    onChange={(e) => handleFilterChange("role", e.target.value)}
                    options={[
                      { value: "all", label: "All Roles" },
                      { value: "user", label: "User" },
                      { value: "blogger", label: "Blogger" },
                      { value: "admin", label: "Admin" },
                    ]}
                    className="bg-white dark:bg-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-montserrat">
                    Status
                  </label>
                  <Select
                    value={filters.status}
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                    options={[
                      { value: "all", label: "All Status" },
                      { value: "active", label: "Active" },
                      { value: "suspended", label: "Suspended" },
                      { value: "deleted", label: "Deleted" },
                    ]}
                    className="bg-white dark:bg-gray-900"
                  />
                </div>

                <div className="flex items-end">
                  <Button
                    variant="ghost"
                    onClick={clearFilters}
                    size="md"
                    className="text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/10"
                    icon={<Filter className="h-4 w-4 mr-1" />}
                    iconPosition="left"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Users Table */}
        <Card className="border border-gray-100 dark:border-gray-800 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider font-montserrat"
                  >
                    User
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider font-montserrat"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider font-montserrat"
                  >
                    Role
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider font-montserrat"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider font-montserrat"
                  >
                    Joined
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider font-montserrat"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                {loading && users.length === 0 ? (
                  // Loading skeleton
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                          <div className="ml-4">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 mt-1"></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-8 ml-auto"></div>
                      </td>
                    </tr>
                  ))
                ) : users.length > 0 ? (
                  users.map((user, index) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors duration-150"
                      onClick={() =>
                        viewUserProfile(user.personal_info.username)
                      }
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Avatar
                            src={user.personal_info.profile_img}
                            alt={user.personal_info.fullname}
                            size="md"
                            className="cursor-pointer border-2 border-white dark:border-gray-800 shadow-sm"
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white font-playfair hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                              {user.personal_info.fullname}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 font-montserrat">
                              @{user.personal_info.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white font-montserrat">
                          {user.personal_info.email}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 font-montserrat">
                          {user.email_verified ? (
                            <span className="flex items-center text-green-600 dark:text-green-400">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </span>
                          ) : (
                            <span className="flex items-center text-yellow-600 dark:text-yellow-400">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Not verified
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant={getRoleBadgeVariant(user.role)}
                          className="capitalize font-montserrat text-xs"
                        >
                          {user.role === "admin" ? (
                            <Shield className="h-3 w-3 mr-1 inline-block" />
                          ) : user.role === "blogger" ? (
                            <Edit className="h-3 w-3 mr-1 inline-block" />
                          ) : (
                            <User className="h-3 w-3 mr-1 inline-block" />
                          )}
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant={getStatusBadgeVariant(user.account_status)}
                          className="capitalize font-montserrat text-xs"
                        >
                          {user.account_status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white font-montserrat">
                          <Calendar className="h-3.5 w-3.5 mr-1 inline-block text-gray-500 dark:text-gray-400" />
                          {formatDate(user.joinedAt)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-montserrat">
                          Last login: {formatDate(user.last_login)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="relative">
                          <button
                            onClick={(e) => toggleActionMenu(user._id, e)}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 bg-gray-100 dark:bg-gray-700 p-2 rounded-lg"
                          >
                            <Settings className="h-4 w-4" />
                          </button>

                          {isActionMenuOpen[user._id] && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 border border-gray-100 dark:border-gray-700 overflow-hidden">
                              <div
                                className="py-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                  onClick={() =>
                                    viewUserProfile(user.personal_info.username)
                                  }
                                >
                                  <User className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                                  View Profile
                                </button>
                                <button
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                  onClick={() => handleEditRole(user)}
                                >
                                  <Shield className="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-400" />
                                  Change Role
                                </button>
                                <button
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                  onClick={() => handleEditStatus(user)}
                                >
                                  {user.account_status === "active" ? (
                                    <>
                                      <UserX className="h-4 w-4 mr-2 text-red-500" />
                                      Suspend Account
                                    </>
                                  ) : (
                                    <>
                                      <UserCheck className="h-4 w-4 mr-2 text-green-500" />
                                      Activate Account
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-10 text-center text-gray-500 dark:text-gray-400 font-montserrat"
                    >
                      <div className="flex flex-col items-center">
                        <Users className="h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                          No users found
                        </p>
                        <p>Try adjusting your search or filter criteria</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {users.length > 0 && (
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400 font-montserrat">
                Showing <span className="font-medium">{users.length}</span> of{" "}
                <span className="font-medium">{totalUsers}</span> users
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="white"
                  size="md"
                  onClick={handlePreviousPage}
                  disabled={page === 1}
                  shadowDepth="shallow"
                  icon={<ChevronLeft className="h-4 w-4" />}
                  iconPosition="left"
                >
                  Previous
                </Button>
                <Button
                  variant="white"
                  size="md"
                  onClick={handleNextPage}
                  disabled={page === totalPages}
                  shadowDepth="shallow"
                  icon={<ChevronRight className="h-4 w-4" />}
                  iconPosition="right"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Edit Role Modal */}
      <Modal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        title="Change User Role"
        size="sm"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-6">
              <Avatar
                src={selectedUser.personal_info.profile_img}
                alt={selectedUser.personal_info.fullname}
                size="md"
                className="border-2 border-white dark:border-gray-800 shadow-sm"
              />
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white font-playfair">
                  {selectedUser.personal_info.fullname}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 font-montserrat">
                  @{selectedUser.personal_info.username}
                </p>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 font-montserrat mb-4">
              Select a new role for this user:
            </p>

            <div className="grid grid-cols-1 gap-3">
              {Object.values(USER_ROLES).map((role) => (
                <motion.div
                  key={role}
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedUser.role === role
                      ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                  onClick={() => updateUserRole(selectedUser._id, role)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {role === "admin" ? (
                        <Shield className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                      ) : role === "blogger" ? (
                        <Edit className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                      ) : (
                        <User className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
                      )}
                      <span className="font-medium capitalize">{role}</span>
                    </div>
                    {selectedUser.role === role && (
                      <CheckCircle className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 ml-7 font-montserrat">
                    {role === "admin"
                      ? "Full access to all features and admin controls"
                      : role === "blogger"
                      ? "Can create and publish blog content"
                      : "Basic account with commenting privileges"}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="white"
                onClick={() => setShowRoleModal(false)}
                disabled={modalLoading}
                shadowDepth="shallow"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Status Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Change Account Status"
        size="sm"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-6">
              <Avatar
                src={selectedUser.personal_info.profile_img}
                alt={selectedUser.personal_info.fullname}
                size="md"
                className="border-2 border-white dark:border-gray-800 shadow-sm"
              />
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white font-playfair">
                  {selectedUser.personal_info.fullname}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 font-montserrat">
                  @{selectedUser.personal_info.username}
                </p>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 font-montserrat mb-4">
              Select a new status for this account:
            </p>

            <div className="grid grid-cols-1 gap-3">
              {Object.values(ACCOUNT_STATUS).map((status) => (
                <motion.div
                  key={status}
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedUser.account_status === status
                      ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                  onClick={() => updateUserStatus(selectedUser._id, status)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {status === "active" ? (
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                      ) : status === "suspended" ? (
                        <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                      ) : (
                        <UserX className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                      )}
                      <span className="font-medium capitalize">{status}</span>
                    </div>
                    {selectedUser.account_status === status && (
                      <CheckCircle className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 ml-7 font-montserrat">
                    {status === "active"
                      ? "User has full access to the platform"
                      : status === "suspended"
                      ? "User is temporarily blocked from accessing the platform"
                      : "User account has been permanently deleted"}
                  </p>
                </motion.div>
              ))}
            </div>

            <Alert variant="warning" className="mt-6">
              <p className="text-sm font-montserrat">
                {selectedUser.account_status === "active"
                  ? "Suspending or deleting an account will immediately revoke the user's access to the platform."
                  : "Activating this account will restore the user's access to the platform."}
              </p>
            </Alert>

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="white"
                onClick={() => setShowStatusModal(false)}
                disabled={modalLoading}
                shadowDepth="shallow"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminUsersPage;
