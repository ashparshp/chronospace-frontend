import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { authService } from "../../services/authService";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import { CheckCircle, XCircle, Loader } from "lucide-react";

const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [error, setError] = useState(null);

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("error");
        setError("No verification token provided");
        return;
      }

      try {
        // Try GET verification first (direct link)
        try {
          await authService.verifyEmailGet(token);
          setStatus("success");
        } catch (getError) {
          // Fall back to POST if GET fails
          await authService.verifyEmailPost(token);
          setStatus("success");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
        setError(
          error.response?.data?.error ||
            "Email verification failed. The token may be invalid or expired."
        );
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-black p-8 rounded-lg shadow-md max-w-md w-full"
      >
        <div className="text-center">
          {status === "loading" ? (
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-indigo-900 mb-4">
              <Loader className="h-6 w-6 text-blue-600 dark:text-blue-300 animate-spin" />
            </div>
          ) : status === "success" ? (
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
          ) : (
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 mb-4">
              <XCircle className="h-6 w-6 text-red-600 dark:text-red-300" />
            </div>
          )}

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {status === "loading"
              ? "Verifying Your Email"
              : status === "success"
              ? "Email Verified Successfully"
              : "Verification Failed"}
          </h2>

          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {status === "loading"
              ? "Please wait while we verify your email address..."
              : status === "success"
              ? "Your email has been verified. You can now sign in to your account."
              : error}
          </p>

          {status !== "loading" && (
            <div className="space-y-3">
              {status === "success" ? (
                <Button variant="primary" href="/signin" className="w-full">
                  Sign In to Your Account
                </Button>
              ) : (
                <>
                  <Button variant="primary" href="/signup" className="w-full">
                    Try Signing Up Again
                  </Button>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    If you continue to face issues, please{" "}
                    <a
                      href="mailto:support@chronospace.com"
                      className="text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      contact support
                    </a>
                    .
                  </p>
                </>
              )}

              <Button variant="outline" href="/" className="w-full">
                Return to Homepage
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;
