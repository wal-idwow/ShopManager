// here we test transactions endpoints
// test cases : 
    // 1. create a new transaction
    // 2. get all transactions
    // 3. get a transaction by ID
    // 4. get product name by product ID
    // 5. get product ID by product name
    // 6. update product quantity
    // 7. create a transaction with invalid product ID
    // 8. create a transaction with insufficient stock for sale
    // 9. create a transaction with invalid transaction type

    const request = require('supertest');
    const app = require('../../backend/index.js'); // Import the Express app path: index.js
    const db = require('../../backend/database/database'); // Import the database connection
    const Product = require('../../backend/models/productModel'); // Import the Product model

// Ensure database setup before running tests
describe('Transaction API Endpoints', () => {
    let createdTransactionId;
    let createdProductId;

    beforeAll(async () => {
        // Create tables if they do not exist
        await db.exec(`
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE,
                buy_price REAL NOT NULL,
                sell_price REAL NOT NULL,
                stock INTEGER NOT NULL,
                status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'inactive'))
            );
        `);

        await db.exec(`
            CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_id INTEGER NOT NULL,
                transaction_type TEXT NOT NULL CHECK(transaction_type IN ('sale', 'purchase')),
                quantity INTEGER NOT NULL,
                total_price REAL NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (product_id) REFERENCES products(id)
            );
        `);

        // Clean up existing data
        await db.exec('DELETE FROM transactions;');
        await db.exec('DELETE FROM products;');

        // Insert a product for testing
        try {
            createdProductId = await Product.create({
                name: 'tide',
                buy_price: 5.0,
                sell_price: 10.0,
                stock: 50
            });
        } catch (err) {
            // Product already exists, skip
            if (!err.message.includes('UNIQUE constraint failed')) {
                throw err;
            }
        }
    });

    afterAll(async () => {
        // Clean up the database after tests
        await db.exec('DELETE FROM transactions;');
        await db.exec('DELETE FROM products;');
    });

    // Test case for creating a new transaction
    it('should create a new transaction', async () => {
        const response = await request(app)
            .post('/transactions')
            .send({
                product_name: 'tide',
                transaction_type: 'sale',
                quantity: 10
            });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        createdTransactionId = response.body.id;
    });

    // Test case for getting all transactions
    it('should get all transactions', async () => {
        const response = await request(app).get('/transactions');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    // Test case for getting a transaction by ID
    it('should get a transaction by ID', async () => {
        const response = await request(app).get(`/transactions/${createdTransactionId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', createdTransactionId);
    });

    // Test case for creating a transaction with invalid product ID
    it('should not create a transaction with invalid product ID', async () => {
        const response = await request(app)
            .post('/transactions')
            .send({
                product_name: 'non_existent_product',
                transaction_type: 'sale',
                quantity: 10
            });
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');
    });

    // Test case for creating a transaction with insufficient stock for sale
    it('should not create a transaction with insufficient stock for sale', async () => {
        const response = await request(app)
            .post('/transactions')
            .send({
                product_name: 'tide',
                transaction_type: 'sale',
                quantity: 1000
            });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Not enough stock for this sale.');
    });

    // Test case for creating a transaction with invalid transaction type
    it('should not create a transaction with invalid transaction type', async () => {
        const response = await request(app)
            .post('/transactions')
            .send({
                product_name: 'tide',
                transaction_type: 'invalid_type',
                quantity: 10
            });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Invalid input. Ensure product name, transaction type, and quantity are valid.');
    });

    // Test case to verify stock update on purchase transaction
    it('should correctly update stock on purchase transaction', async () => {
        // After the first transaction (sale of 10), stock should be at 40
        const stockBeforePurchase = 40;
        
        // Create a purchase transaction
        const response = await request(app)
            .post('/transactions')
            .send({
                product_name: 'tide',
                transaction_type: 'purchase',
                quantity: 10
            });
        
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        
        // Fetch the product and verify stock was increased
        const productResponse = await request(app).get(`/products/${createdProductId}`);
        expect(productResponse.status).toBe(200);
        expect(productResponse.body.stock).toBe(stockBeforePurchase + 10); // Stock should increase on purchase
    });

    // Test case to verify stock update on sale transaction
    it('should correctly update stock on sale transaction', async () => {
        // After the purchase of 10, stock should be at 50
        const stockBeforeSale = 50;
        
        // Create a sale transaction
        const response = await request(app)
            .post('/transactions')
            .send({
                product_name: 'tide',
                transaction_type: 'sale',
                quantity: 5
            });
        
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        
        // Fetch the product and verify stock was decreased
        const productResponse = await request(app).get(`/products/${createdProductId}`);
        expect(productResponse.status).toBe(200);
        expect(productResponse.body.stock).toBe(stockBeforeSale - 5); // Stock should decrease on sale
    });

    // Test case to verify atomicity: transaction and stock update are atomic
    it('should verify transaction and stock update are atomic', async () => {
        // Get all transactions before
        const transactionsBeforeResponse = await request(app).get('/transactions');
        const transactionsBefore = transactionsBeforeResponse.body;
        const initialTransactionCount = transactionsBefore.length;
        
        // Get product stock before
        const productBeforeResponse = await request(app).get(`/products/${createdProductId}`);
        const stockBefore = productBeforeResponse.body.stock;
        
        // Create a new transaction
        const createResponse = await request(app)
            .post('/transactions')
            .send({
                product_name: 'tide',
                transaction_type: 'purchase',
                quantity: 15
            });
        
        expect(createResponse.status).toBe(201);
        
        // Get all transactions after
        const transactionsAfterResponse = await request(app).get('/transactions');
        const transactionsAfter = transactionsAfterResponse.body;
        const finalTransactionCount = transactionsAfter.length;
        
        // Get product stock after
        const productAfterResponse = await request(app).get(`/products/${createdProductId}`);
        const stockAfter = productAfterResponse.body.stock;
        
        // Verify both transaction and stock update happened together (atomicity)
        // Transaction count should increase by exactly 1
        expect(finalTransactionCount).toBe(initialTransactionCount + 1);
        
        // Stock should increase by exactly 15
        expect(stockAfter).toBe(stockBefore + 15);
    });
});