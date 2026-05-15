/**
 * Authentication Routes
 *
 * Provides authentication endpoints for:
 * - User registration
 * - User login
 * - Get current user info
 *
 * Routes:
 * - POST /auth/register - Register a new user
 * - POST /auth/login - Login with email and password
 * - GET /auth/me - Get current authenticated user info (protected)
 *
 * JWT Authentication:
 * - Protected routes require Authorization header: Bearer <token>
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../utils/jwtHelper');

/**
 * POST /auth/register
 * Register a new user account
 * Body: { email, password }
 * Response: { success, data: { userId, email, role, token } }
 */
router.post('/register', authController.register);

/**
 * POST /auth/login
 * Authenticate user and return JWT token
 * Body: { email, password }
 * Response: { success, data: { userId, email, role, token } }
 */
router.post('/login', authController.login);

/**
 * GET /auth/me
 * Get current authenticated user information
 * Headers: Authorization: Bearer <token>
 * Response: { success, data: { id, email, role, created_at } }
 */
router.get('/me', authenticateToken, authController.getCurrentUser);

module.exports = router;
