import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateadminRoute = () => {
  const isAdminAuthenticated = !!localStorage.getItem("admin_token");
  return isAdminAuthenticated ? <Outlet /> : <Navigate to="/admin/login" />;
};

export default PrivateadminRoute;
