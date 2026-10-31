import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RoleType } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: RoleType[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="text-sm font-serif font-bold text-burgundy-900 animate-pulse">
          Validating Royal Knot Credentials...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // If logged in as another role, direct to their corresponding dashboard
    if (role === 'ROLE_ADMIN') return <Navigate to="/admin" replace />;
    if (role === 'ROLE_PLANNER') return <Navigate to="/planner" replace />;
    if (role === 'ROLE_CLIENT') return <Navigate to="/client" replace />;
    if (role === 'ROLE_VENDOR') return <Navigate to="/vendor" replace />;
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

