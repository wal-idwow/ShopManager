/**
 * Admin API Service
 * 
 * Provides functions to interact with admin endpoints for:
 * - Database reset
 * - Database statistics
 * - Database cleanup
 * - Health checks
 */

import axios from 'axios';

const BASE_URL = `${process.env.REACT_APP_API_URL || ''}/api/admin`;

// Create axios instance with default config
const adminApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Reset the entire database
 * Clears all products and transactions, resets ID generators
 * @returns {Promise} - Response with reset status
 */
export const resetDatabase = async () => {
  try {
    const response = await adminApi.post('/reset');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

/**
 * Get database statistics
 * @returns {Promise} - Response with stats including product count, transaction count, orphaned transactions
 */
export const getDbStats = async () => {
  try {
    const response = await adminApi.get('/stats');
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

/**
 * Cleanup orphaned transactions
 * Removes transactions that reference deleted products
 * @returns {Promise} - Response with count of deleted orphaned transactions
 */
export const cleanupOrphanedTransactions = async () => {
  try {
    const response = await adminApi.post('/cleanup');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

/**
 * Get database health check
 * Full integrity verification including database connection, counts, and data integrity
 * @returns {Promise} - Response with health status and recommendations
 */
export const getHealthCheck = async () => {
  try {
    const response = await adminApi.get('/health');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

export default adminApi;
