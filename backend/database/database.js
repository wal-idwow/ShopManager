/**
 * Database Connection and Management
 *
 * Responsibilities:
 * - Establish and manage the SQLite database connection.
 * - Create necessary tables for the MiniShop application.
 * - Populate the database with sample data (optional).
 * - Handle database initialization and graceful shutdown.
 *
 * Main Functions:
 * - `initializeDatabase()`: Initializes the database by creating tables and optionally populating data.
 * - `createTables()`: Creates the `products` and `transactions` tables if they do not exist.
 * - `populateProducts()`: Populates the `products` table with sample data.
 * - `populateTransactions()`: Populates the `transactions` table with sample data.
 * - `closeDatabase(signal)`: Closes the database connection gracefully.
 */

const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcrypt');
const dbPath = path.resolve(__dirname, 'minishop.db');

// Validate database path
if (!dbPath) {
  console.error('Database path is invalid.');
  process.exit(1);
}

// Global error handlers --------------------------------
process.on('uncaughtException', (err) => {
  console.error('Unhandled Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
//---------------------------------------------------

// Connect to the SQLite database (or create it if it doesn't exist)
const db = new Database(dbPath, { verbose: console.log });
console.log('Connected to the SQLite database.');

// Enable foreign key constraints
db.exec('PRAGMA foreign_keys = ON;');
console.log('Foreign key constraints enabled.');

// Create tables and populate sample data
initializeDatabase();

// Function to initialize the database
function initializeDatabase() {
  createTables(); // Create necessary tables
  seedDefaultAdmin(); // Seed default admin user
  // populateProducts(); // Uncomment to populate sample data
  // populateTransactions();
}

// Function to create necessary tables
function createTables() {
  const createProductsTable = `
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            buy_price REAL NOT NULL,
            sell_price REAL NOT NULL,
            stock INTEGER NOT NULL,
            status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'inactive'))
        );
    `;

  const createTransactionsTable = `
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER NOT NULL,
            product_name TEXT,
            transaction_type TEXT NOT NULL CHECK(transaction_type IN ('sale', 'purchase')),
            quantity INTEGER NOT NULL,
            total_price REAL NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        );
    `;

  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('user', 'admin')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;

  db.exec(createProductsTable);
  console.log('Products table created or already exists.');

  db.exec(createTransactionsTable);
  console.log('Transactions table created or already exists.');

  db.exec(createUsersTable);
  console.log('Users table created or already exists.');
}

// Function to populate the database with products
function populateProducts() {
  const products = [
    ['Product A', 10.0, 15.0, 100],
    ['Product B', 20.0, 30.0, 50],
    ['Product C', 5.0, 8.0, 200],
  ];

  const insertProduct = db.prepare(
    'INSERT OR IGNORE INTO products (name, buy_price, sell_price, stock) VALUES (?, ?, ?, ?)'
  );

  products.forEach((product) => {
    insertProduct.run(product);
    console.log('Sample product inserted or skipped:', product);
  });
}
/**
 * Hash a password using bcrypt (10 rounds)
 * Uses synchronous version for database initialization
 * @param {string} password - The plain text password
 * @returns {string} - The bcrypt hashed password
 */
function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

/**
 * Verify a password against its bcrypt hash
 * Uses synchronous version for simple verification
 * @param {string} password - The plain text password to verify
 * @param {string} passwordHash - The bcrypt hash
 * @returns {boolean} - True if password matches, false otherwise
 */
function verifyPassword(password, passwordHash) {
  return bcrypt.compareSync(password, passwordHash);
}

/**
 * Seed default admin user if no users exist
 */
function seedDefaultAdmin() {
  try {
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();

    if (userCount.count === 0) {
      const defaultAdmin = {
        email: 'admin@local',
        password: 'admin123',
        role: 'admin',
      };

      const passwordHash = hashPassword(defaultAdmin.password);

      const insertAdmin = db.prepare(
        'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)'
      );

      insertAdmin.run(defaultAdmin.email, passwordHash, defaultAdmin.role);
      console.log(
        `Default admin user created: ${defaultAdmin.email} (use password: ${defaultAdmin.password})`
      );
    } else {
      console.log('Users table already has records. Skipping seed.');
    }
  } catch (err) {
    console.error('Error seeding default admin user:', err.message);
  }
}
// Function to populate the database with transactions
function populateTransactions() {
  const transactions = [
    [1, 'sale', 10, 150.0],
    [2, 'purchase', 20, 600.0],
    [3, 'sale', 5, 40.0],
  ];

  const insertTransaction = db.prepare(
    'INSERT INTO transactions (product_id, transaction_type, quantity, total_price) VALUES (?, ?, ?, ?)'
  );

  transactions.forEach((transaction) => {
    try {
      insertTransaction.run(transaction);
      console.log('Sample transaction inserted:', transaction);
    } catch (err) {
      console.error('Error inserting transaction:', err.message);
    }
  });
}

let isClosed = false;

// Function to close the database connection gracefully
function closeDatabase(signal) {
  if (isClosed) {
    return;
  }

  isClosed = true;
  if (signal) {
    console.log(`Received ${signal}. Shutting down database connection...`);
  } else {
    console.log('Closing database connection...');
  }

  db.close();
  console.log('Database connection closed.');
}

// Handle process signals for graceful shutdown
process.on('SIGINT', () => {
  closeDatabase('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  closeDatabase('SIGTERM');
  process.exit(0);
});

process.on('exit', () => {
  closeDatabase();
});

// ==================== DATABASE MAINTENANCE FUNCTIONS ====================

/**
 * Delete all data and reset auto-increment IDs
 * Used for fresh database state and testing
 */
function resetDatabase() {
  try {
    console.log('🔄 Resetting database - deleting all records...');
    
    // Delete all transactions first (due to foreign key constraints)
    db.prepare('DELETE FROM transactions;').run();
    console.log('✓ Cleared transactions table');
    
    // Delete all products
    db.prepare('DELETE FROM products;').run();
    console.log('✓ Cleared products table');
    
    // Reset auto-increment sequence for SQLite
    // SQLite stores the next ID in sqlite_sequence table
    db.prepare("DELETE FROM sqlite_sequence WHERE name='products';").run();
    db.prepare("DELETE FROM sqlite_sequence WHERE name='transactions';").run();
    console.log('✓ Reset auto-increment generators');
    
    console.log('✅ Database reset complete - ID generators refreshed');
    return { success: true, message: 'Database reset successful' };
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    throw error;
  }
}

/**
 * Get database statistics
 */
function getDbStats() {
  try {
    const productCount = db.prepare('SELECT COUNT(*) as count FROM products;').get();
    const transactionCount = db.prepare('SELECT COUNT(*) as count FROM transactions;').get();
    const orphanedTransactions = db.prepare(`
      SELECT COUNT(*) as count FROM transactions t
      WHERE t.product_id NOT IN (SELECT id FROM products);
    `).get();
    
    return {
      products: productCount.count,
      transactions: transactionCount.count,
      orphanedTransactions: orphanedTransactions.count,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting database stats:', error);
    throw error;
  }
}

/**
 * Clear orphaned transactions (those referencing deleted products)
 */
function cleanupOrphanedTransactions() {
  try {
    console.log('🧹 Cleaning up orphaned transactions...');
    
    const result = db.prepare(`
      DELETE FROM transactions 
      WHERE product_id NOT IN (SELECT id FROM products);
    `).run();
    
    console.log(`✓ Deleted ${result.changes} orphaned transaction(s)`);
    return { deletedCount: result.changes };
  } catch (error) {
    console.error('❌ Error cleaning orphaned transactions:', error);
    throw error;
  }
}

/**
 * Export database functions for use in controllers/routes
 */
module.exports = db;
module.exports.resetDatabase = resetDatabase;
module.exports.getDbStats = getDbStats;
module.exports.cleanupOrphanedTransactions = cleanupOrphanedTransactions;
module.exports.hashPassword = hashPassword;
module.exports.verifyPassword = verifyPassword;
module.exports.seedDefaultAdmin = seedDefaultAdmin;
