// src/components/auth/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingScreen from "../ui/LoadingScreen";

const ProtectedRoute = () => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // Show loading screen while checking authentication
  if (loading) {
    return <LoadingScreen />;
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Render the protected route
  return <Outlet />;
};

export default ProtectedRoute;
