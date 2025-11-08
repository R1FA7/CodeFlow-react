import { Navigate, useLocation } from "react-router-dom";
import { useCurrentUser } from "../../../hooks/useCurrentUser";

const protectedRoutes = ["/host-contest", "/admin"];

export const ProtectedRoute = ({ children }) => {
  const { data: user } = useCurrentUser();
  const location = useLocation();
  const requestedPath = location.pathname;

  if (!user) return <Navigate to="/login" replace />;

  if (protectedRoutes.includes(requestedPath)) {
    // Example: only "setters" can host contests
    if (!user?.data?.setter && requestedPath === "/host-contest")
      return <Navigate to="/unauthorized" replace />;
    // Example: only non-setters can access admin
    if (user?.data?.setter && requestedPath === "/admin")
      return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
