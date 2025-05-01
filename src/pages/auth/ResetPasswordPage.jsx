import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import {
  Eye,
  EyeOff,
  Lock,
  Check,
  ArrowRight,
  KeyRound,
  ShieldCheck,
} from "lucide-react";
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

  // Custom side content for the auth layout
  const sideContent = (
    <div className="space-y-6 text-gray-50">
      <motion.h2
        className="text-3xl font-bold font-playfair"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Secure Your Account
      </motion.h2>

      <motion.p
        className="text-lg opacity-90 font-montserrat leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Create a strong password to protect your ChronoSpace account. Your
        security is important to us.
      </motion.p>

      <motion.div
        className="space-y-6 pt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 h-6 w-6 bg-white/20 rounded-full flex items-center justify-center mr-3">
            <svg
              className="h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-medium font-playfair">
              Strong Passwords
            </h3>
            <p className="text-white/80 text-sm font-montserrat">
              Mix letters, numbers, and symbols for better security
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex-shrink-0 h-6 w-6 bg-white/20 rounded-full flex items-center justify-center mr-3">
            <svg
              className="h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-medium font-playfair">
              Unique Passwords
            </h3>
            <p className="text-white/80 text-sm font-montserrat">
              Use different passwords for different services
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex-shrink-0 h-6 w-6 bg-white/20 rounded-full flex items-center justify-center mr-3">
            <svg
              className="h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-medium font-playfair">
              Regular Updates
            </h3>
            <p className="text-white/80 text-sm font-montserrat">
              Change your password periodically for added security
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );

  // If reset successful, show success message
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full border border-gray-100 dark:border-gray-700"
        >
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
              <ShieldCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 font-playfair">
              Password Reset Successful
            </h2>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300 font-montserrat leading-relaxed">
                Your password has been reset successfully. You can now sign in
                with your new password to access your account.
              </p>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300 p-3 rounded-lg text-sm font-montserrat">
                <p>
                  For security reasons, you'll be logged out of any other
                  devices where you were previously signed in.
                </p>
              </div>
            </div>
            <div className="mt-8 space-y-3">
              <Button
                variant="primary"
                href="/signin"
                className="w-full"
                shadowDepth="deep"
                glossy={true}
                icon={<ArrowRight className="h-4 w-4 ml-1" />}
                iconPosition="right"
              >
                <span className="font-montserrat">Proceed to Sign In</span>
              </Button>
              <Button
                variant="white"
                href="/"
                className="w-full"
                shadowDepth="shallow"
              >
                <span className="font-montserrat">Return to Homepage</span>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <AuthLayout
      title="Reset Your Password"
      subtitle="Enter your new password below"
      sideContent={sideContent}
      sideBackground="gradient"
      footerLinks={[
        { to: "/signin", label: "Remember your password? Sign in" },
      ]}
    >
      {/* Error alert */}
      {error && (
        <Alert
          variant="error"
          title="Password Reset Error"
          onClose={() => setError(null)}
          className="mb-6"
        >
          <span className="font-montserrat">{error}</span>
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Input
            label="New Password"
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            error={errors.password?.message}
            required
            icon={<KeyRound className="h-5 w-5 text-gray-400" />}
            className="bg-white dark:bg-gray-900"
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
          {errors.password && (
            <p className="mt-1 text-sm text-red-500 font-montserrat">
              {errors.password.message}
            </p>
          )}
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
            className="bg-white dark:bg-gray-900"
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
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500 font-montserrat">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="mt-1">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-montserrat">
            Password must be 6-20 characters and include at least one uppercase
            letter, one lowercase letter, and one number.
          </p>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-6"
          disabled={loading}
          isLoading={loading}
          shadowDepth="deep"
          glossy={true}
        >
          <span className="font-montserrat">Reset Password</span>
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
