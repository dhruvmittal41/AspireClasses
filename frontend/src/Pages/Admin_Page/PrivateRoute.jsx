import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const isAdminAuthenticated = !!localStorage.getItem("admin_token");

  // If authorized, return an outlet that will render child elements
  // If not, return element that will navigate to login page
  return isAdminAuthenticated ? <Outlet /> : <Navigate to="/admin/login" />;
};

export default PrivateRoute;
