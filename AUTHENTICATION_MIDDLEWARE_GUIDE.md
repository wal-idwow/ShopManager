/**
 * Authentication & Authorization Middleware - Usage Examples
 *
 * This file demonstrates how the requireAuth and requireAdmin middleware work
 * and provides examples of protected routes in your application.
 */

// ============================================================================
// 1. APPLYING MIDDLEWARE TO ROUTES
// ============================================================================

/**
 * EXAMPLE 1: Protect all routes with authentication
 * In: backend/routes/productRoutes.js
 */
const { requireAuth } = require('../middleware/authMiddleware');

// Apply to all routes in this file
router.use(requireAuth);

// Now all product routes require valid JWT token:
// POST /products
// GET /products
// GET /products/:id
// PUT /products/:id
// DELETE /products/:id

/**
 * EXAMPLE 2: Protect specific route with authentication
 * In: backend/routes/someRoutes.js
 */
router.get('/public', controllerMethod);           // Public route (no auth)
router.post('/authenticated', requireAuth, controllerMethod); // Protected route
router.delete('/admin-only', requireAuth, requireAdmin, controllerMethod); // Admin only

/**
 * EXAMPLE 3: Admin authorization (with role check)
 * In: backend/routes/adminRoutes.js
 */
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

router.use(requireAuth);   // All admin routes require authentication
router.use(requireAdmin);  // All admin routes require admin role
// Now all routes require: valid JWT AND role='admin'

// ============================================================================
// 2. API USAGE EXAMPLES
// ============================================================================

/**
 * Step 1: Register a new user
 */
// Request:
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure123"
}

// Response (201):
{
  "success": true,
  "data": {
    "userId": 2,
    "email": "user@example.com",
    "role": "user",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzE1Nzc2MDAwLCJleHAiOjE3MTYzODA4MDB9.xyz..."
  }
}

/**
 * Step 2: Use token to access authenticated endpoint
 */
// Request (with token from registration):
GET /products
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzE1Nzc2MDAwLCJleHAiOjE3MTYzODA4MDB9.xyz...

// Response (200):
[
  { "id": 1, "name": "Product A", "buy_price": 10, "sell_price": 15, "stock": 100 },
  { "id": 2, "name": "Product B", "buy_price": 20, "sell_price": 30, "stock": 50 }
]

/**
 * Step 3: User tries to access admin route
 */
// Request (user token, but route requires admin):
POST /api/admin/reset
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzE1Nzc2MDAwLCJleHAiOjE3MTYzODA4MDB9.xyz...

// Response (403 Forbidden):
{
  "success": false,
  "error": "Forbidden",
  "details": "This resource requires admin privileges"
}

/**
 * Step 4: Admin accesses admin route
 */
// Request (admin token):
POST /api/admin/reset
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcxNTc3NjAwMCwiZXhwIjoxNzE2MzgwODAwfQ.abc...

// Response (200):
{
  "message": "Database reset successfully",
  "details": {...},
  "timestamp": "2026-05-15T10:30:00.000Z"
}

// ============================================================================
// 3. ERROR RESPONSES
// ============================================================================

/**
 * 401 Unauthorized - Missing token
 */
GET /products

// Response (401):
{
  "success": false,
  "error": "Unauthorized",
  "details": "Authorization header is required"
}

/**
 * 401 Unauthorized - Invalid token format
 */
GET /products
Authorization: InvalidFormat token123

// Response (401):
{
  "success": false,
  "error": "Unauthorized",
  "details": "Invalid authorization header format. Use: Bearer <token>"
}

/**
 * 401 Unauthorized - Expired or invalid token
 */
GET /products
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature

// Response (401):
{
  "success": false,
  "error": "Unauthorized",
  "details": "Invalid token"
}

/**
 * 403 Forbidden - User lacks admin privileges
 */
POST /api/admin/reset
Authorization: Bearer <valid-user-token>

// Response (403):
{
  "success": false,
  "error": "Forbidden",
  "details": "This resource requires admin privileges"
}

// ============================================================================
// 4. PROTECTED ROUTES SUMMARY
// ============================================================================

/**
 * PUBLIC ROUTES (no authentication required)
 */
POST /auth/register     - Register new user
POST /auth/login        - Login and get JWT token
GET  /healthyBackend    - Health check

/**
 * AUTHENTICATED ROUTES (requireAuth - any valid user)
 */
GET  /auth/me           - Get current user info
GET  /products          - List all products
POST /products          - Create new product
GET  /products/:id      - Get product by ID
PUT  /products/:id      - Update product
DELETE /products/:id    - Delete product
GET  /transactions      - List all transactions
POST /transactions      - Create new transaction
GET  /transactions/:id  - Get transaction by ID

/**
 * ADMIN-ONLY ROUTES (requireAuth + requireAdmin)
 */
POST /api/admin/reset   - Reset entire database
GET  /api/admin/stats   - Get database statistics
POST /api/admin/cleanup - Cleanup orphaned transactions
GET  /api/admin/health  - Admin health check

// ============================================================================
// 5. CURL COMMAND EXAMPLES
// ============================================================================

/**
 * Register a user
 */
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"test123"}'

/**
 * Login
 */
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@local","password":"admin123"}'

/**
 * Get products (with token)
 */
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
curl -X GET http://localhost:3000/products \
  -H "Authorization: Bearer $TOKEN"

/**
 * Reset database (admin only)
 */
ADMIN_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
curl -X POST http://localhost:3000/api/admin/reset \
  -H "Authorization: Bearer $ADMIN_TOKEN"

// ============================================================================
// 6. REQUEST FLOW DIAGRAM
// ============================================================================

/*
Client Request
    ↓
[Express receives request]
    ↓
[requireAuth middleware]
    ├─ Extract Bearer token from Authorization header
    ├─ Verify token signature and expiration
    ├─ If invalid → return 401 Unauthorized
    └─ If valid → attach req.user = { userId, role } and continue
    ↓
[requireAdmin middleware] (if needed)
    ├─ Check if req.user exists
    ├─ Check if req.user.role === 'admin'
    ├─ If not admin → return 403 Forbidden
    └─ If admin → continue
    ↓
[Controller/Handler executes]
    ↓
[Response sent to client]
*/
