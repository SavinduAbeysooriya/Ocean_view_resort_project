import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return null; // Or a luxury loader

  // Safety check: Ensure user object and roles array exist before proceeding
  if (!user || !user.roles || !Array.isArray(user.roles)) {
    return <Navigate to="/login" replace />;
  }

  // Safety check: Ensure allowedRoles is an array
  if (!allowedRoles || !Array.isArray(allowedRoles)) {
    console.error("ProtectedRoute: allowedRoles prop is missing or not an array.");
    return <Navigate to="/login" replace />; // Or to an error page
  }

  const hasAccess = allowedRoles.some(role => user.roles.includes(role));

  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
