import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicRoute({ children }) {
  const { user, loading, isPasswordRecovery } = useAuth();

  if (loading) return null;

  // ✅ Allow reset-password route even if user is temporarily authenticated due to recovery token
  if (user && !isPasswordRecovery) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
