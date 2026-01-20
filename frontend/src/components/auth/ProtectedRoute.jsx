import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-dark">
        <div className="w-12 h-12 border-4 border-luxury-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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
