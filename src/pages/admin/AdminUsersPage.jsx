// src/pages/admin/AdminUsersPage.jsx
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
  const toggleActionMenu = (userId) => {
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
        icon={<Shield className="h-12 w-12 text-red-500" />}
      />
    );
  }

  return (
    <div className=" mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/admin")}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Dashboard
              </Button>

              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                User Management
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage user accounts, roles, and permissions
            </p>
          </div>

          <div className="flex space-x-2">
            <form onSubmit={handleSearch} className="flex">
              <Input
                name="search"
                placeholder="Search users..."
                defaultValue={search}
                className="rounded-r-none"
                icon={<Search className="h-5 w-5 text-gray-400" />}
              />
              <Button
                type="submit"
                variant="primary"
                className="rounded-l-none"
              >
                Search
              </Button>
            </form>

            <Button
              variant="outline"
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  isFilterOpen: !prev.isFilterOpen,
                }))
              }
            >
              <Filter className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        {filters.isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Role"
                value={filters.role}
                onChange={(e) => handleFilterChange("role", e.target.value)}
                options={[
                  { value: "all", label: "All Roles" },
                  { value: "user", label: "User" },
                  { value: "blogger", label: "Blogger" },
                  { value: "admin", label: "Admin" },
                ]}
              />

              <Select
                label="Status"
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                options={[
                  { value: "all", label: "All Status" },
                  { value: "active", label: "Active" },
                  { value: "suspended", label: "Suspended" },
                  { value: "deleted", label: "Deleted" },
                ]}
              />

              <div className="flex items-end">
                <Button variant="ghost" onClick={clearFilters} size="sm">
                  Clear Filters
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Users List */}
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    User
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Role
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Joined
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {loading ? (
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
                  users.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Avatar
                            src={user.personal_info.profile_img}
                            alt={user.personal_info.fullname}
                            size="md"
                            className="cursor-pointer"
                            onClick={() =>
                              viewUserProfile(user.personal_info.username)
                            }
                          />
                          <div className="ml-4">
                            <div
                              className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer hover:text-primary-600 dark:hover:text-primary-400"
                              onClick={() =>
                                viewUserProfile(user.personal_info.username)
                              }
                            >
                              {user.personal_info.fullname}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              @{user.personal_info.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {user.personal_info.email}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
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
                          className="capitalize"
                        >
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant={getStatusBadgeVariant(user.account_status)}
                          className="capitalize"
                        >
                          {user.account_status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {formatDate(user.joinedAt)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Last login: {formatDate(user.last_login)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleActionMenu(user._id);
                            }}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                          >
                            <MoreHorizontal className="h-5 w-5" />
                          </button>

                          {isActionMenuOpen[user._id] && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10">
                              <div
                                className="py-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  onClick={() =>
                                    viewUserProfile(user.personal_info.username)
                                  }
                                >
                                  <User className="h-4 w-4 mr-2" />
                                  View Profile
                                </button>
                                <button
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  onClick={() => handleEditRole(user)}
                                >
                                  <Shield className="h-4 w-4 mr-2" />
                                  Change Role
                                </button>
                                <button
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  onClick={() => handleEditStatus(user)}
                                >
                                  {user.account_status === "active" ? (
                                    <>
                                      <UserX className="h-4 w-4 mr-2" />
                                      Suspend Account
                                    </>
                                  ) : (
                                    <>
                                      <UserCheck className="h-4 w-4 mr-2" />
                                      Activate Account
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                    >
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {users.length > 0 && (
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing <span className="font-medium">{users.length}</span> of{" "}
                <span className="font-medium">{totalUsers}</span> users
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={page === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
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
            <div className="flex items-center space-x-3 mb-4">
              <Avatar
                src={selectedUser.personal_info.profile_img}
                alt={selectedUser.personal_info.fullname}
                size="md"
              />
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {selectedUser.personal_info.fullname}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  @{selectedUser.personal_info.username}
                </p>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400">
              Select a new role for this user:
            </p>

            <div className="grid grid-cols-1 gap-3">
              {Object.values(USER_ROLES).map((role) => (
                <div
                  key={role}
                  className={`p-4 border rounded-lg cursor-pointer ${
                    selectedUser.role === role
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => updateUserRole(selectedUser._id, role)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {role === "admin" ? (
                        <Shield className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                      ) : role === "blogger" ? (
                        <Edit className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                      ) : (
                        <User className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
                      )}
                      <span className="font-medium capitalize">{role}</span>
                    </div>
                    {selectedUser.role === role && (
                      <CheckCircle className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-7">
                    {role === "admin"
                      ? "Full access to all features and admin controls"
                      : role === "blogger"
                      ? "Can create and publish blog content"
                      : "Basic account with commenting privileges"}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="ghost"
                onClick={() => setShowRoleModal(false)}
                disabled={modalLoading}
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
            <div className="flex items-center space-x-3 mb-4">
              <Avatar
                src={selectedUser.personal_info.profile_img}
                alt={selectedUser.personal_info.fullname}
                size="md"
              />
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {selectedUser.personal_info.fullname}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  @{selectedUser.personal_info.username}
                </p>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400">
              Select a new status for this account:
            </p>

            <div className="grid grid-cols-1 gap-3">
              {Object.values(ACCOUNT_STATUS).map((status) => (
                <div
                  key={status}
                  className={`p-4 border rounded-lg cursor-pointer ${
                    selectedUser.account_status === status
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => updateUserStatus(selectedUser._id, status)}
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
                      <CheckCircle className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-7">
                    {status === "active"
                      ? "User has full access to the platform"
                      : status === "suspended"
                      ? "User is temporarily blocked from accessing the platform"
                      : "User account has been permanently deleted"}
                  </p>
                </div>
              ))}
            </div>

            <Alert variant="warning" className="mt-4">
              <p className="text-sm">
                {selectedUser.account_status === "active"
                  ? "Suspending or deleting an account will immediately revoke the user's access to the platform."
                  : "Activating this account will restore the user's access to the platform."}
              </p>
            </Alert>

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="ghost"
                onClick={() => setShowStatusModal(false)}
                disabled={modalLoading}
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
