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
 *
 * Access control:
 * - If ADMIN_ACCESS_KEY is configured, callers must send a matching
 *   X-Minishop-Admin-Key header.
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware'); // Import auth middleware

// Apply authentication and admin authorization middleware to all admin routes
router.use(requireAuth);
router.use(requireAdmin);

const requireAdminAccess = (req, res, next) => {
	const adminAccessKey = process.env.ADMIN_ACCESS_KEY;

	if (!adminAccessKey) {
		return next();
	}

	const providedKey = req.header('X-Minishop-Admin-Key');

	if (providedKey === adminAccessKey) {
		return next();
	}

	return res.status(403).json({
		error: 'Admin access denied',
		details: 'Missing or invalid admin access key',
	});
};

router.use(requireAdminAccess);

// Database reset endpoint (with warning)
router.post('/reset', adminController.resetDatabase);

// Database statistics endpoint
router.get('/stats', adminController.getDbStats);

// Cleanup orphaned transactions
router.post('/cleanup', adminController.cleanupOrphanedTransactions);

// Health check endpoint
router.get('/health', adminController.healthCheck);

module.exports = router;
