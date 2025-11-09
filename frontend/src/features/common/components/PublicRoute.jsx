import { Navigate } from "react-router-dom";
import { useCurrentUser } from "../../../hooks/useCurrentUser";
export const PublicRoute = ({ children }) => {
  const { data: user } = useCurrentUser();
  if (user) {
    return user?.data?.admin ? (
      <Navigate to="/admin" replace />
    ) : user?.data?.settter ? (
      <Navigate to="/setter" replace />
    ) : (
      <Navigate to="/overview" replace />
    );
  }
  return children;
};
