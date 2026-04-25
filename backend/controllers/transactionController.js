/**
 * Transaction Controller
 * 
 * Responsibilities:
 * - Validate incoming transaction data.
 * - Call transaction model methods to interact with the database.
 * - Send HTTP JSON responses to the client.
 * 
 * Main Functions:
 * - `createTransaction(req, res)`: Validates and creates a new transaction.
 * - `getAllTransactions(req, res)`: Retrieves all transactions.
 * - `getTransactionById(req, res)`: Retrieves a transaction by its ID.
 * - `getProductNameById(req, res)`: Retrieves a product name by its ID.
 * - `getProductIdByName(req, res)`: Retrieves a product ID by its name.
 * - `updateProductQuantity(req, res)`: Updates product quantity based on transaction type.
 * 
 * Validation Examples:
 * - `product_name` is required.
 * - `transaction_type` must be 'purchase' or 'sale'.
 * - `quantity` must be greater than 0.
 * - `total_price` must be greater than 0.
 * - `timestamp` must be a valid date.
 */

// Import the Transaction model
const Transaction = require('../models/transactionModel');

// Controller function to create a new transaction
exports.createTransaction = (req, res) => {
    const { product_name, transaction_type, quantity } = req.body;

    // Basic validation
    if (!product_name || !['purchase', 'sale'].includes(transaction_type) || quantity <= 0) {
        return res.status(400).json({ error: 'Invalid input. Ensure product name, transaction type, and quantity are valid.' });
    }

    // Fetch product_id using getProductIdbyName
    Transaction.getProductIdbyName(product_name, (err, product_id) => {
        if (err) {
            if (err.message.includes('not found')) {
                return res.status(404).json({ error: 'Product not found' });
            }
            return res.status(500).json({ error: 'Error fetching product ID' });
        }
        if (!product_id) return res.status(404).json({ error: 'Product not found' });

        Transaction.getProductById(product_id, (err, product) => {
            if (err) return res.status(500).json({ error: 'Error fetching product details' });
            if (!product) return res.status(404).json({ error: 'Product not found' });

            if (transaction_type === 'sale' && product.stock < quantity) {
                return res.status(400).json({ error: 'Not enough stock for this sale.' });
            }

            // Calculate total_price
            Transaction.calculateTotalPrice(product_id, quantity, transaction_type, (err, total_price) => {
                if (err) return res.status(500).json({ error: 'Error calculating total price' });

                // Generate timestamp
                const timestamp = new Date().toISOString();

                // Create the transaction
                Transaction.create({ product_id, transaction_type, quantity, total_price, timestamp }, (err, id) => {
                    if (err) return res.status(500).json({ error: 'Error creating transaction' });
                    res.status(201).json({ id });
                });
            });
        });
    });
};

// Controller function to get all transactions
exports.getAllTransactions = (req, res) => {
    Transaction.findAll((err, transactions) => {
        if (err) return res.status(500).json({ error: 'Error fetching transactions' });
        res.json(transactions); // Send the list of transactions as a JSON response
    });
};

// Controller function to get a transaction by ID
exports.getTransactionById = (req, res) => {
    const id = req.params.id; // Extract the transaction ID from the request parameters
    Transaction.findById(id, (err, transaction) => {
        if (err) return res.status(500).json({ error: 'Error fetching transaction' });
        if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
        res.json(transaction); // Send the transaction details as a JSON response
    });
};

// Controller function to get product name by ID
exports.getProductNameById = (req, res) => {
    const productId = req.params.productId; // Extract the product ID from the request parameters
    Transaction.getProductNameById(productId, (err, productName) => {
        if (err) return res.status(500).json({ error: 'Error fetching product name' });
        if (!productName) return res.status(404).json({ error: 'Product not found' });
        res.json({ name: productName }); // Send the product name as a JSON response
    });
};

// Controller function to get product ID by name
exports.getProductIdByName = (req, res) => {
    const productName = req.params.productName; // Extract the product name from the request parameters
    Transaction.getProductIdbyName(productName, (err, productId) => {
        if (err) return res.status(500).json({ error: 'Error fetching product ID' });
        if (!productId) return res.status(404).json({ error: 'Product not found' });
        res.json({ id: productId }); // Send the product ID as a JSON response
    });
};

// Controller function to update product quantity
exports.updateProductQuantity = (req, res) => {
    const { product_name, transaction_type, quantity } = req.body;

    // Basic validation
    if (!product_name || !['purchase', 'sale'].includes(transaction_type) || quantity <= 0) {
        return res.status(400).json({ error: 'Invalid input. Ensure product name, transaction type, and quantity are valid.' });
    }

    // Fetch product_id using getProductIdbyName
    Transaction.getProductIdbyName(product_name, (err, product_id) => {
        if (err) return res.status(500).json({ error: 'Error fetching product ID' });
        if (!product_id) return res.status(404).json({ error: 'Product not found' });

        // Update the product quantity
        Transaction.updateProductQuantity(transaction_type, quantity, product_id, (err, result) => {
            if (err) return res.status(500).json({ error: 'Error updating product quantity' });
            res.json({ message: 'Product quantity updated successfully' }); // Send a success message as a JSON response
        });
    });
};
