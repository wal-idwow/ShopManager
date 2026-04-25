/**
 * Product Controller
 * 
 * Responsibilities:
 * - Validate incoming product data.
 * - Call product model methods to interact with the database.
 * - Send HTTP JSON responses to the client.
 * 
 * Main Functions:
 * - `createProduct(req, res)`: Validates and creates a new product.
 * - `getAllProducts(req, res)`: Retrieves all products.
 * - `getProductById(req, res)`: Retrieves a product by its ID.
 * - `updateProduct(req, res)`: Updates a product by its ID.
 * - `deleteProduct(req, res)`: Deletes a product by its ID.
 * 
 * Validation Examples:
 * - `name` is required.
 * - `buy_price` and `sell_price` must be greater than 0.
 * - `stock` must be a non-negative number.
 */

// Import the Product model
const Product = require('../models/productModel');

// Controller function to create a new product
exports.createProduct = (req, res) => {
    const { name, buy_price, sell_price, stock } = req.body;

    // Basic validation
    // Check if name is provided and not empty
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }
    if (name.trim() === '') {
        return res.status(400).json({ error: 'Name cannot be empty' });
    }
    // Check if buy_price and sell_price are positive numbers
    if (buy_price <= 0 || sell_price <= 0) {
        return res.status(400).json({ error: 'Prices must be positive' });
    }
    // Check if stock is a non-negative number
    if (stock < 0) {
        return res.status(400).json({ error: 'Stock must be a non-negative number' });
    }
    // Check if buy_price is not greater than sell_price
    if (buy_price > sell_price) {
        return res.status(400).json({ error: 'Buy price cannot be greater than sell price' });
    }

    Product.create(req.body, (err, id) => {
        // Call the create method of the Product model to insert a new product into the database
        if (err) return res.status(500).json({ error: err.message });

        res.status(201).json({
            message: 'Product created successfully',
            id
        });
    });
};

// Controller function to get all products
exports.getAllProducts = (req, res) => {
    // 
    Product.findAll((err, products) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json(products); // Send the list of products as a JSON response
    });
};

// Controller function to get a product by ID
exports.getProductById = (req, res) => {
    const id = req.params.id; // Extract the product ID from the request parameters
    Product.findById(id, (err, product) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product); // Send the product details as a JSON response
    });
};

// Controller function to update a product by ID
exports.updateProduct = (req, res) => {
    const id = req.params.id; // Extract the product ID from the request parameters

    const { name, buy_price, sell_price, stock } = req.body;

    // Basic validation
    if (name && name.trim() === '') {
        return res.status(400).json({ error: 'Name cannot be empty' });
    }
    // Check if buy_price and sell_price are positive numbers if they are provided
    if (buy_price !== undefined && buy_price <= 0) {
        return res.status(400).json({ error: 'Buy price must be positive' });
    }
    // check if sell price is positive if it is provided
    if (sell_price !== undefined && sell_price <= 0) {
        return res.status(400).json({ error: 'Sell price must be positive' });
    }
    // check if buy_price is not greater than sell_price if both are provided
    if (buy_price !== undefined && sell_price !== undefined && buy_price > sell_price) {
        return res.status(400).json({ error: 'Buy price cannot be greater than sell price' });
    }
    // check if stock is a non-negative number if it is provided
    if (stock !== undefined && stock < 0) {
        return res.status(400).json({ error: 'Stock must be a non-negative number' });
    }

    Product.updateById(id, req.body, (err) => {
        if (err) return res.status(500).json({ error: err.message });

        // Fetch and return the updated product details
        Product.findById(id, (findErr, updatedProduct) => {
            if (findErr) return res.status(500).json({ error: findErr.message });
            res.json(updatedProduct);
        });
    });
};

// Controller function to delete a product by ID
exports.deleteProduct = (req, res) => {
    const id = Number(req.params.id);

    // Validate ID
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: 'Invalid product ID' });
    }

    // Check if product exists before deleting
    Product.findById(id, (findErr, product) => {
        if (findErr) return res.status(500).json({ error: findErr.message });
        if (!product) return res.status(404).json({ error: 'Product not found' });

        Product.deleteById(id, (deleteErr) => {
            if (deleteErr) return res.status(500).json({ error: deleteErr.message });

            res.json({
                message: `Product: ${product.name}, id ${id} deleted successfully`
            });
        });
    });
};
