/**
 * Admin Routes
 *
 * Provides administrative endpoints for:
 * - Database reset and cleanup
 * - Database statistics and monitoring
 * - Data integrity checks
 *
 * Routes:
 * - POST /api/admin/reset - Reset database
 * - GET /api/admin/stats - Get database statistics
 * - POST /api/admin/cleanup - Cleanup orphaned records
 * - GET /api/admin/health - Health check
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Database reset endpoint (with warning)
router.post('/reset', adminController.resetDatabase);

// Database statistics endpoint
router.get('/stats', adminController.getDbStats);

// Cleanup orphaned transactions
router.post('/cleanup', adminController.cleanupOrphanedTransactions);

// Health check endpoint
router.get('/health', adminController.healthCheck);

module.exports = router;
