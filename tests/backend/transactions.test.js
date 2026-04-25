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

        // Insert a product for testing
        await Product.create({
            name: 'tide',
            buy_price: 5.0,
            sell_price: 10.0,
            stock: 50
        });
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

    // Test case for getting product name by product ID
    it('should get product name by product ID', async () => {
        const response = await request(app).get('/transactions/1');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('name');
    });

    // Test case for getting product ID by product name
    it('should get product ID by product name', async () => {
        const response = await request(app).get('/transactions/tide');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
    });

    // Test case for updating product quantity
    it('should update product quantity', async () => {
        const response = await request(app)
            .put('/transactions/update-quantity')
            .send({
                product_id: 1,
                quantity: 20
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message');
    });

    // Test case for creating a transaction with invalid product ID
    it('should not create a transaction with invalid product ID', async () => {
        const response = await request(app)
            .post('/transactions')
            .send({
                product_id: 9999,
                transaction_type: 'sale',
                quantity: 10
            });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });

    // Test case for creating a transaction with insufficient stock for sale
    it('should not create a transaction with insufficient stock for sale', async () => {
        const response = await request(app)
            .post('/transactions')
            .send({
                product_id: 1,
                transaction_type: 'sale',
                quantity: 1000
            });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Invalid input. Ensure product name, transaction type, and quantity are valid.');
    });

    // Test case for creating a transaction with invalid transaction type
    it('should not create a transaction with invalid transaction type', async () => {
        const response = await request(app)
            .post('/transactions')
            .send({
                product_id: 1,
                transaction_type: 'invalid_type',
                quantity: 10
            });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Invalid transaction type.');
    });
});