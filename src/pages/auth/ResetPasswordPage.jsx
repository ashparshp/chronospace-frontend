// src/pages/auth/ResetPasswordPage.jsx
import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import { Eye, EyeOff, Lock, ChevronLeft } from "lucide-react";
import { VALIDATION } from "../../config/constants";

// Form validation schema
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(20, "Password must be less than 20 characters long")
      .regex(
        VALIDATION.PASSWORD_REGEX,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword, loading } = useAuth();
  const { showToast } = useNotification();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setError(null);

      // Reset password
      await resetPassword(token, data.password);

      // Show success message
      setSuccess(true);
      showToast("Password has been reset successfully", "success");
    } catch (error) {
      console.error("Password reset error:", error);
      setError(
        error.response?.data?.error ||
          "Password reset failed. The token may be invalid or expired."
      );
    }
  };

  // If reset successful, show success message
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full"
        >
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 mb-4">
              <svg
                className="h-6 w-6 text-green-600 dark:text-green-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Password Reset Successful
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Your password has been reset successfully. You can now sign in
              with your new password.
            </p>
            <div className="space-y-3">
              <Button variant="primary" href="/signin" className="w-full">
                Sign In
              </Button>
              <Button variant="outline" href="/" className="w-full">
                Return to Homepage
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full"
      >
        <div className="mb-6">
          <Link
            to="/"
            className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to home
          </Link>
        </div>

        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 text-transparent bg-clip-text">
              ChronoSpace
            </h1>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Reset Your Password
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Enter your new password below
          </p>
        </div>

        {/* Error alert */}
        {error && (
          <Alert
            variant="error"
            title="Password Reset Error"
            onClose={() => setError(null)}
            className="mb-6"
          >
            {error}
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Input
              label="New Password"
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              error={errors.password?.message}
              required
              icon={<Lock className="h-5 w-5 text-gray-400" />}
              appendIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              }
            />
          </div>

          <div>
            <Input
              label="Confirm New Password"
              {...register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              required
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
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
            isLoading={loading}
          >
            Reset Password
          </Button>
        </form>

        <p className="mt-8 text-center text-gray-600 dark:text-gray-400">
          Remember your password?{" "}
          <Link
            to="/signin"
            className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
