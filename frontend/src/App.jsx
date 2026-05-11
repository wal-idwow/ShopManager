/**
 * App Component
 *
 * Responsibilities:
 * - Serve as the root component of the application.
 * - Define the main layout, including the Navbar and routing structure.
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
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import necessary components and hooks for routing
import Navbar from './components/Navbar';
import HomeScreen from './screens/HomeScreen';
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
            {/* Define application routes */}
            <Route path="/" element={<HomeScreen />} />
            <Route path="/products" element={<ProductScreen />} />
            <Route path="/products/new" element={<ProductScreen />} />
            <Route path="/products/edit/:id" element={<ProductScreen />} />
            <Route path="/transactions" element={<TransactionScreen />} />
            <Route path="/admin" element={<AdminScreen />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
