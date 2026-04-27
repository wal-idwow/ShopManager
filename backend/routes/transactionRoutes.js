/**
 * Transaction Routes
 * 
 * Responsibilities:
 * - Define and manage API endpoints for transaction operations.
 * - Connect routes to their respective controller methods.
 * 
 * Endpoints:
 * - `POST /transactions`: Add a new transaction.
 * - `GET /transactions`: Retrieve all transactions.
 * - `GET /transactions/:id`: Retrieve a transaction by its ID.
 * - `GET /transactions/product-name/:productId`: Retrieve product name by ID.
 * - `GET /transactions/product-id/:productName`: Retrieve product ID by name.
 * - `PUT /transactions/update-quantity`: Update product quantity.
 */

const express = require('express');
const transactionController = require('../controllers/transactionController'); // Import the transaction controller to handle the business logic for transaction-related routes

const router = express.Router(); // Create a new router instance to define routes for transactions

// Define routes for transactions

// Add a new transaction
router.post('/', transactionController.createTransaction); // Route to handle adding a new transaction

// Update product quantity
router.put('/update-quantity', transactionController.updateProductQuantity); // Route to handle updating product quantity

// Get all transactions
router.get('/', transactionController.getAllTransactions); // Route to handle retrieving all transactions

// Get product name by product ID
router.get('/product-name/:productId', transactionController.getProductNameById); // Route to retrieve product name by ID

// Get product ID by product name
router.get('/product-id/:productName', transactionController.getProductIdByName); // Route to retrieve product ID by name

// Get a transaction by ID
router.get('/:id', transactionController.getTransactionById); // Route to handle retrieving a transaction by its ID

// Export the router to be used in index.js
module.exports = router;
