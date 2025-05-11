import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null; // or return a <LoadingSpinner /> if you prefer

  return user ? children : <Navigate to="/login" />;
}
