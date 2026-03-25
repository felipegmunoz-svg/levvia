import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { debugRender, debugMount, debugUnmount } from "@/lib/renderDebug";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, isAdmin, loading } = useAuth();

  useEffect(() => {
    debugMount("ProtectedRoute");
    return () => debugUnmount("ProtectedRoute");
  }, []);

  const decision = loading ? "SPINNER" : !user ? "REDIRECT_AUTH" : (requireAdmin && !isAdmin) ? "REDIRECT_TODAY" : "RENDER_CHILDREN";
  debugRender("ProtectedRoute", { loading, hasUser: !!user, isAdmin, requireAdmin, decision });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (requireAdmin && !isAdmin) return <Navigate to="/today" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
