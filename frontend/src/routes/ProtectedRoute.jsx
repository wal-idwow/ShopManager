/**
 * ProtectedRoute Component
 *
 * Responsibilities:
 * - Protect routes that require authentication
 * - Enforce role-based access control (admin-only routes)
 * - Redirect unauthenticated users to login
 * - Redirect unauthorized users (wrong role) to home
 *
 * Behavior:
 * - If not authenticated → redirect to "/login" (preserve current location for redirect after login)
 * - If authenticated but wrong role → redirect to "/"
 * - Otherwise → render children
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute wrapper component
 * Enforces authentication and optional role-based access
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child component to render if authorized
 * @param {string[]} props.allowedRoles - Optional array of roles allowed to access this route
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  // Not authenticated → redirect to login and remember where they came from
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // Authenticated but checking role restrictions
  if (allowedRoles && !allowedRoles.includes(role)) {
    // User doesn't have required role → redirect to home
    return <Navigate to="/" replace />;
  }

  // All checks passed → render the protected component
  return children;
};

export default ProtectedRoute;
