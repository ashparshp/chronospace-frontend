import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RoleBasedRoute from "./components/auth/RoleBasedRoute";
import LoadingScreen from "./components/ui/LoadingScreen";
import MainLayout from "./components/layouts/MainLayout";
import RequestPasswordResetPage from "./pages/auth/RequestPasswordResetPage";

const HomePage = lazy(() => import("./pages/HomePage"));
const SignUpPage = lazy(() => import("./pages/auth/SignUpPage"));
const SignInPage = lazy(() => import("./pages/auth/SignInPage"));
const VerifyEmailPage = lazy(() => import("./pages/auth/VerifyEmailPage"));
const ResetPasswordPage = lazy(() => import("./pages/auth/ResetPasswordPage"));
const BlogPage = lazy(() => import("./pages/blog/BlogPage"));
const SearchPage = lazy(() => import("./pages/blog/SearchPage"));
const TagPage = lazy(() => import("./pages/blog/TagPage"));
const ProfilePage = lazy(() => import("./pages/user/ProfilePage"));
const SettingsPage = lazy(() => import("./pages/user/SettingsPage"));
const EditorPage = lazy(() => import("./pages/blog/EditorPage"));
const DashboardPage = lazy(() => import("./pages/user/DashboardPage"));
const AdminDashboardPage = lazy(() =>
  import("./pages/admin/AdminDashboardPage")
);
const AdminUsersPage = lazy(() => import("./pages/admin/AdminUsersPage"));
const AdminBlogsPage = lazy(() => import("./pages/admin/AdminBlogsPage"));
const AdminBloggerApplicationsPage = lazy(() =>
  import("./pages/admin/AdminBloggerApplicationsPage")
);
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<LoadingScreen />}>
        <Routes location={location} key={location.pathname}>
          {/* Public routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="blog/:blogId" element={<BlogPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="tag/:tag" element={<TagPage />} />
            <Route path="profile/:username" element={<ProfilePage />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route
              path="/request-password-reset"
              element={<RequestPasswordResetPage />}
            />
          </Route>

          {/* Auth routes */}
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />

          {/* Protected routes (require login) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/settings" element={<MainLayout />}>
              <Route index element={<SettingsPage />} />
            </Route>
            <Route path="/dashboard" element={<MainLayout />}>
              <Route index element={<DashboardPage />} />
            </Route>
          </Route>

          {/* Blogger & Admin routes */}
          <Route element={<RoleBasedRoute roles={["blogger", "admin"]} />}>
            <Route path="/editor" element={<MainLayout />}>
              <Route index element={<EditorPage />} />
              <Route path=":blogId" element={<EditorPage />} />
            </Route>
          </Route>

          {/* Admin routes */}
          <Route element={<RoleBasedRoute roles={["admin"]} />}>
            <Route path="/admin" element={<MainLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="blogs" element={<AdminBlogsPage />} />
              <Route
                path="applications"
                element={<AdminBloggerApplicationsPage />}
              />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

export default App;
