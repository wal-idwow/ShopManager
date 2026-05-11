/**
 * Transaction Model
 *
 * Responsibilities:
 * - Manage the `transactions` table in the database.
 * - Provide CRUD operations for transactions.
 * - Handle related operations such as updating product stock and calculating total prices.
 *
 * Functions:
 * - `create(transactionData, callback)`: Adds a new transaction and updates product stock.
 * - `findAll(callback)`: Retrieves all transactions from the database.
 * - `findById(id, callback)`: Retrieves a transaction by its ID.
 * - `getProductById(productId, callback)`: Retrieves product details by its ID.
 * - `getProductNameById(productId, callback)`: Retrieves the product name by its ID.
 * - `getProductIdbyName(productName, callback)`: Retrieves the product ID by its name.
 * - `calculateTotalPrice(productId, quantity, transactionType, callback)`: Calculates the total price for a transaction.
 */

// Import database connection
const db = require('../database/database');

// Define the Transaction model with necessary functions
const Transaction = {
  // Create a new transaction while updating the product's quantity in the products table
  // Uses database transaction to ensure atomicity - both operations succeed or both fail
  create: (transactionData, callback) => {
    // Destructure the transaction data object to get individual fields
    const { product_id, product_name, transaction_type, quantity, total_price, timestamp } = transactionData;

    try {
      console.log('Inserting transaction:', transactionData); // Log the data being inserted

      // Prepare statements
      const insertTransaction = db.prepare(`
                INSERT INTO transactions (product_id, product_name, transaction_type, quantity, total_price, timestamp)
                VALUES (?, ?, ?, ?, ?, ?);
            `);

      const updateProductQuantity = db.prepare(`
                UPDATE products
                SET stock = stock + CASE WHEN ? = 'purchase' THEN ? ELSE -? END
                WHERE id = ?;
            `);

      // Create an atomic transaction - both operations must succeed together or both fail
      const transaction = db.transaction(() => {
        // Insert the transaction record
        const result = insertTransaction.run(
          product_id,
          product_name,
          transaction_type,
          quantity,
          total_price,
          timestamp
        );
        const transactionId = Number(result.lastInsertRowid);

        // Update the product stock in the products table based on the transaction type
        const stockUpdateResult = updateProductQuantity.run(
          transaction_type,
          transaction_type === 'purchase' ? quantity : -quantity,
          quantity,
          product_id
        );

        // Verify that the product was updated (changes > 0)
        if (stockUpdateResult.changes === 0) {
          throw new Error(
            `Failed to update stock for product ID ${product_id}. Product may not exist.`
          );
        }

        return transactionId;
      });

      // Execute the atomic transaction
      const transactionId = transaction();
      callback(null, transactionId);
    } catch (error) {
      console.error(
        'Error in transaction (both insert and stock update will be rolled back):',
        error
      ); // Log the error details
      callback(error, null);
    }
  },

  // Retrieve all transactions
  findAll: (callback) => {
    // Prepare SQL statement to fetch all transactions
    const selectTransactions = db.prepare(`
            SELECT * FROM transactions;
        `);
    try {
      const results = selectTransactions.all();
      callback(null, results);
    } catch (error) {
      callback(error, null);
    }
  },

  // Retrieve a transaction by ID
  findById: (id, callback) => {
    // Prepare SQL statement to fetch a transaction by its ID
    const selectTransaction = db.prepare(`
            SELECT * FROM transactions WHERE id = ?;
        `);
    try {
      const result = selectTransaction.get(id);
      callback(null, result);
    } catch (error) {
      callback(error, null);
    }
  },

  // Retrieve product details by ID
  getProductById: (productId, callback) => {
    const selectProduct = db.prepare(`
            SELECT * FROM products WHERE id = ?;
        `);
    try {
      const result = selectProduct.get(productId);
      callback(null, result);
    } catch (error) {
      callback(error, null);
    }
  },

  // Retrieve product name by ID
  getProductNameById: (productId, callback) => {
    const selectProductName = db.prepare(`
            SELECT name FROM products WHERE id = ?;
        `);
    try {
      const result = selectProductName.get(productId);
      callback(null, result ? result.name : null); // Call the callback function with the product name if found, otherwise return null
    } catch (error) {
      callback(error, null);
    }
  },

  // Retrieve product ID by name
  getProductIdbyName: (productName, callback) => {
    if (!productName || typeof productName !== 'string') {
      return callback(new Error('Invalid product name provided'), null);
    }

    const selectProductId = db.prepare(`
            SELECT id FROM products WHERE name = ?;
        `);
    try {
      const result = selectProductId.get(productName);
      if (result) {
        callback(null, result.id);
      } else {
        callback(new Error(`Product with name "${productName}" not found`), null);
      }
    } catch (error) {
      console.error('Database error in getProductIdbyName:', error);
      callback(error, null);
    }
  },

  // Calculate total price for a transaction
  calculateTotalPrice: (productId, quantity, transactionType, callback) => {
    const selectProductPrice = db.prepare(`
            SELECT buy_price, sell_price FROM products WHERE id = ?;
        `);
    try {
      const result = selectProductPrice.get(productId);
      if (result) {
        const price = transactionType === 'purchase' ? result.buy_price : result.sell_price; // Use correct price based on transaction type
        const totalPrice = price * quantity; // Calculate the total price by multiplying the unit price by the quantity
        callback(null, totalPrice); // Call the callback function with the calculated total price
      } else {
        callback(new Error('Product not found'), null);
      }
    } catch (error) {
      callback(error, null);
    }
  },

  // Update product quantity based on transaction type
  updateProductQuantity: (transaction_type, quantity, product_id, callback) => {
    const updateProductQuantity = db.prepare(`
            UPDATE products
            SET stock = stock + CASE WHEN ? = 'purchase' THEN ? ELSE -? END
            WHERE id = ?;
        `);
    try {
      updateProductQuantity.run(
        transaction_type,
        transaction_type === 'purchase' ? quantity : -quantity,
        quantity,
        product_id
      );
      callback(null, { message: 'Product quantity updated successfully' });
    } catch (error) {
      callback(error, null);
    }
  },
};

module.exports = Transaction;
