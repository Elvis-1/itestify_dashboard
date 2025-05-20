import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!token && user) {
    return <Navigate to="/login" />;
  }

  if(!token && !user) {
    return <Navigate to="/" />
  }

  if (token && user && user.created_password === false) {
    return <Navigate to="/create-password" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;