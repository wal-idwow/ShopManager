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

// Utility function to promisify callback-based model methods
const promisify = (fn, context) => {
    return (...args) => {
        return new Promise((resolve, reject) => {
            fn.apply(context, [...args, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            }]);
        });
    };
};

// Controller function to create a new product
exports.createProduct = async (req, res) => {
    try {
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

        const id = await Product.create(req.body);

        res.status(201).json({
            message: 'Product created successfully',
            id
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Controller function to get all products
exports.getAllProducts = async (req, res) => {
    try {
        const findAll = promisify(Product.findAll, Product);
        const products = await findAll();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Controller function to get a product by ID
exports.getProductById = async (req, res) => {
    try {
        const id = req.params.id;
        const findById = promisify(Product.findById, Product);
        const product = await findById(id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Controller function to update a product by ID
exports.updateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        
        // Fetch the current product first
        const findById = promisify(Product.findById, Product);
        const currentProduct = await findById(id);
        
        if (!currentProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Use current values for fields not provided in the request
        const name = req.body.name !== undefined ? req.body.name : currentProduct.name;
        const buy_price = req.body.buy_price !== undefined ? req.body.buy_price : currentProduct.buy_price;
        const sell_price = req.body.sell_price !== undefined ? req.body.sell_price : currentProduct.sell_price;
        const stock = req.body.stock !== undefined ? req.body.stock : currentProduct.stock;

        // Basic validation
        if (name && name.trim() === '') {
            return res.status(400).json({ error: 'Name cannot be empty' });
        }
        // Check if buy_price and sell_price are positive numbers
        if (buy_price <= 0) {
            return res.status(400).json({ error: 'Buy price must be positive' });
        }
        // check if sell price is positive
        if (sell_price <= 0) {
            return res.status(400).json({ error: 'Sell price must be positive' });
        }
        // check if buy_price is not greater than sell_price
        if (buy_price > sell_price) {
            return res.status(400).json({ error: 'Buy price cannot be greater than sell price' });
        }
        // check if stock is a non-negative number
        if (stock < 0) {
            return res.status(400).json({ error: 'Stock must be a non-negative number' });
        }

        const updateById = promisify(Product.updateById, Product);
        await updateById(id, { name, buy_price, sell_price, stock });

        // Fetch and return the updated product details
        const updatedProduct = await findById(id);
        res.json(updatedProduct);
    } catch (err) {
        console.error('Update product error:', err);
        res.status(500).json({ error: err.message });
    }
};

// Controller function to delete a product by ID
exports.deleteProduct = async (req, res) => {
    try {
        const id = Number(req.params.id);

        // Validate ID
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ error: 'Invalid product ID' });
        }

        const findById = promisify(Product.findById, Product);
        const deleteById = promisify(Product.deleteById, Product);

        // Check if product exists before deleting
        const product = await findById(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        await deleteById(id);

        res.json({
            message: `Product: ${product.name}, id ${id} deleted successfully`
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
