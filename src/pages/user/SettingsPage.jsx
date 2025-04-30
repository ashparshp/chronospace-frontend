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
  Shield,
  Settings,
  CheckCircle,
  RefreshCw,
  UserCog,
  PenLine,
  Link as LinkIcon,
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
import Badge from "../../components/ui/Badge";

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
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const fileInputRef = useRef(null);

  // Profile form
  const {
    register: profileRegister,
    handleSubmit: handleProfileSubmit,
    reset: resetProfileForm,
    formState: { errors: profileErrors, isDirty: profileIsDirty },
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
    formState: { errors: passwordErrors, isDirty: passwordIsDirty },
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
      if (deleteConfirmText !== "delete") {
        showToast("Please type 'delete' to confirm", "error");
        return;
      }
      
      setLoading(true);

      // In a real app, this would call an API to delete the account
      showToast(
        "This is a demo feature. Account deletion not implemented.",
        "info"
      );

      // Close modal
      setShowDeleteAccountModal(false);
      setDeleteConfirmText("");
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
      id: "profile",
      icon: <User className="h-5 w-5 mr-2" />,
      content: (
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h2 className="font-playfair text-2xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">
                Profile Settings
              </h2>
              <p className="text-gray-600 dark:text-gray-400 font-montserrat">
                Manage your personal information and public profile
              </p>
            </div>
          </div>

          {/* Profile Image */}
          <Card className="bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
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
                    variant="white"
                    size="sm"
                    onClick={handleImageButtonClick}
                    disabled={uploadingImage}
                    isLoading={uploadingImage}
                    shadowDepth="shallow"
                    icon={<Upload className="h-4 w-4" />}
                    iconPosition="left"
                  >
                    Upload Photo
                  </Button>
                </div>
              </div>

              <div className="flex-1 w-full">
                <form
                  onSubmit={handleProfileSubmit(onProfileSubmit)}
                  className="space-y-5"
                >
                  {/* Username */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-montserrat">
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...profileRegister("username")}
                        className={`bg-white dark:bg-gray-900 focus:ring-violet-500 focus:border-violet-500 block w-full pl-10 pr-12 py-2.5 sm:text-sm border-gray-300 dark:border-gray-700 rounded-lg shadow-sm ${
                          profileErrors.username ? "border-red-500" : ""
                        }`}
                        placeholder="username"
                        disabled={loading}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <UserCog className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    {profileErrors.username && (
                      <p className="mt-1 text-sm text-red-600">
                        {profileErrors.username.message}
                      </p>
                    )}
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-montserrat">
                      Bio
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                        <PenLine className="h-5 w-5 text-gray-400" />
                      </div>
                      <textarea
                        {...profileRegister("bio")}
                        className={`bg-white dark:bg-gray-900 focus:ring-violet-500 focus:border-violet-500 block w-full pl-10 py-2.5 sm:text-sm border-gray-300 dark:border-gray-700 rounded-lg shadow-sm ${
                          profileErrors.bio ? "border-red-500" : ""
                        }`}
                        placeholder="Tell us about yourself..."
                        rows={4}
                        disabled={loading}
                      />
                    </div>
                    {profileErrors.bio && (
                      <p className="mt-1 text-sm text-red-600">
                        {profileErrors.bio.message}
                      </p>
                    )}
                  </div>

                  {/* Social Links */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 font-montserrat">
                      <div className="flex items-center">
                        <LinkIcon className="h-5 w-5 mr-2 text-indigo-500 dark:text-indigo-400" />
                        Social Links
                      </div>
                    </label>

                    <div className="space-y-4">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Globe className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          {...profileRegister("social_links.website")}
                          className={`bg-white dark:bg-gray-900 focus:ring-violet-500 focus:border-violet-500 block w-full pl-10 py-2.5 sm:text-sm border-gray-300 dark:border-gray-700 rounded-lg shadow-sm ${
                            profileErrors.social_links?.website
                              ? "border-red-500"
                              : ""
                          }`}
                          placeholder="Website URL"
                          disabled={loading}
                        />
                      </div>
                      {profileErrors.social_links?.website && (
                        <p className="mt-1 text-sm text-red-600">
                          {profileErrors.social_links.website.message}
                        </p>
                      )}

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Twitter className="h-5 w-5 text-blue-400" />
                        </div>
                        <input
                          {...profileRegister("social_links.twitter")}
                          className={`bg-white dark:bg-gray-900 focus:ring-violet-500 focus:border-violet-500 block w-full pl-10 py-2.5 sm:text-sm border-gray-300 dark:border-gray-700 rounded-lg shadow-sm ${
                            profileErrors.social_links?.twitter
                              ? "border-red-500"
                              : ""
                          }`}
                          placeholder="Twitter URL"
                          disabled={loading}
                        />
                      </div>
                      {profileErrors.social_links?.twitter && (
                        <p className="mt-1 text-sm text-red-600">
                          {profileErrors.social_links.twitter.message}
                        </p>
                      )}

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Facebook className="h-5 w-5 text-blue-600" />
                        </div>
                        <input
                          {...profileRegister("social_links.facebook")}
                          className={`bg-white dark:bg-gray-900 focus:ring-violet-500 focus:border-violet-500 block w-full pl-10 py-2.5 sm:text-sm border-gray-300 dark:border-gray-700 rounded-lg shadow-sm ${
                            profileErrors.social_links?.facebook
                              ? "border-red-500"
                              : ""
                          }`}
                          placeholder="Facebook URL"
                          disabled={loading}
                        />
                      </div>
                      {profileErrors.social_links?.facebook && (
                        <p className="mt-1 text-sm text-red-600">
                          {profileErrors.social_links.facebook.message}
                        </p>
                      )}

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Instagram className="h-5 w-5 text-pink-500" />
                        </div>
                        <input
                          {...profileRegister("social_links.instagram")}
                          className={`bg-white dark:bg-gray-900 focus:ring-violet-500 focus:border-violet-500 block w-full pl-10 py-2.5 sm:text-sm border-gray-300 dark:border-gray-700 rounded-lg shadow-sm ${
                            profileErrors.social_links?.instagram
                              ? "border-red-500"
                              : ""
                          }`}
                          placeholder="Instagram URL"
                          disabled={loading}
                        />
                      </div>
                      {profileErrors.social_links?.instagram && (
                        <p className="mt-1 text-sm text-red-600">
                          {profileErrors.social_links.instagram.message}
                        </p>
                      )}

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Github className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                        </div>
                        <input
                          {...profileRegister("social_links.github")}
                          className={`bg-white dark:bg-gray-900 focus:ring-violet-500 focus:border-violet-500 block w-full pl-10 py-2.5 sm:text-sm border-gray-300 dark:border-gray-700 rounded-lg shadow-sm ${
                            profileErrors.social_links?.github
                              ? "border-red-500"
                              : ""
                          }`}
                          placeholder="GitHub URL"
                          disabled={loading}
                        />
                      </div>
                      {profileErrors.social_links?.github && (
                        <p className="mt-1 text-sm text-red-600">
                          {profileErrors.social_links.github.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={loading || !profileIsDirty}
                      isLoading={loading}
                      glossy={true}
                      shadowDepth="deep"
                    >
                      Save Changes
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </Card>
        </div>
      ),
    },
    {
      label: "Account",
      id: "account",
      icon: <Lock className="h-5 w-5 mr-2" />,
      content: (
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h2 className="font-playfair text-2xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">
                Account Settings
              </h2>
              <p className="text-gray-600 dark:text-gray-400 font-montserrat">
                Manage your account details and security preferences
              </p>
            </div>
          </div>

          {/* User Info */}
          <Card className="bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white font-playfair mb-4">
                  Email Address
                </h3>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-2" />
                  <p className="text-base font-medium text-gray-900 dark:text-white font-montserrat">
                    {currentUser?.email}
                  </p>
                </div>
              </div>

              <div>
                <Badge
                  variant={currentUser?.email_verified ? "success" : "warning"}
                  className="py-1.5 px-3 text-sm font-medium"
                >
                  {currentUser?.email_verified ? (
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1.5" />
                      Verified
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <RefreshCw className="h-4 w-4 mr-1.5" />
                      Verification Needed
                    </div>
                  )}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Change Password Section */}
          <Card className="bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white font-playfair mb-4">
              Change Password
            </h3>

            {error && (
              <Alert
                variant="danger"
                title="Error"
                onClose={() => setError(null)}
                className="mb-4"
              >
                {error}
              </Alert>
            )}

            <form
              onSubmit={handlePasswordSubmit(onPasswordSubmit)}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-montserrat">
                  Current Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...passwordRegister("currentPassword")}
                    type={showCurrentPassword ? "text" : "password"}
                    className={`bg-white dark:bg-gray-900 focus:ring-violet-500 focus:border-violet-500 block w-full pl-10 pr-12 py-2.5 sm:text-sm border-gray-300 dark:border-gray-700 rounded-lg shadow-sm ${
                      passwordErrors.currentPassword ? "border-red-500" : ""
                    }`}
                    placeholder="••••••••"
                    disabled={loading}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                {passwordErrors.currentPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {passwordErrors.currentPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-montserrat">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...passwordRegister("newPassword")}
                    type={showNewPassword ? "text" : "password"}
                    className={`bg-white dark:bg-gray-900 focus:ring-violet-500 focus:border-violet-500 block w-full pl-10 pr-12 py-2.5 sm:text-sm border-gray-300 dark:border-gray-700 rounded-lg shadow-sm ${
                      passwordErrors.newPassword ? "border-red-500" : ""
                    }`}
                    placeholder="••••••••"
                    disabled={loading}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                {passwordErrors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {passwordErrors.newPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-montserrat">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...passwordRegister("confirmPassword")}
                    type={showConfirmPassword ? "text" : "password"}
                    className={`bg-white dark:bg-gray-900 focus:ring-violet-500 focus:border-violet-500 block w-full pl-10 pr-12 py-2.5 sm:text-sm border-gray-300 dark:border-gray-700 rounded-lg shadow-sm ${
                      passwordErrors.confirmPassword ? "border-red-500" : ""
                    }`}
                    placeholder="••••••••"
                    disabled={loading}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                {passwordErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {passwordErrors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading || !passwordIsDirty}
                  isLoading={loading}
                  glossy={true}
                  shadowDepth="deep"
                >
                  Update Password
                </Button>
              </div>
            </form>
          </Card>

          {/* Delete Account Section */}
          <Card className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 shadow-sm p-6">
            <div className="flex items-start">
              <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-2 mr-4">
                <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-600 dark:text-red-400 font-playfair mb-2">
                  Danger Zone
                </h3>
                <p className="text-gray-600 dark:text-gray-400 font-montserrat mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>

                <Button
                  variant="danger"
                  onClick={() => setShowDeleteAccountModal(true)}
                  shadowDepth="shallow"
                  icon={<Trash2 className="h-4 w-4" />}
                  iconPosition="left"
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </Card>
        </div>
      ),
    },
    {
      label: "Preferences",
      id: "preferences",
      icon: <Settings className="h-5 w-5 mr-2" />,
      content: (
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h2 className="font-playfair text-2xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">
                Preferences
              </h2>
              <p className="text-gray-600 dark:text-gray-400 font-montserrat">
                Customize your ChronoSpace experience
              </p>
            </div>
          </div>

          {/* Theme Settings */}
          <Card className="bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white font-playfair mb-4">
              Theme
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div 
                className={`relative bg-white dark:bg-gray-800 rounded-xl p-4 cursor-pointer border-2 transition-all duration-200 ${
                  !darkMode 
                    ? "border-violet-500 shadow-md" 
                    : "border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-700"
                }`}
                onClick={() => setTheme(false)}
              >
                <div className="flex items-center mb-3">
                  <div className="bg-amber-100 rounded-full p-2 mr-3">
                    <Sun className="h-5 w-5 text-amber-600" />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white font-montserrat">
                    Light
                  </span>
                </div>
                <div className="rounded-lg bg-gray-100 p-3 flex justify-between items-center">
                  <div className="w-8 h-3 bg-indigo-600 rounded-full"></div>
                  <div className="w-4 h-3 bg-gray-400 rounded-full"></div>
                </div>
                {!darkMode && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle className="h-5 w-5 text-violet-500" />
                  </div>
                )}
              </div>

              <div 
                className={`relative bg-gray-900 dark:bg-black rounded-xl p-4 cursor-pointer border-2 transition-all duration-200 ${
                  darkMode 
                    ? "border-violet-500 shadow-md" 
                    : "border-gray-800 hover:border-violet-700"
                }`}
                onClick={() => setTheme(true)}
              >
                <div className="flex items-center mb-3">
                  <div className="bg-indigo-900/50 rounded-full p-2 mr-3">
                    <Moon className="h-5 w-5 text-indigo-400" />
                  </div>
                  <span className="font-medium text-white font-montserrat">
                    Dark
                  </span>
                </div>
                <div className="rounded-lg bg-gray-800 p-3 flex justify-between items-center">
                  <div className="w-8 h-3 bg-violet-500 rounded-full"></div>
                  <div className="w-4 h-3 bg-gray-600 rounded-full"></div>
                </div>
                {darkMode && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle className="h-5 w-5 text-violet-500" />
                  </div>
                )}
              </div>

              <div 
                className="relative bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-black rounded-xl p-4 cursor-pointer border-2 border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-700 transition-all duration-200"
                onClick={toggleTheme}
              >
                <div className="flex items-center mb-3">
                  <div className="bg-gradient-to-br from-amber-100 to-indigo-100 dark:from-amber-900/30 dark:to-indigo-900/30 rounded-full p-2 mr-3 relative">
                    <Sun className="h-5 w-5 text-amber-600 dark:text-amber-400 absolute top-2 left-2 opacity-50" />
                    <Moon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white font-montserrat">
                    System
                  </span>
                </div>
                <div className="rounded-lg bg-gradient-to-r from-gray-100 to-gray-800 p-3 flex justify-between items-center">
                  <div className="w-8 h-3 bg-gradient-to-r from-amber-500 to-violet-500 rounded-full"></div>
                  <div className="w-4 h-3 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full"></div>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 font-montserrat">
              Choose your preferred theme for the ChronoSpace interface.
            </p>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white font-playfair mb-4">
              Notifications
            </h3>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="bg-violet-100 dark:bg-violet-900/30 rounded-full p-2 mr-3 flex-shrink-0">
                    <Bell className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white font-montserrat">
                      Email Notifications
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-montserrat mt-1">
                      Receive email notifications for important updates, new followers, and comments on your content
                    </p>
                  </div>
                </div>
                <div className="relative inline-block w-12 h-6 flex-shrink-0">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    className="opacity-0 w-0 h-0"
                    checked={emailNotifications}
                    onChange={handleToggleEmailNotifications}
                  />
                  <label
                    htmlFor="emailNotifications"
                    className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors duration-200 ${
                      emailNotifications
                        ? "bg-violet-500"
                        : "bg-gray-300 dark:bg-gray-700"
                    }`}
                  >
                    <span
                      className={`absolute left-1 bottom-1 bg-white dark:bg-gray-200 w-4 h-4 rounded-full transition-transform duration-200 ${
                        emailNotifications ? "transform translate-x-6" : ""
                      }`}
                    ></span>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-full p-2 mr-3 flex-shrink-0">
                    <RefreshCw className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white font-montserrat">
                      Notification Frequency
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-montserrat mt-1">
                      How often would you like to receive notification emails?
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <select className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-violet-500 focus:border-violet-500">
                    <option>Immediately</option>
                    <option>Daily digest</option>
                    <option>Weekly digest</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Settings Header - Styled to match new design */}
        <div className="rounded-2xl overflow-hidden shadow-lg">
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
              <motion.h1
                className="font-playfair text-3xl md:text-4xl font-bold mb-2 tracking-tight leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">
                  Account Settings
                </span>
              </motion.h1>
              
              <motion.p
                className="font-montserrat text-lg leading-relaxed text-gray-700 dark:text-gray-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Manage your profile, account security, and preferences
              </motion.p>
            </div>
          </div>
        </div>

        {/* Settings Content with improved tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden">
          {/* Custom tabs navigation - Enhanced */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex overflow-x-auto scrollbar-hide">
              {tabsContent.map((tab) => (
                <button
                  key={tab.id}
                  className={`flex items-center whitespace-nowrap px-6 py-4 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? "border-b-2 border-violet-500 text-violet-600 dark:text-violet-400 font-montserrat"
                      : "border-b-2 border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-700 font-montserrat"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="p-6">
            {
              tabsContent.find((tab) => tab.id === activeTab)
                ?.content
            }
          </div>
        </div>
      </motion.div>

      {/* Delete Account Modal - Enhanced */}
      <Modal
        isOpen={showDeleteAccountModal}
        onClose={() => {
          setShowDeleteAccountModal(false);
          setDeleteConfirmText("");
        }}
        title="Delete Account"
        size="md"
      >
        <div className="space-y-5">
          <div className="flex items-center justify-center">
            <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-4">
              <Trash2 className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 font-playfair">
              Delete Your Account?
            </h3>

            <p className="text-gray-600 dark:text-gray-400 font-montserrat mb-2">
              This action cannot be undone. This will permanently delete your
              account and remove all your data from our servers.
            </p>
            
            <div className="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-4 font-montserrat border border-red-200 dark:border-red-800/30">
              <p className="font-medium">Warning: All the following will be deleted:</p>
              <ul className="mt-2 list-disc list-inside">
                <li>Your profile and personal information</li>
                <li>All your published blogs and drafts</li>
                <li>Your comments and interaction history</li>
              </ul>
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-montserrat">
              Type "delete" to confirm
            </label>
            <input
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="delete"
              className="bg-white dark:bg-gray-900 focus:ring-red-500 focus:border-red-500 block w-full py-2.5 px-4 sm:text-sm border-gray-300 dark:border-gray-700 rounded-lg shadow-sm"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="white"
              onClick={() => {
                setShowDeleteAccountModal(false);
                setDeleteConfirmText("");
              }}
              disabled={loading}
              shadowDepth="shallow"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteAccount}
              disabled={loading || deleteConfirmText !== "delete"}
              isLoading={loading}
              shadowDepth="deep"
              glossy={true}
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
