// src/pages/user/SettingsPage.jsx
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User,
  Lock,
  Mail,
  Moon,
  Sun,
  Bell,
  Upload,
  Camera,
  Trash2,
  Facebook,
  Twitter,
  Instagram,
  Github,
  Globe,
  Eye,
  EyeOff,
  Badge,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useNotification } from "../../context/NotificationContext";
import { userService } from "../../services/userService";
import { uploadService } from "../../services/uploadService";
import { authService } from "../../services/authService";
import { VALIDATION } from "../../config/constants";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import TextArea from "../../components/ui/TextArea";
import Tabs from "../../components/ui/Tabs";
import Avatar from "../../components/ui/Avatar";
import Modal from "../../components/ui/Modal";
import Alert from "../../components/ui/Alert";

// Profile form validation
const profileSchema = z.object({
  username: z
    .string()
    .min(
      VALIDATION.USERNAME_MIN_LENGTH,
      `Username must be at least ${VALIDATION.USERNAME_MIN_LENGTH} characters long`
    )
    .max(20, "Username must be less than 20 characters long")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers and underscores"
    ),
  bio: z
    .string()
    .max(
      VALIDATION.BIO_MAX_LENGTH,
      `Bio must be less than ${VALIDATION.BIO_MAX_LENGTH} characters long`
    )
    .optional(),
  social_links: z
    .object({
      website: z
        .string()
        .url("Must be a valid URL")
        .or(z.literal(""))
        .optional(),
      twitter: z
        .string()
        .url("Must be a valid URL")
        .or(z.literal(""))
        .optional(),
      facebook: z
        .string()
        .url("Must be a valid URL")
        .or(z.literal(""))
        .optional(),
      instagram: z
        .string()
        .url("Must be a valid URL")
        .or(z.literal(""))
        .optional(),
      github: z
        .string()
        .url("Must be a valid URL")
        .or(z.literal(""))
        .optional(),
    })
    .optional(),
});

