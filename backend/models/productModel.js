/**
 * Product Model
 *
 * Responsibilities:
 * - Interact with the database to manage the `products` table.
 * - Provide CRUD operations for products.
 * - Ensure data is returned in a format suitable for controllers.
 *
 * Functions:
 * - `create(productData, callback)`: Adds a new product to the database.
 * - `findAll(callback)`: Retrieves all products from the database.
 * - `findById(id, callback)`: Retrieves a product by its ID.
 * - `updateById(id, data, callback)`: Updates a product's details by its ID.
 * - `deleteById(id, callback)`: Deletes a product by its ID.
 */

// Import database connection
const db = require('../database/database');

// Define the Product model with necessary functions
const Product = {
  // Create a new product
  create: async (productData) => {
    const { name, buy_price, sell_price, stock } = productData;
    const insertProduct = db.prepare(`
            INSERT INTO products (name, buy_price, sell_price, stock)
            VALUES (?, ?, ?, ?);
        `);
    try {
      const result = insertProduct.run(name, buy_price, sell_price, stock);
      return Number(result.lastInsertRowid); // Normalize the inserted ID
    } catch (error) {
      throw error; // Throw error to be handled by the caller
    }
  },

  // Retrieve all products
  findAll: (callback) => {
    const selectProducts = db.prepare(`
            SELECT * FROM products where status = 'active';
        `);
    try {
      const results = selectProducts.all();
      callback(null, results);
    } catch (error) {
      callback(error, null);
    }
  },

  // Retrieve a product by ID
  findById: (id, callback) => {
    const selectProduct = db.prepare(`
            SELECT * FROM products WHERE id = ? AND status = 'active';
        `);
    try {
      const result = selectProduct.get(id);
      callback(null, result);
    } catch (error) {
      callback(error, null);
    }
  },

  // Update a product by ID
  updateById: (id, data, callback) => {
    const { name, buy_price, sell_price, stock } = data;
    const updateProduct = db.prepare(`
            UPDATE products
            SET name = ?, buy_price = ?, sell_price = ?, stock = ?
            WHERE id = ? AND status = 'active';
        `);
    try {
      updateProduct.run(name, buy_price, sell_price, stock, id);
      callback(null, { message: 'Product updated successfully' });
    } catch (error) {
      callback(error, null);
    }
  },

  // Delete a product by ID
  deleteById: (id, callback) => {
    const deleteProduct = db.prepare(`
            UPDATE products
            SET status = 'inactive'
            WHERE id = ? AND status = 'active';
        `);
    try {
      deleteProduct.run(id);
      callback(null, { message: 'Product deleted successfully' });
    } catch (error) {
      callback(error, null);
    }
  },
};

module.exports = Product;
