/**
 * API Service Module
 *
 * Responsibilities:
 * - Provide functions to interact with the backend API for managing products and transactions.
 * - Handle HTTP requests and responses using Axios.
 * - Centralize API endpoints and error handling.
 *
 * Features:
 * - Axios instance with a configurable base URL.
 * - Functions for CRUD operations on products and transactions.
 * - Error handling and logging for API requests.
 */

import axios from 'axios'; // Import axios for making HTTP requests

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

const api = axios.create({
  // Create an axios instance with a base URL for the API
  baseURL: API_BASE_URL, // Base URL for the backend API
});

// Interceptor to add JWT token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('minishop-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Export the api instance for use in other modules
export default api;

/**
 * Fetch all products from the API.
 * @returns {Promise<Array>} - A promise that resolves to an array of products.
 */
export const getProducts = async () => {
  try {
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Fetch a single product by its ID from the API.
 * @param {string} id - The ID of the product to fetch.
 * @returns {Promise<Object>} - A promise that resolves to the product data.
 */
export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

/**
 * Create a new product by sending a POST request to the API.
 * @param {Object} data - The product data to create.
 * @returns {Promise<Object>} - A promise that resolves to the created product data.
 */
export const createProduct = async (data) => {
  try {
    const response = await api.post('/products', data);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

/**
 * Update an existing product by sending a PUT request to the API.
 * @param {string} id - The ID of the product to update.
 * @param {Object} data - The updated product data.
 * @returns {Promise<Object>} - A promise that resolves to the updated product data.
 */
export const updateProduct = async (id, data) => {
  try {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

/**
 * Delete a product by sending a DELETE request to the API.
 * @param {string} id - The ID of the product to delete.
 * @returns {Promise<Object>} - A promise that resolves to the deletion response.
 */
export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

/**
 * Create a new transaction by sending a POST request to the API.
 * @param {Object} data - The transaction data to create.
 * @returns {Promise<Object>} - A promise that resolves to the created transaction data.
 */
export const createTransaction = async (data) => {
  try {
    const response = await api.post('/transactions', data);
    return response.data;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};

/**
 * Fetch all transactions from the API.
 * @returns {Promise<Array>} - A promise that resolves to an array of transactions.
 */
export const getTransactions = async () => {
  try {
    const response = await api.get('/transactions');
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

/**
 * Fetch a single transaction by its ID from the API.
 * @param {string} id - The ID of the transaction to fetch.
 * @returns {Promise<Object>} - A promise that resolves to the transaction data.
 */
export const getTransactionById = async (id) => {
  try {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transaction:', error);
    throw error;
  }
};

/**
 * Register a new user account
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} - Response with token and user data
 */
export const register = async (email, password) => {
  try {
    const response = await api.post('/auth/register', { email, password });
    return response.data;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} - Response with token and user data
 */
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

/**
 * Get current authenticated user info
 * @returns {Promise<Object>} - Current user data
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};
