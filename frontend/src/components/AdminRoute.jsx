import { Navigate, useLocation } from "react-router-dom";
import { isAdmin, isAuthenticated } from "../lib/auth";

function AdminRoute({ children }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;
