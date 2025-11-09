import { Navigate, useLocation } from "react-router-dom";
import { useCurrentUser } from "../../../hooks/useCurrentUser";

const protectedRoutes = ["/host-contest", "/admin"];

export const ProtectedRoute = ({ children }) => {
  const { data: user } = useCurrentUser();
  const location = useLocation();
  const requestedPath = location.pathname;
  console.log(user?.data);
  if (!user) return <Navigate to="/login" replace />;

  console.log(requestedPath);
  if (protectedRoutes.includes(requestedPath)) {
    if (!user?.data?.setter && requestedPath === "/host-contest")
      return <Navigate to="/unauthorized" replace />;
    if (!user?.data?.admin && requestedPath === "/admin")
      return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
