import { Navigate, useLocation } from "react-router-dom";
import { useCurrentUser } from "../../../hooks/useCurrentUser";
import { LoadingSpinner } from "./LoadingSpinner";

const protectedRoutes = ["/host-contest", "/admin"];

export const ProtectedRoute = ({ children }) => {
  const { data: user, isLoading } = useCurrentUser();
  const location = useLocation();
  const requestedPath = location.pathname;
  console.log(user?.data);
  if (isLoading) return <LoadingSpinner />;

  if (!user?.data) return <Navigate to="/login" replace />;

  console.log(requestedPath);
  if (protectedRoutes.includes(requestedPath)) {
    if (!user?.data?.setter && requestedPath === "/host-contest")
      return <Navigate to="/unauthorized" replace />;
    if (!user?.data?.admin && requestedPath === "/admin")
      return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
