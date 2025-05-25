import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicRoute({ children, forceAllow = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  // Always allow if forceAllow is true
  if (forceAllow) return children;

  // Default behavior
  return user ? <Navigate to="/dashboard" state={{ from: location }} /> : children;
}
