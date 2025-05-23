import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  let user = null;
  let token = null;

  try {
    const storedUser = localStorage.getItem("user");

    // Safely attempt to parse only if valid
    if (storedUser && storedUser !== "undefined" && storedUser.trim() !== "") {
      user = JSON.parse(storedUser);
    }

    token = localStorage.getItem("token");
  } catch (error) {
    console.error("Error parsing user from localStorage", error);
    user = null;
    token = null;
  }

  if (!token && user) {
    return <Navigate to="/login" />;
  }

  if (!token && !user) {
    return <Navigate to="/" />;
  }

  if (token && user?.created_password === false) {
    return <Navigate to="/create-password" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
