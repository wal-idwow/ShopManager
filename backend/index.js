/**
 * MiniShop Backend Entry Point
 *
 * Responsibilities:
 * - Create and configure the Express application.
 * - Load middleware for JSON parsing and Cross-Origin Resource Sharing (CORS).
 * - Register route modules for products and transactions.
 * - Start the HTTP server on the configured port.
 * - Export the Express app for testing purposes.
 *
 * Notes:
 * - This file should not contain SQL queries, business logic, or validation details.
 */

const http = require('http');
const path = require('path');

// Load environment variables
require('dotenv').config();

// Import necessary modules
const express = require('express'); // Web framework for Node.js
const cors = require('cors'); // Middleware to enable Cross-Origin Resource Sharing
const productRoutes = require('./routes/productRoutes'); // Import product routes
const transactionRoutes = require('./routes/transactionRoutes'); // Import transaction routes
const adminRoutes = require('./routes/adminRoutes'); // Import admin routes
const authRoutes = require('./routes/authRoutes'); // Import authentication routes

// Create Express application
const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cors()); // Middleware to enable Cross-Origin Resource Sharing

// Register routes
app.use('/products', productRoutes); // Route for product-related operations
app.use('/transactions', transactionRoutes); // Route for transaction-related operations
app.use('/api/admin', adminRoutes); // Route for admin operations
app.use('/auth', authRoutes); // Route for authentication operations

// Health check endpoint
app.get('/healthyBackend', (req, res) => {
  res.json({ message: 'MiniShop backend is running' }); // Respond with a simple JSON message
});

// serve frontend
const __dirnamePath = path.resolve(); // Get the current working directory

// Static files
app.use(express.static('/home/medal/Shop_Manager/frontend/build')); // Serve static files from the React build directory

// Catch-all (Express 5 safe)
app.use((req, res) => {
  res.sendFile('/home/medal/Shop_Manager/frontend/build/index.html'); // Serve the React app for any unmatched routes
});

let server;

// Start the server only when this file is run directly.
if (require.main === module) {
  const PORT = process.env.PORT || 3000; // Use the port from environment variables or default to 3000
  server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); // Log the server start message
  });

  server.on('error', (error) => {
    console.error('Server failed to start:', error); // Log server errors
  });

  // Handle graceful shutdown on SIGINT (Ctrl+C)
  process.on('SIGINT', () => {
    if (server) {
      server.close(() => {
        console.log('HTTP server closed.'); // Log server closure
      });
    }
  });

  // Handle graceful shutdown on SIGTERM (termination signal)
  process.on('SIGTERM', () => {
    if (server) {
      server.close(() => {
        console.log('HTTP server closed.'); // Log server closure
      });
    }
  });
}

// Export app for testing purposes
module.exports = app;
