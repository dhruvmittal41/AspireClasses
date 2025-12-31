import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../auth/AuthProvider";

const PrivateadminRoute = () => {
  const { accessToken, user, authLoading } = useContext(AuthContext);

  if (authLoading) return null;

  const isAdmin = accessToken && user?.role === "admin";

  return isAdmin ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default PrivateadminRoute;
