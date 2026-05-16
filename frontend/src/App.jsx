/**
 * App Component
 *
 * Responsibilities:
 * - Serve as the root component of the application
 * - Define the main routing structure
 * - Centralize all route decisions (public vs protected)
 * - Render Navbar and route content
 *
 * Route Architecture:
 * - "/" → PublicRoute → HomeScreen (landing page - unauthenticated users only)
 * - "/login" → Public → LoginScreen
 * - "/products" → ProtectedRoute → ProductScreen (dashboard)
 * - "/products/new" → ProtectedRoute → ProductScreen (create)
 * - "/products/edit/:id" → ProtectedRoute → ProductScreen (edit)
 * - "/transactions" → ProtectedRoute → TransactionScreen
 * - "/admin" → ProtectedRoute (admin only) → AdminScreen
 * - "*" → 404 → redirect to "/"
 *
 * Auth Flow:
 * - Not authenticated + "/" → landing page shown
 * - Not authenticated + "/products" → redirect to "/login"
 * - Authenticated + "/" → redirect to "/products"
 * - Authenticated + "/products" → dashboard shown
 */

import React from 'react';
import { BrowserRouter as Router, Navigate, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PublicRoute from './routes/PublicRoute';
import ProtectedRoute from './routes/ProtectedRoute';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import ProductScreen from './screens/ProductScreen';
import TransactionScreen from './screens/TransactionScreen';
import AdminScreen from './screens/AdminScreen';

const App = () => {
  return (
    <Router>
      <div className="app-shell">
        <Navbar /> {/* Render the Navbar component */}
        <main className="app-main">
          <Routes>
            {/* ============================================================
                PUBLIC ROUTES (accessible by anyone)
                ============================================================ */}

            {/* Landing page - only shows for unauthenticated users
                If authenticated → redirects to "/products" */}
            <Route
              path="/"
              element={
                <PublicRoute>
                  <HomeScreen />
                </PublicRoute>
              }
            />

            {/* Login page - public route */}
            <Route path="/login" element={<LoginScreen />} />

            {/* ============================================================
                PROTECTED ROUTES (require authentication)
                ============================================================ */}

            {/* Products dashboard - requires authentication */}
            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <ProductScreen />
                </ProtectedRoute>
              }
            />

            {/* Create new product - requires authentication */}
            <Route
              path="/products/new"
              element={
                <ProtectedRoute>
                  <ProductScreen />
                </ProtectedRoute>
              }
            />

            {/* Edit product - requires authentication */}
            <Route
              path="/products/edit/:id"
              element={
                <ProtectedRoute>
                  <ProductScreen />
                </ProtectedRoute>
              }
            />

            {/* Transactions - requires authentication */}
            <Route
              path="/transactions"
              element={
                <ProtectedRoute>
                  <TransactionScreen />
                </ProtectedRoute>
              }
            />

            {/* ============================================================
                ADMIN-ONLY ROUTES (require authentication + admin role)
                ============================================================ */}

            {/* Admin panel - requires admin role */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminScreen />
                </ProtectedRoute>
              }
            />

            {/* ============================================================
                CATCH-ALL / 404
                ============================================================ */}

            {/* Any unmatched routes → redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
