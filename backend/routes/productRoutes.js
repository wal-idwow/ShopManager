/**
 * Product Routes
 *
 * Responsibilities:
 * - Define and manage API endpoints related to product operations.
 * - Connect routes to their respective controller methods.
 *
 * Endpoints:
 * - `POST /products`: Add a new product.
 * - `GET /products`: Retrieve all products.
 * - `GET /products/:id`: Retrieve a product by its ID.
 * - `PUT /products/:id`: Update a product by its ID.
 * - `DELETE /products/:id`: Delete a product by its ID.
 */

const express = require('express'); // Import the Express framework to create a router
const productController = require('../controllers/productController'); // Import the product controller to handle the business logic for product-related routes

const router = express.Router(); // Create a new router instance to define routes for products

// Define routes for products

// Add a new product
router.post('/', productController.createProduct); // Route to handle adding a new product

// Get all products
router.get('/', productController.getAllProducts); // Route to handle retrieving all products

// Get a product by ID
router.get('/:id', productController.getProductById); // Route to handle retrieving a product by its ID

// Update a product by ID
router.put('/:id', productController.updateProduct); // Route to handle updating a product by its ID

// Delete a product by ID
router.delete('/:id', productController.deleteProduct); // Route to handle deleting a product by its ID

// Export the router to be used in index.js
module.exports = router;
