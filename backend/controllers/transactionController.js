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

// Utility function to promisify callback-based model methods
const promisify = (fn, context) => {
  return (...args) => {
    return new Promise((resolve, reject) => {
      fn.apply(context, [
        ...args,
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        },
      ]);
    });
  };
};

// Controller function to create a new transaction
exports.createTransaction = async (req, res) => {
  try {
    const { product_name, transaction_type, quantity } = req.body;

    // Basic validation
    if (!product_name || !['purchase', 'sale'].includes(transaction_type) || quantity <= 0) {
      return res
        .status(400)
        .json({
          error: 'Invalid input. Ensure product name, transaction type, and quantity are valid.',
        });
    }

    // Promisify model methods
    const getProductIdbyName = promisify(Transaction.getProductIdbyName, Transaction);
    const getProductById = promisify(Transaction.getProductById, Transaction);
    const calculateTotalPrice = promisify(Transaction.calculateTotalPrice, Transaction);
    const createTransaction = promisify(Transaction.create, Transaction);

    // Fetch product_id using getProductIdbyName
    const product_id = await getProductIdbyName(product_name);

    // Fetch product details
    const product = await getProductById(product_id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if there's enough stock for a sale
    if (transaction_type === 'sale' && product.stock < quantity) {
      return res.status(400).json({ error: 'Not enough stock for this sale.' });
    }

    // Calculate total_price
    const total_price = await calculateTotalPrice(product_id, quantity, transaction_type);

    // Generate timestamp
    const timestamp = new Date().toISOString();

    // Create the transaction with product_name for historical integrity
    const id = await createTransaction({
      product_id,
      product_name: product.name,
      transaction_type,
      quantity,
      total_price,
      timestamp,
    });
    res.status(201).json({ id });
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(500).json({ error: err.message || 'Error creating transaction' });
  }
};

// Controller function to get all transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const findAll = promisify(Transaction.findAll, Transaction);
    const transactions = await findAll();
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error fetching transactions' });
  }
};

// Controller function to get a transaction by ID
exports.getTransactionById = async (req, res) => {
  try {
    const id = req.params.id;
    const findById = promisify(Transaction.findById, Transaction);
    const transaction = await findById(id);

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error fetching transaction' });
  }
};
