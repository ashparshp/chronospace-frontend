import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

// Form validation schema
const signinSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const SignInPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { login, loginWithGoogle, loading } = useAuth();
  const { showToast } = useNotification();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  // Get redirect path from location state
  const from = location.state?.from || "/";

  // Check if user was redirected after email verification
  useEffect(() => {
    // Check for 'verified=true' in the URL params
    const verifiedParam = searchParams.get("verified");
    if (verifiedParam === "true") {
      setVerificationSuccess(true);
      showToast("Email verified successfully! You can now sign in.", "success");
    }
  }, [searchParams, showToast]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setError(null);

      // Sign in user
      await login(data.email, data.password);

      // Show success message and redirect
      showToast("Sign in successful!", "success");
      navigate(from);
    } catch (error) {
      console.error("Sign in error:", error);
      setError(
        error.response?.data?.error ||
          "Sign in failed. Please check your credentials and try again."
      );
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      setError(null);
      await loginWithGoogle();
      navigate(from);
    } catch (error) {
      console.error("Google login error:", error);
      setError(
        error.response?.data?.error || "Google login failed. Please try again."
      );
    }
  };

  // Custom side content for the auth layout
  const sideContent = (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Welcome Back to ChronoSpace</h2>
      <p className="text-lg opacity-90">
        Sign in to continue your journey. Discover new content, engage with
        fellow writers, and share your own stories with our growing community.
      </p>

      <div className="space-y-6 pt-4">
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
            <h3 className="text-white font-medium">Discover Content</h3>
            <p className="text-white/80 text-sm">
              Explore articles from our talented writers
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
            <h3 className="text-white font-medium">Join the Conversation</h3>
            <p className="text-white/80 text-sm">
              Engage with content through comments and likes
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
            <h3 className="text-white font-medium">Personalized Experience</h3>
            <p className="text-white/80 text-sm">
              Follow your favorite authors and topics
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your account"
      sideContent={sideContent}
      sideBackground="gradient"
      footerLinks={[
        { to: "/signup", label: "Don't have an account? Sign up" },
        { to: "/request-password-reset", label: "Forgot password?" },
      ]}
    >
      {/* Verification Success Alert */}
      {verificationSuccess && (
        <Alert
          variant="success"
          title="Email Verified"
          onClose={() => setVerificationSuccess(false)}
          className="mb-6"
        >
          Your email has been successfully verified. You can now sign in to your
          account.
        </Alert>
      )}

      {/* Error alert */}
      {error && (
        <Alert
          variant="error"
          title="Sign In Error"
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

        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password <span className="text-red-500">*</span>
            </label>
          </div>
          <div className="mt-1">
            <Input
              {...register("password")}
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              error={errors.password?.message}
              autoComplete="current-password"
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
        </div>

        <Button
          type="submit"
          variant="gradient"
          className="w-full"
          disabled={loading}
          isLoading={loading}
        >
          Sign In
        </Button>
      </form>

      {/* Divider */}
      <div className="my-6 flex items-center">
        <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
        <span className="flex-shrink mx-4 text-gray-600 dark:text-gray-400">
          or
        </span>
        <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
      </div>

      {/* Social login */}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogleLogin}
        disabled={loading}
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
        Continue with Google
      </Button>
    </AuthLayout>
  );
};

export default SignInPage;
