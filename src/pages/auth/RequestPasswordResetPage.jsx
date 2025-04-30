import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import { Mail, ChevronLeft } from "lucide-react";

// Form validation schema
const requestResetSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const RequestPasswordResetPage = () => {
  const { requestPasswordReset, loading } = useAuth();
  const { showToast } = useNotification();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(requestResetSchema),
    defaultValues: {
      email: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setError(null);

      // Request password reset
      await requestPasswordReset(data.email);

      // Show success message
      setSuccess(true);
      showToast("Password reset email sent", "success");
    } catch (error) {
      console.error("Password reset request error:", error);
      setError(
        error.response?.data?.error ||
          "Failed to request password reset. Please try again later."
      );
    }
  };

  // If request successful, show success message
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-black p-8 rounded-lg shadow-md max-w-md w-full"
        >
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-indigo-900 mb-4">
              <svg
                className="h-6 w-6 text-blue-600 dark:text-blue-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Check Your Email
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              If an account exists with the email you provided, we've sent
              instructions on how to reset your password. Please check your
              inbox and spam folder.
            </p>
            <div className="space-y-3">
              <Button variant="primary" href="/signin" className="w-full">
                Return to Sign In
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-black p-8 rounded-lg shadow-md max-w-md w-full"
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
            Enter your email to receive a password reset link
          </p>
        </div>

        {/* Error alert */}
        {error && (
          <Alert
            variant="error"
            title="Request Error"
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
              label="Email Address"
              {...register("email")}
              placeholder="john@example.com"
              type="email"
              error={errors.email?.message}
              required
              icon={<Mail className="h-5 w-5 text-gray-400" />}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
            isLoading={loading}
          >
            Send Reset Link
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

export default RequestPasswordResetPage;
