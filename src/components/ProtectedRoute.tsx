import { useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { debugRender, debugMount, debugUnmount } from "@/lib/renderDebug";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, isAdmin, loading } = useAuth();

  // Defensive: remember if we ever rendered children successfully.
  // Once authenticated, don't fall back to spinner on transient loading flickers.
  const wasAuthenticatedRef = useRef(false);

  if (user && !loading) {
    wasAuthenticatedRef.current = true;
  }

  useEffect(() => {
    debugMount("ProtectedRoute");
    return () => debugUnmount("ProtectedRoute");
  }, []);

  // If loading but we already had a valid user, keep rendering children (no spinner).
  const skipSpinner = loading && wasAuthenticatedRef.current && !!user;

  const decision = skipSpinner
    ? "RENDER_CHILDREN_SKIP_SPINNER"
    : loading
      ? "SPINNER"
      : !user
        ? "REDIRECT_AUTH"
        : (requireAdmin && !isAdmin)
          ? "REDIRECT_TODAY"
          : "RENDER_CHILDREN";

  debugRender("ProtectedRoute", { loading, hasUser: !!user, isAdmin, requireAdmin, decision, wasAuthenticated: wasAuthenticatedRef.current });

  if (decision === "SPINNER") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (decision === "REDIRECT_AUTH") return <Navigate to="/auth" replace />;
  if (decision === "REDIRECT_TODAY") return <Navigate to="/today" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
