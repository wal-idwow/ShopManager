/**
 * Frontend Authentication Refactor - JWT-Based System
 *
 * This document describes the refactored authentication system that uses
 * real JWT tokens instead of client-side role selection.
 *
 * ============================================================================
 * OVERVIEW
 * ============================================================================
 *
 * OLD SYSTEM (Removed):
 * - Manual role selection via buttons ("Enter as User" / "Enter as Admin")
 * - Role stored only in localStorage with key 'minishop-role'
 * - No backend validation
 * - Guest/User/Admin roles all selectable
 *
 * NEW SYSTEM (Current):
 * - JWT-based token authentication
 * - Token stored in localStorage with key 'minishop-token'
 * - Token contains userId and role (decoded from JWT payload)
 * - Backend validates token before granting access
 * - Login/Register forms instead of role selection
 * - Automatic redirection to /login when not authenticated
 *
 * ============================================================================
 * AUTHENTICATION FLOW
 * ============================================================================
 *
 * 1. USER REGISTRATION
 *    User fills form: email + password
 *    ↓
 *    POST /auth/register { email, password }
 *    ↓
 *    Backend validates & returns JWT token
 *    ↓
 *    Frontend stores token in localStorage
 *    ↓
 *    User automatically logged in & redirected to /products
 *
 * 2. USER LOGIN
 *    User fills form: email + password
 *    ↓
 *    POST /auth/login { email, password }
 *    ↓
 *    Backend validates credentials & returns JWT token
 *    ↓
 *    Frontend stores token in localStorage
 *    ↓
 *    User redirected to /products (or from location)
 *
 * 3. ACCESSING PROTECTED ROUTES
 *    User requests /products
 *    ↓
 *    ProtectedRoute component checks: isAuthenticated?
 *    ├─ No token → redirect to /login
 *    └─ Token exists → check role
 *
 * 4. API REQUESTS WITH TOKEN
 *    Frontend makes API call to /products
 *    ↓
 *    Axios interceptor adds: Authorization: Bearer <token>
 *    ↓
 *    Backend requireAuth middleware verifies token
 *    ├─ Invalid/expired → 401 Unauthorized
 *    └─ Valid → req.user = { userId, role }
 *
 * ============================================================================
 * FILES CHANGED
 * ============================================================================
 *
 * 1. frontend/src/context/AuthContext.jsx (REFACTORED)
 *    OLD: loginAs(role), logout()
 *    NEW: login(email, password), register(email, password), logout()
 *    
 *    Key Changes:
 *    - Stores JWT token from backend instead of local role
 *    - Decodes token to extract userId and role
 *    - API calls to /auth/login and /auth/register
 *    - Token persistence in localStorage
 *    - Auto-validation on app load (checks expiration)
 *
 * 2. frontend/src/services/api.js (UPDATED)
 *    NEW: Axios interceptor adds Bearer token to all requests
 *    NEW: login(), register(), getCurrentUser() functions
 *    
 *    Key Changes:
 *    - Automatic token injection in Authorization header
 *    - Authentication API functions
 *
 * 3. frontend/src/screens/LoginScreen.jsx (NEW)
 *    Purpose: Login and registration forms
 *    Features:
 *    - Toggle between login and register modes
 *    - Form validation (email, password length)
 *    - Error display
 *    - Demo credentials for admin account
 *    - Redirect authenticated users to /products
 *
 * 4. frontend/src/App.jsx (REFACTORED)
 *    OLD: RequireRole component (only checked role)
 *    NEW: ProtectedRoute component (checks authentication + role)
 *    
 *    Key Changes:
 *    - Route /login added (public)
 *    - All product/transaction routes protected
 *    - Admin route requires role === 'admin'
 *    - Unauthenticated users redirected to /login
 *
 * 5. frontend/src/components/Navbar.jsx (UPDATED)
 *    Changes:
 *    - Shows "Login" link when not authenticated
 *    - Shows "Logout" button when authenticated
 *    - Only shows nav links (/products, /transactions) when authenticated
 *    - Admin link only shows for admin users
 *    - Role display shows current user role
 *
 * 6. frontend/src/screens/HomeScreen.jsx (REFACTORED)
 *    Changes:
 *    - Removed "Enter as User" / "Enter as Admin" buttons
 *    - Removed loginAs() calls
 *    - Shows landing page for unauthenticated users
 *    - Shows dashboard for authenticated users
 *    - "Login" button redirects to /login
 *
 * 7. frontend/src/styles/global.css (EXTENDED)
 *    Added: .auth-container, .auth-card, .auth-form, .form-group, etc.
 *    Purpose: Styling for LoginScreen and auth forms
 *
 * ============================================================================
 * API INTEGRATION
 * ============================================================================
 *
 * AuthContext.login() method:
 *
 *   const login = async (email, password) => {
 *     try {
 *       const response = await fetch('/auth/login', {
 *         method: 'POST',
 *         headers: { 'Content-Type': 'application/json' },
 *         body: JSON.stringify({ email, password })
 *       });
 *       
 *       const data = await response.json();
 *       
 *       // Decode JWT to get userId and role
 *       const decoded = decodeToken(data.data.token);
 *       
 *       // Store token
 *       localStorage.setItem('minishop-token', data.data.token);
 *       
 *       // Update auth state
 *       setAuthState({
 *         token: data.data.token,
 *         userId: decoded.userId,
 *         role: decoded.role,
 *         isAuthenticated: true
 *       });
 *       
 *       return { success: true, data: data.data };
 *     } catch (err) {
 *       return { success: false, error: err.message };
 *     }
 *   };
 *
 * ============================================================================
 * JWT TOKEN DECODING
 * ============================================================================
 *
 * JWT Format: header.payload.signature
 *
 * Example JWT:
 * eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcxNTc3NjAwMCwiZXhwIjoxNzE2MzgwODAwfQ.xyz...
 *
 * Decoded Payload:
 * {
 *   "userId": 1,
 *   "role": "admin",
 *   "iat": 1715776000,
 *   "exp": 1716380800
 * }
 *
 * decodeToken() function:
 * - Splits token by '.'
 * - Takes second part (payload)
 * - Decodes base64 to JSON
 * - Returns decoded object
 *
 * isTokenExpired() function:
 * - Compares exp (expiration) with current time
 * - Returns true if expired
 * - Auto-clears expired tokens from localStorage
 *
 * ============================================================================
 * ROUTE PROTECTION PATTERN
 * ============================================================================
 *
 * OLD PATTERN (RequireRole):
 * <RequireRole allowedRoles={['admin']}>
 *   <AdminScreen />
 * </RequireRole>
 *
 * NEW PATTERN (ProtectedRoute):
 * <ProtectedRoute allowedRoles={['admin']}>
 *   <AdminScreen />
 * </ProtectedRoute>
 *
 * ProtectedRoute Logic:
 * 1. Check if user is authenticated (token exists)
 *    └─ if not → redirect to /login with from location
 * 2. If allowedRoles specified, check user role
 *    └─ if mismatch → redirect to /
 * 3. If all checks pass → render children
 *
 * ============================================================================
 * USAGE EXAMPLE IN COMPONENT
 * ============================================================================
 *
 * import { useAuth } from '../context/AuthContext';
 *
 * export const MyComponent = () => {
 *   const { 
 *     isAuthenticated,    // boolean
 *     token,              // JWT token or null
 *     userId,             // number or null
 *     role,               // 'user' | 'admin' | null
 *     isUser,             // boolean
 *     isAdmin,            // boolean
 *     login,              // async function
 *     register,           // async function
 *     logout,             // function
 *     isLoading,          // boolean during login/register
 *     error               // error message or null
 *   } = useAuth();
 *
 *   if (!isAuthenticated) {
 *     return <div>Please log in</div>;
 *   }
 *
 *   return (
 *     <div>
 *       Welcome {userId} ({role})
 *       <button onClick={logout}>Logout</button>
 *     </div>
 *   );
 * };
 *
 * ============================================================================
 * AXIOS INTERCEPTOR
 * ============================================================================
 *
 * All API requests automatically include the JWT token:
 *
 * api.interceptors.request.use(
 *   (config) => {
 *     const token = localStorage.getItem('minishop-token');
 *     if (token) {
 *       config.headers.Authorization = `Bearer ${token}`;
 *     }
 *     return config;
 *   }
 * );
 *
 * This means:
 * - getProducts() automatically sends: Authorization: Bearer <token>
 * - getTransactions() automatically sends: Authorization: Bearer <token>
 * - Any api.get/post/put/delete includes the token
 *
 * ============================================================================
 * DEMO CREDENTIALS
 * ============================================================================
 *
 * Default Admin User (auto-created on first backend startup):
 * - Email: admin@local
 * - Password: admin123
 * - Role: admin
 *
 * Registration:
 * - New users automatically get role: 'user'
 * - Only backend can change role to 'admin'
 *
 * ============================================================================
 * ERROR HANDLING
 * ============================================================================
 *
 * Login Errors:
 * - Missing credentials: "Email and password are required"
 * - Short password: "Password must be at least 6 characters"
 * - Invalid credentials: "Invalid email or password"
 * - Server error: (returned from backend)
 *
 * Route Errors:
 * - Not authenticated: Redirect to /login
 * - Wrong role: Redirect to /
 * - Expired token: Auto-cleared, user redirected to /login
 *
 * API Errors:
 * - 401 Unauthorized: Token missing, invalid, or expired
 * - 403 Forbidden: User lacks required role/permissions
 *
 * ============================================================================
 * MIGRATION FROM OLD SYSTEM
 * ============================================================================
 *
 * Users with old localStorage role will:
 * 1. See landing page (not authenticated)
 * 2. Need to login or register
 * 3. Old role is ignored
 * 4. New JWT token replaces old role in localStorage
 *
 * Database Impact:
 * - New users table required (created on backend startup)
 * - Existing products/transactions unaffected
 * - Admin routes now require valid JWT token
 *
 * ============================================================================
 * TESTING CHECKLIST
 * ============================================================================
 *
 * [ ] Can register new user with email/password
 * [ ] Can login with admin@local / admin123
 * [ ] Can login with newly created user
 * [ ] JWT token stored in localStorage after login
 * [ ] Token decoded correctly (contains userId and role)
 * [ ] Unauthenticated users can't access /products
 * [ ] Unauthenticated users redirected to /login
 * [ ] Navbar shows Login link when not authenticated
 * [ ] Navbar shows role pill and Logout when authenticated
 * [ ] Logout clears token and redirects to /
 * [ ] Admin users can access /admin
 * [ ] Non-admin users can't access /admin (redirected to /)
 * [ ] Protected routes redirect with ?from location
 * [ ] API requests include Authorization header
 * [ ] Expired tokens auto-clear on app reload
 * [ ] Login form shows error messages
 * [ ] Toggle between login and register modes works
 *
 * ============================================================================
 * SECURITY NOTES
 * ============================================================================
 *
 * ✓ Token stored in localStorage (accessible to XSS attacks)
 *   → Use HTTPS in production
 *   → Implement Content Security Policy
 *   → Sanitize user input to prevent XSS
 *
 * ✓ Backend validates token before granting access
 *   → Do not trust client-side role checks
 *   → Always verify role on backend for sensitive operations
 *
 * ✓ Passwords hashed with bcrypt (10 rounds)
 *   → Never send or store plain text passwords
 *   → Use HTTPS to protect in transit
 *
 * ✓ Token expiration set to 7 days
 *   → Reduce token validity for higher security
 *   → Implement refresh token pattern for long-running apps
 *
 * ✓ JWT Algorithm: HS256 (symmetric)
 *   → Use strong JWT_SECRET (32+ characters)
 *   → Change JWT_SECRET in production
 *   → Consider RS256 (asymmetric) for better security
 */
