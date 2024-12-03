import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const ProtectedRoute = ({ allowedRole }) => {
  const { user, role, loading } = useAuth(); // Use context values

  console.log('Current User in ProtectedRoute:', user); 
  console.log('Role in ProtectedRoute:', role); 
  console.log('Allowed Role:', allowedRole); 

  if (loading) {
    return <div>Loading...</div>; // Show loading screen while fetching data
  }

  if (!user) {
    return <Navigate to="/login" />; // Redirect to login if user is not authenticated
  }

  if (role !== allowedRole) {
    return <Navigate to="/" />; // Redirect if the role does not match
  }

  return <Outlet />; // Allow access to children if role matches
};

export default ProtectedRoute;
