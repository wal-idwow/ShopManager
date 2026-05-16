/**
 * Authentication Routes
 *
 * Provides authentication endpoints for:
 * - User registration
 * - User login
 * - Get current user info
 * - Admin registration (with secret)
 *
 * Routes:
 * - POST /auth/register - Register a new user
 * - POST /auth/login - Login with email and password
 * - GET /auth/me - Get current authenticated user info (protected)
 * - POST /auth/register-admin - Register a new admin user (requires secret)
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

/**
 * POST /auth/register-admin
 * Register a new admin user (requires ADMIN_REGISTRATION_SECRET)
 * Body: { email, password, adminSecret }
 * Response: { success, data: { userId, email, role, token } }
 */
router.post('/register-admin', authController.registerAdmin);

module.exports = router;
