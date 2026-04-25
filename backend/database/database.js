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
            transaction_type TEXT NOT NULL CHECK(transaction_type IN ('sale', 'purchase')),
            quantity INTEGER NOT NULL,
            total_price REAL NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES products(id)
        );
    `;

    db.exec(createProductsTable);
    console.log('Products table created or already exists.');

    db.exec(createTransactionsTable);
    console.log('Transactions table created or already exists.');
}

// Function to populate the database with products
function populateProducts() {
    const products = [
        ['Product A', 10.0, 15.0, 100],
        ['Product B', 20.0, 30.0, 50],
        ['Product C', 5.0, 8.0, 200]
    ];

    const insertProduct = db.prepare(
        'INSERT OR IGNORE INTO products (name, buy_price, sell_price, stock) VALUES (?, ?, ?, ?)'
    );

    products.forEach((product) => {
        insertProduct.run(product);
        console.log('Sample product inserted or skipped:', product);
    });
}

// Function to populate the database with transactions
function populateTransactions() {
    const transactions = [
        [1, 'sale', 10, 150.0],
        [2, 'purchase', 20, 600.0],
        [3, 'sale', 5, 40.0]
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

module.exports = db;


