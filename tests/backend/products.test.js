// here we test the products endpoints
// test cases : 
    // 1. create a new product
    // 2. get all products
    // 3. get a product by ID
    // 4. update a product by ID
    // 5. delete a product by ID
    // 6. get a product that does not exist
    // 7. update a product with invalid data
    // 8. delete a product that does not exist
    // 9. create a product with buy price greater than sell price

const request = require('supertest');
const app = require('../../backend/index.js'); // Import the Express app path: index.js

describe('Product API Endpoints', () => {
    let createdProductId;
    // Test case for creating a new product
    it('should create a new product', async () => {
        const response = await request(app)
            .post('/products')
            .send({
                name: 'Test Product',
                buy_price: 10.0,
                sell_price: 15.0,
                stock: 100
            });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        createdProductId = response.body.id;
    });

    // Test case for getting all products
    it('should get all products', async () => {
        const response = await request(app).get('/products');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    // Test case for getting a product by ID
    it('should get a product by ID', async () => {
        const response = await request(app).get(`/products/${createdProductId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', createdProductId);
    });

    // Test case for updating a product by ID
    it('should update a product by ID', async () => {
        const response = await request(app)
            .put(`/products/${createdProductId}`)
            .send({
                name: 'Updated Product',
                buy_price: 15.0,
                sell_price: 20.0,
                stock: 50
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', createdProductId);
    });

    // Test case for deleting a product by ID
    it('should delete a product by ID', async () => {
        const response = await request(app).delete(`/products/${createdProductId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', `Product: Updated Product, id ${createdProductId} deleted successfully`);
    });

    // Test case for getting a product that does not exist
    it('should return 404 for a non-existent product', async () => {
        const response = await request(app).get('/products/9999');
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'Product not found');
    });

    // Test case for updating a product with invalid data
    it('should return 400 for invalid product update', async () => {
        // First create a product to update
        const createResponse = await request(app)
            .post('/products')
            .send({
                name: 'Product for Invalid Update Test',
                buy_price: 10.0,
                sell_price: 15.0,
                stock: 100
            });
        
        const productIdForUpdate = createResponse.body.id;
        
        const response = await request(app)
            .put(`/products/${productIdForUpdate}`)
            .send({
                name: '',
                buy_price: -10.0,
                sell_price: -15.0,
                stock: -100
            });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });

    // test case for creating product with high buy price than sell price
    it('should return 400 for creating a product with buy price greater than sell price', async () => {
        const response = await request(app)
        .post('/products')
        .send({
            name: 'Invalid Product',
            buy_price: 20.0,
            sell_price: 15.0,
            stock: 100
        });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Buy price cannot be greater than sell price');
    });

    // Test case for deleting a product that does not exist
    it('should return 404 for deleting a non-existent product', async () => {
        const response = await request(app).delete('/products/9999');
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'Product not found');
    });

});

