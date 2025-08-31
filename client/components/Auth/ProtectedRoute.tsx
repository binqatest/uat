import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  adminOnly?: boolean;
  businessOnly?: boolean;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  adminOnly = false,
  businessOnly = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user, isAdmin, isBusiness, hasRole } =
    useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check admin access
  if (adminOnly && !isAdmin()) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check business access
  if (businessOnly && !isBusiness()) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check specific role access
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
