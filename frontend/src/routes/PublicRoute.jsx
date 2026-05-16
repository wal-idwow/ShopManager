/**
 * PublicRoute Component
 *
 * Responsibilities:
 * - Protect public routes from authenticated users
 * - Redirect authenticated users to dashboard
 * - Allow unauthenticated users to access public pages
 *
 * Behavior:
 * - If authenticated → redirect to "/products"
 * - If not authenticated → render children (landing/login pages)
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PublicRoute wrapper component
 * Prevents authenticated users from accessing public pages like landing and login
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child component to render if user is not authenticated
 */
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // If user is already authenticated, redirect to products dashboard
  if (isAuthenticated) {
    return <Navigate to="/products" replace />;
  }

  // Otherwise, render the public page
  return children;
};

export default PublicRoute;
