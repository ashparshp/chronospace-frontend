import { useState } from "react";
import { Link } from "react-router-dom";
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
import { Mail, KeyRound, MoveLeft, ArrowRight, Send, Mailbox } from "lucide-react";

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

  // Custom side content for the auth layout
  const sideContent = (
    <div className="space-y-6 text-gray-50">
      <motion.h2 
        className="text-3xl font-bold font-playfair"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Recover Your Account
      </motion.h2>
      
      <motion.p 
        className="text-lg opacity-90 font-montserrat leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        We understand that forgetting passwords happens. We'll help you regain access to your ChronoSpace account quickly and securely.
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
            <h3 className="text-white font-medium font-playfair">Check Your Email</h3>
            <p className="text-white/80 text-sm font-montserrat">
              We'll send a secure reset link to your email
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
            <h3 className="text-white font-medium font-playfair">Follow the Link</h3>
            <p className="text-white/80 text-sm font-montserrat">
              Open the link and set a new secure password
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
            <h3 className="text-white font-medium font-playfair">Regain Access</h3>
            <p className="text-white/80 text-sm font-montserrat">
              Log back in and continue enjoying ChronoSpace
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );

  // If request successful, show success message
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
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mb-6">
              <Mailbox className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 font-playfair">
              Check Your Email
            </h2>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300 font-montserrat leading-relaxed">
                If an account exists with the email you provided, we've sent instructions on how to reset your password. Please check your inbox and spam folder.
              </p>
              <div className="bg-violet-50 dark:bg-violet-900/20 text-violet-800 dark:text-violet-300 p-3 rounded-lg text-sm font-montserrat">
                <p>The reset link will expire in 15 minutes for security purposes. If you don't see the email, you can request another one.</p>
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
                <span className="font-montserrat">Return to Sign In</span>
              </Button>
              <Button 
                variant="white" 
                href="/" 
                className="w-full"
                shadowDepth="shallow"
                icon={<MoveLeft className="h-4 w-4 mr-1" />}
                iconPosition="left"
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
      subtitle="Enter your email to receive a password reset link"
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
          title="Request Error"
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
            label="Email Address"
            {...register("email")}
            placeholder="john@example.com"
            type="email"
            error={errors.email?.message}
            required
            icon={<Mail className="h-5 w-5 text-gray-400" />}
            className="bg-white dark:bg-gray-900"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500 font-montserrat">
              {errors.email.message}
            </p>
          )}
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 font-montserrat mt-2">
          We'll send a secure link to this email address that will allow you to reset your password.
        </p>

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-6"
          disabled={loading}
          isLoading={loading}
          shadowDepth="deep"
          glossy={true}
          icon={<Send className="h-4 w-4 ml-1" />}
          iconPosition="right"
        >
          <span className="font-montserrat">Send Reset Link</span>
        </Button>
      </form>
    </AuthLayout>
  );
};

export default RequestPasswordResetPage;
