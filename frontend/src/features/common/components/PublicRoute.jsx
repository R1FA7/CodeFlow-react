import { Navigate } from "react-router-dom";
import { useCurrentUser } from "../../../hooks/useCurrentUser";
import { LoadingSpinner } from "./LoadingSpinner";
export const PublicRoute = ({ children }) => {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) return <LoadingSpinner />;
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
