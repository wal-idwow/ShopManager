/**
 * App Component
 *
 * Responsibilities:
 * - Serve as the root component of the application.
 * - Define the main layout, including the Navbar and routing structure.
 * - Enforce role-based access for admin routes.
 * - Render different screens based on the current route.
 *
 * Routes:
 * - `/`: Renders the `HomeScreen` component.
 * - `/products`: Renders the `ProductScreen` component for listing products.
 * - `/products/new`: Renders the `ProductScreen` component for creating a new product.
 * - `/products/edit/:id`: Renders the `ProductScreen` component for editing an existing product.
 * - `/transactions`: Renders the `TransactionScreen` component for managing transactions.
 */

import React from 'react';
import { BrowserRouter as Router, Navigate, Routes, Route, useLocation } from 'react-router-dom'; // Import necessary components and hooks for routing
import Navbar from './components/Navbar';
import { useAuth } from './context/AuthContext';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import ProductScreen from './screens/ProductScreen';
import TransactionScreen from './screens/TransactionScreen';
import AdminScreen from './screens/AdminScreen';

/**
 * ProtectedRoute Component
 * Checks authentication and optionally role-based access
 */
const ProtectedRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <div className="app-shell">
        <Navbar /> {/* Render the Navbar component */}
        <main className="app-main">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomeScreen />} />
            <Route path="/login" element={<LoginScreen />} />

            {/* Protected routes - require authentication */}
            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <ProductScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/new"
              element={
                <ProtectedRoute>
                  <ProductScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/edit/:id"
              element={
                <ProtectedRoute>
                  <ProductScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <ProtectedRoute>
                  <TransactionScreen />
                </ProtectedRoute>
              }
            />

            {/* Admin-only routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminScreen />
                </ProtectedRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
