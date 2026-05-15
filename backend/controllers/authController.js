/**
 * Authentication Controller
 *
 * Responsibilities:
 * - Handle user registration
 * - Handle user login
 * - Validate credentials
 * - Generate JWT tokens
 *
 * Functions:
 * - `register(req, res)`: Create a new user account
 * - `login(req, res)`: Authenticate user and return JWT
 */

const bcrypt = require('bcrypt');
const db = require('../database/database');
const { generateToken } = require('../utils/jwtHelper');

/**
 * Register a new user
 * POST /auth/register
 * Body: { email, password }
 */
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: 'Email and password are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: 'Password must be at least 6 characters long',
      });
    }

    // Check if user already exists
    const existingUser = db
      .prepare('SELECT id FROM users WHERE email = ?')
      .get(email);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User already exists',
        details: `Email ${email} is already registered`,
      });
    }

    // Hash password with bcrypt
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user into database
    const insertUser = db.prepare(
      'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)'
    );

    const result = insertUser.run(email, passwordHash, 'user');

    if (result.changes === 0) {
      throw new Error('Failed to insert user');
    }

    // Generate JWT token
    const token = generateToken(result.lastInsertRowid, 'user');

    return res.status(201).json({
      success: true,
      data: {
        userId: result.lastInsertRowid,
        email,
        role: 'user',
        token,
      },
    });
  } catch (err) {
    console.error('Error during registration:', err);
    return res.status(500).json({
      success: false,
      error: 'Registration failed',
      details: err.message,
    });
  }
};

/**
 * Login user
 * POST /auth/login
 * Body: { email, password }
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: 'Email and password are required',
      });
    }

    // Find user by email
    const user = db
      .prepare('SELECT id, email, password_hash, role FROM users WHERE email = ?')
      .get(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication failed',
        details: 'Invalid email or password',
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Authentication failed',
        details: 'Invalid email or password',
      });
    }

    // Generate JWT token
    const token = generateToken(user.id, user.role);

    return res.status(200).json({
      success: true,
      data: {
        userId: user.id,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (err) {
    console.error('Error during login:', err);
    return res.status(500).json({
      success: false,
      error: 'Login failed',
      details: err.message,
    });
  }
};

/**
 * Get current user info (requires authentication)
 * GET /auth/me
 * Headers: Authorization: Bearer <token>
 */
exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = db
      .prepare('SELECT id, email, role, created_at FROM users WHERE id = ?')
      .get(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        details: `User with ID ${userId} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.error('Error fetching current user:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch user',
      details: err.message,
    });
  }
};
