import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Eye, EyeOff, User, Mail, Lock, Check, ArrowRight } from "lucide-react";
import { VALIDATION } from "../../config/constants";

// Form validation schema
const signupSchema = z
  .object({
    fullname: z
      .string()
      .min(3, "Full name must be at least 3 characters long")
      .max(50, "Full name must be less than 50 characters long"),
    email: z.string().email("Please enter a valid email address"),
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

const SignUpPage = () => {
  const navigate = useNavigate();
  const { register: signup, loading, loginWithGoogle } = useAuth();
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
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setError(null);

      // Register user
      const response = await signup({
        fullname: data.fullname,
        email: data.email,
        password: data.password,
      });

      // Show success message
      setSuccess(true);
      showToast(
        "Registration successful! Please check your email to verify your account.",
        "success"
      );

      // Clear form (not needed with success state redirect)
    } catch (error) {
      console.error("Registration error:", error);
      setError(
        error.response?.data?.error || "Registration failed. Please try again."
      );
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      setError(null);
      await loginWithGoogle();
      navigate("/");
    } catch (error) {
      console.error("Google login error:", error);
      setError(
        error.response?.data?.error || "Google login failed. Please try again."
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
        Join ChronoSpace
      </motion.h2>

      <motion.p
        className="text-lg opacity-90 font-montserrat leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Create an account to unlock the full potential of ChronoSpace. Share
        your thoughts, follow your favorite writers, and become part of our
        growing community.
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
              Personalized Experience
            </h3>
            <p className="text-white/80 text-sm font-montserrat">
              Discover blogs tailored to your interests
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
              Engage with the Community
            </h3>
            <p className="text-white/80 text-sm font-montserrat">
              Comment, like, and share your favorite posts
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
              Become a Blogger
            </h3>
            <p className="text-white/80 text-sm font-montserrat">
              Share your knowledge and passion with the world
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );

  // If registration successful, show verification message
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
              <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 font-playfair">
              Registration Successful
            </h2>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300 font-montserrat leading-relaxed">
                We've sent a verification link to your email address. Please
                check your inbox and verify your account to get started.
              </p>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300 p-3 rounded-lg text-sm font-montserrat">
                <p>
                  Don't see the email? Check your spam folder or contact support
                  if you need assistance.
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
      title="Create an Account"
      subtitle="Join our community of bloggers and readers"
      sideContent={sideContent}
      sideBackground="gradient"
      footerLinks={[
        { to: "/signin", label: "Already have an account? Sign in" },
      ]}
    >
      {/* Error alert */}
      {error && (
        <Alert
          variant="error"
          title="Registration Error"
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
            label="Full Name"
            {...register("fullname")}
            placeholder="John Doe"
            error={errors.fullname?.message}
            required
            icon={<User className="h-5 w-5 text-gray-400" />}
            className="bg-white dark:bg-gray-900"
          />
          {errors.fullname && (
            <p className="mt-1 text-sm text-red-500 font-montserrat">
              {errors.fullname.message}
            </p>
          )}
        </div>

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

        <div>
          <Input
            label="Password"
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            error={errors.password?.message}
            required
            icon={<Lock className="h-5 w-5 text-gray-400" />}
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
            label="Confirm Password"
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
          <span className="font-montserrat">Create Account</span>
        </Button>
      </form>

      {/* Divider */}
      <div className="my-6 flex items-center">
        <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
        <span className="flex-shrink mx-4 text-gray-600 dark:text-gray-400 font-montserrat">
          or
        </span>
        <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
      </div>

      {/* Social login */}
      <Button
        type="button"
        variant="white"
        className="w-full bg-black/10 hover:bg-black/20 text-gray-900 dark:text-white dark:bg-white/10 dark:hover:bg-white/20"
        onClick={handleGoogleLogin}
        disabled={loading}
        shadowDepth="shallow"
      >
        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
          <path fill="none" d="M1 1h22v22H1z" />
        </svg>
        <span className="font-montserrat">Continue with Google</span>
      </Button>
    </AuthLayout>
  );
};

export default SignUpPage;
