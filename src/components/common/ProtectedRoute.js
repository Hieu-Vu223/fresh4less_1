import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const ProtectedRoute = ({ allowedRole }) => {
  const { user, role, loading } = useAuth(); // Add `loading` from AuthContext

  console.log("Current User in ProtectedRoute:", user);
  console.log("Allowed Role:", allowedRole);

  // Show a loading state if data is still being fetched
  if (loading) {
    return <div>Loading...</div>; // Replace with a spinner or skeleton screen
  }

  // Redirect to login if user is not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Redirect to home if the user's role doesn't match the allowed role
  if (role !== allowedRole) {
    return <Navigate to="/" />;
  }

  // Render child routes if the user has the correct role
  return <Outlet />;
};

export default ProtectedRoute;