// Password change validation
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(20, "Password must be less than 20 characters long")
      .regex(
        VALIDATION.PASSWORD_REGEX,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const SettingsPage = () => {
  const { currentUser, updateUserData, logout } = useAuth();
  const { darkMode, toggleTheme, setTheme } = useTheme();
  const { showToast } = useNotification();

  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profileImage, setProfileImage] = useState(
    currentUser?.profile_img || ""
  );
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fileInputRef = useRef(null);

  // Profile form
  const {
    register: profileRegister,
    handleSubmit: handleProfileSubmit,
    reset: resetProfileForm,
    formState: { errors: profileErrors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: currentUser?.username || "",
      bio: currentUser?.bio || "",
      social_links: {
        website: currentUser?.social_links?.website || "",
        twitter: currentUser?.social_links?.twitter || "",
        facebook: currentUser?.social_links?.facebook || "",
        instagram: currentUser?.social_links?.instagram || "",
        github: currentUser?.social_links?.github || "",
      },
    },
  });

  // Password form
  const {
    register: passwordRegister,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Init form with user data
  useEffect(() => {
    if (currentUser) {
      resetProfileForm({
        username: currentUser.username || "",
        bio: currentUser.bio || "",
        social_links: {
          website: currentUser.social_links?.website || "",
          twitter: currentUser.social_links?.twitter || "",
          facebook: currentUser.social_links?.facebook || "",
          instagram: currentUser.social_links?.instagram || "",
          github: currentUser.social_links?.github || "",
        },
      });

      setProfileImage(currentUser.profile_img || "");
      setEmailNotifications(currentUser.email_notifications !== false);
    }
  }, [currentUser, resetProfileForm]);

  // Handle profile form submission
  const onProfileSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);

      // Update profile
      const response = await userService.updateProfile(
        data.username,
        data.bio || "",
        data.social_links
      );

      // Update user data in context
      updateUserData({
        username: response.data.username,
        bio: response.data.bio,
        social_links: response.data.social_links,
      });

      showToast("Profile updated successfully", "success");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.response?.data?.error || "Failed to update profile");
      showToast("Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle password form submission
  const onPasswordSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);

      // Change password
      await authService.changePassword(data.currentPassword, data.newPassword);

      // Reset form
      resetPasswordForm();

      showToast("Password changed successfully", "success");
    } catch (error) {
      console.error("Error changing password:", error);
      setError(error.response?.data?.error || "Failed to change password");
      showToast("Failed to change password", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle image upload button click
  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Handle image file change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type and size
    if (!file.type.includes("image/")) {
      showToast("Please select an image file", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB
      showToast("Image size should be less than 5MB", "error");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload image
    handleImageUpload(file);
  };

  // Handle image upload
  const handleImageUpload = async (file) => {
    try {
      setUploadingImage(true);

      // Upload to S3
      const { fileUrl } = await uploadService.uploadToS3(file);

      // Update profile image in backend
      const response = await userService.updateProfileImage(fileUrl);

      // Update user data in context
      updateUserData({
        profile_img: response.data.profile_img,
      });

      // Update state
      setProfileImage(response.data.profile_img);
      setPreviewImage(null);

      showToast("Profile image updated successfully", "success");
    } catch (error) {
      console.error("Error uploading image:", error);
      showToast("Failed to upload image", "error");
    } finally {
      setUploadingImage(false);
    }
  };

  // Toggle email notifications
  const handleToggleEmailNotifications = async () => {
    try {
      // In a real app, this would call an API to update the setting
      // For now, we'll just toggle the state
      setEmailNotifications(!emailNotifications);

      showToast(
        `Email notifications ${!emailNotifications ? "enabled" : "disabled"}`,
        "success"
      );
    } catch (error) {
      console.error("Error toggling email notifications:", error);
      showToast("Failed to update notification settings", "error");
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    try {
      setLoading(true);

      // In a real app, this would call an API to delete the account
      showToast(
        "This is a demo feature. Account deletion not implemented.",
        "info"
      );

      // Close modal
      setShowDeleteAccountModal(false);
    } catch (error) {
      console.error("Error deleting account:", error);
      showToast("Failed to delete account", "error");
    } finally {
      setLoading(false);
    }
  };

  // Prepare tabs content
  const tabsContent = [
    {
      label: "Profile",
      icon: <User className="h-5 w-5 mr-2" />,
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Profile Settings
          </h2>

          {/* Profile Image */}
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
            <div className="flex flex-col items-center">
              <div className="relative group">
                <Avatar
                  src={previewImage || profileImage}
                  alt={currentUser?.fullname}
                  size="2xl"
                  className="h-32 w-32 border-4 border-white dark:border-gray-800 shadow-lg"
                />

                <div
                  className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={handleImageButtonClick}
                >
                  <Camera className="h-6 w-6 text-white" />
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div className="mt-4 flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleImageButtonClick}
                  disabled={uploadingImage}
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Upload
                </Button>
              </div>
            </div>

            <div className="flex-1">
              <form
                onSubmit={handleProfileSubmit(onProfileSubmit)}
                className="space-y-4"
              >
                {/* Username */}
                <Input
                  label="Username"
                  {...profileRegister("username")}
                  error={profileErrors.username?.message}
                  placeholder="username"
                  required
                  disabled={loading}
                  icon={<User className="h-5 w-5 text-gray-400" />}
                />

                {/* Bio */}
                <TextArea
                  label="Bio"
                  {...profileRegister("bio")}
                  error={profileErrors.bio?.message}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  disabled={loading}
                />

                {/* Social Links */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Social Links
                  </label>

                  <div className="space-y-4">
                    <Input
                      {...profileRegister("social_links.website")}
                      error={profileErrors.social_links?.website?.message}
                      placeholder="Website URL"
                      disabled={loading}
                      icon={<Globe className="h-5 w-5 text-gray-400" />}
                    />

                    <Input
                      {...profileRegister("social_links.twitter")}
                      error={profileErrors.social_links?.twitter?.message}
                      placeholder="Twitter URL"
                      disabled={loading}
                      icon={<Twitter className="h-5 w-5 text-gray-400" />}
                    />

                    <Input
                      {...profileRegister("social_links.facebook")}
                      error={profileErrors.social_links?.facebook?.message}
                      placeholder="Facebook URL"
                      disabled={loading}
                      icon={<Facebook className="h-5 w-5 text-gray-400" />}
                    />

                    <Input
                      {...profileRegister("social_links.instagram")}
                      error={profileErrors.social_links?.instagram?.message}
                      placeholder="Instagram URL"
                      disabled={loading}
                      icon={<Instagram className="h-5 w-5 text-gray-400" />}
                    />

                    <Input
                      {...profileRegister("social_links.github")}
                      error={profileErrors.social_links?.github?.message}
                      placeholder="GitHub URL"
                      disabled={loading}
                      icon={<Github className="h-5 w-5 text-gray-400" />}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                    isLoading={loading}
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ),
    },
    {
      label: "Account",
      icon: <Lock className="h-5 w-5 mr-2" />,
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Account Settings
          </h2>

          {/* User Info */}
          <div className="bg-gray-50 dark:bg-black rounded-lg p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Email Address
                </h3>
                <p className="text-base font-medium text-gray-900 dark:text-white mt-1">
                  {currentUser?.email}
                </p>
              </div>

              <div>
                <Badge
                  color={currentUser?.email_verified ? "success" : "warning"}
                >
                  {currentUser?.email_verified ? "Verified" : "Not Verified"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Change Password Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Change Password
            </h3>

            {error && (
              <Alert
                variant="error"
                title="Error"
                onClose={() => setError(null)}
                className="mb-4"
              >
                {error}
              </Alert>
            )}

            <form
              onSubmit={handlePasswordSubmit(onPasswordSubmit)}
              className="space-y-4"
            >
              <Input
                label="Current Password"
                {...passwordRegister("currentPassword")}
                type={showCurrentPassword ? "text" : "password"}
                error={passwordErrors.currentPassword?.message}
                placeholder="••••••••"
                required
                disabled={loading}
                icon={<Lock className="h-5 w-5 text-gray-400" />}
                appendIcon={
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                }
              />

              <Input
                label="New Password"
                {...passwordRegister("newPassword")}
                type={showNewPassword ? "text" : "password"}
                error={passwordErrors.newPassword?.message}
                placeholder="••••••••"
                required
                disabled={loading}
                icon={<Lock className="h-5 w-5 text-gray-400" />}
                appendIcon={
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                }
              />

              <Input
                label="Confirm New Password"
                {...passwordRegister("confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                error={passwordErrors.confirmPassword?.message}
                placeholder="••••••••"
                required
                disabled={loading}
                icon={<Lock className="h-5 w-5 text-gray-400" />}
                appendIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                }
              />

              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  isLoading={loading}
                >
                  Update Password
                </Button>
              </div>
            </form>
          </div>

          {/* Delete Account Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-4">
              Danger Zone
            </h3>

            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Once you delete your account, there is no going back. Please be
              certain.
            </p>

            <Button
              variant="danger"
              onClick={() => setShowDeleteAccountModal(true)}
              className="px-6"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </div>
      ),
    },
    {
      label: "Preferences",
      icon: <Bell className="h-5 w-5 mr-2" />,
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Preferences
          </h2>

          {/* Theme Settings */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Theme
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card
                className={`p-4 cursor-pointer ${
                  !darkMode ? "ring-2 ring-primary-500" : ""
                }`}
                onClick={() => setTheme(false)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Sun className="h-5 w-5 text-orange-500 mr-2" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      Light
                    </span>
                  </div>
                  {!darkMode && (
                    <div className="h-2 w-2 bg-primary-500 rounded-full"></div>
                  )}
                </div>
              </Card>

              <Card
                className={`p-4 cursor-pointer ${
                  darkMode ? "ring-2 ring-primary-500" : ""
                }`}
                onClick={() => setTheme(true)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Moon className="h-5 w-5 text-indigo-500 mr-2" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      Dark
                    </span>
                  </div>
                  {darkMode && (
                    <div className="h-2 w-2 bg-primary-500 rounded-full"></div>
                  )}
                </div>
              </Card>

              <Card className="p-4 cursor-pointer" onClick={toggleTheme}>
                <div className="flex items-center">
                  <div className="flex items-center">
                    <div className="relative">
                      <Sun className="h-5 w-5 text-orange-500" />
                      <Moon className="h-5 w-5 text-indigo-500 absolute top-0 left-0 opacity-40" />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white ml-2">
                      System
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Choose your preferred theme for the ChronoSpace interface.
            </p>
          </div>

          {/* Notification Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Notifications
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Email Notifications
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive email notifications for important updates
                  </p>
                </div>
                <div className="relative inline-block w-12 h-6">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    className="opacity-0 w-0 h-0"
                    checked={emailNotifications}
                    onChange={handleToggleEmailNotifications}
                  />
                  <label
                    htmlFor="emailNotifications"
                    className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors ${
                      emailNotifications
                        ? "bg-primary-500"
                        : "bg-gray-300 dark:bg-black"
                    }`}
                  >
                    <span
                      className={`absolute left-1 bottom-1 bg-white dark:bg-gray-200 w-4 h-4 rounded-full transition-transform ${
                        emailNotifications ? "transform translate-x-6" : ""
                      }`}
                    ></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  // Get currently active tab index
  const getActiveTabIndex = () => {
    const tabIds = tabsContent.map((tab) => tab.id);
    return tabIds.indexOf(activeTab) !== -1 ? tabIds.indexOf(activeTab) : 0;
  };

  return (
    <div className=" mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Settings Header */}
        <div className="bg-white dark:bg-black rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Settings Content */}
        <Card className="p-6">
          {/* Custom tabs navigation */}
          <div className="flex flex-col sm:flex-row mb-6 border-b border-gray-200 dark:border-gray-700">
            {tabsContent.map((tab) => (
              <button
                key={tab.label}
                className={`flex items-center px-4 py-3 font-medium text-sm border-b-2 -mb-px ${
                  activeTab === tab.label.toLowerCase()
                    ? "border-primary-500 text-primary-600 dark:text-primary-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-700"
                }`}
                onClick={() => setActiveTab(tab.label.toLowerCase())}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div>
            {
              tabsContent.find((tab) => tab.label.toLowerCase() === activeTab)
                ?.content
            }
          </div>
        </Card>
      </motion.div>

      {/* Delete Account Modal */}
      <Modal
        isOpen={showDeleteAccountModal}
        onClose={() => setShowDeleteAccountModal(false)}
        title="Delete Account"
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-center text-red-600 dark:text-red-400 mb-4">
            <svg
              className="h-16 w-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h3 className="text-lg font-bold text-center text-gray-900 dark:text-white">
            Are you absolutely sure?
          </h3>

          <p className="text-gray-600 dark:text-gray-400 text-center">
            This action cannot be undone. This will permanently delete your
            account and remove all your data from our servers.
          </p>

          <div className="pt-4">
            <Input
              placeholder="Type 'delete' to confirm"
              className="text-center"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="ghost"
              onClick={() => setShowDeleteAccountModal(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteAccount}
              disabled={loading}
              isLoading={loading}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SettingsPage;
