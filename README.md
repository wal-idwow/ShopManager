
# MiniShop — Shop Management System

A full-stack web application for managing a small shop's products and transactions. Built with a **Node.js/Express** backend and a **React** frontend, MiniShop provides a clean dashboard experience with authentication, role-based access control, multilingual support, and a live-deployable architecture.

---

## ✨ Features

| Category | Details |
|---|---|
| **Authentication** | JWT-based login with bcrypt password hashing; access & refresh token flow |
| **Role-Based Access** | `admin` and regular user roles; admin-only routes enforced on both client and server |
| **Product Management** | Create, read, update, and delete products with stock tracking |
| **Transaction Management** | Record purchase and sale transactions; stock is updated automatically |
| **Dashboard** | Key metrics: total stock, low-stock alerts, and recent transaction history |
| **Admin Panel** | Live DB statistics, health checks, and database cleanup tools |
| **Dark / Light Mode** | Persistent theme toggle stored via UI settings context |
| **Multilingual** | English and Arabic UI translations |
| **Responsive Design** | Mobile-first layout, tested on phones via ngrok tunnel |

---

## 🗂️ Project Structure

```
ShopManager/
├── backend/                    # Node.js / Express server
│   ├── controllers/
│   │   ├── authController.js       # Register, login, token refresh
│   │   ├── productController.js    # CRUD for products
│   │   ├── transactionController.js# Record & fetch transactions
│   │   └── adminController.js      # DB stats and admin tools
│   ├── database/
│   │   └── database.js             # SQLite setup (better-sqlite3)
│   ├── middleware/
│   │   └── authMiddleware.js       # JWT verification middleware
│   ├── models/
│   │   ├── productModel.js         # Product DB queries
│   │   └── transactionModel.js     # Transaction DB queries
│   ├── routes/
│   │   ├── authRoutes.js           # POST /auth/login, /auth/register, /auth/refresh
│   │   ├── productRoutes.js        # GET/POST/PUT/DELETE /products
│   │   ├── transactionRoutes.js    # GET/POST /transactions
│   │   └── adminRoutes.js          # GET /api/admin/...
│   ├── utils/
│   │   └── jwtHelper.js            # Token generation and verification helpers
│   └── index.js                    # Express app entry point
│
├── frontend/                   # React (Create React App)
│   └── src/
│       ├── App.jsx                 # Root component & route definitions
│       ├── index.js                # React DOM entry point
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── ProductCard.jsx
│       │   ├── ProductList.jsx
│       │   ├── transactionsCard.jsx
│       │   └── transactionsList.jsx
│       ├── context/
│       │   ├── AuthContext.jsx      # Auth state (user, token, login/logout)
│       │   └── UiSettingsContext.jsx# Theme, language preferences
│       ├── routes/
│       │   ├── PublicRoute.jsx      # Redirects authenticated users away from login
│       │   └── ProtectedRoute.jsx  # Guards routes by auth + role
│       ├── screens/
│       │   ├── HomeScreen.jsx       # Landing page (unauthenticated)
│       │   ├── LoginScreen.jsx      # Login form
│       │   ├── ProductScreen.jsx    # Products list / create / edit
│       │   ├── TransactionScreen.jsx# Transaction list and form
│       │   └── AdminScreen.jsx      # Admin-only dashboard
│       ├── services/
│       │   ├── api.js               # Axios calls for products & transactions
│       │   └── adminApi.js          # Axios calls for admin endpoints
│       └── styles/
│           ├── global.css
│           ├── product.css
│           └── admin.css
│
├── tests/
│   └── backend/
│       ├── products.test.js         # Supertest integration tests for products API
│       └── transactions.test.js     # Supertest integration tests for transactions API
│
├── package.json                # Root — Jest test runner, ngrok tunnel script
└── .prettierrc                 # Code formatting config
```

---

## 🔐 Authentication Flow

```
POST /auth/login
  → validates credentials
  → returns { accessToken, refreshToken }

Client stores token → attaches it as Bearer header on every protected request

POST /auth/refresh
  → validates refreshToken
  → returns new accessToken

Frontend route guards:
  PublicRoute  → unauthenticated users only (/, /login)
  ProtectedRoute → authenticated users (allowedRoles=['admin'] for admin panel)
```

---

## 🛣️ Route Map

### Backend API

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/register` | Public | Create a new user account |
| `POST` | `/auth/login` | Public | Authenticate and receive JWT tokens |
| `POST` | `/auth/refresh` | Public | Refresh access token |
| `GET` | `/products` | Required | List all products |
| `POST` | `/products` | Required | Create a new product |
| `PUT` | `/products/:id` | Required | Update a product |
| `DELETE` | `/products/:id` | Required | Delete a product |
| `GET` | `/transactions` | Required | List all transactions |
| `POST` | `/transactions` | Required | Record a transaction (updates stock) |
| `GET` | `/api/admin/stats` | Admin | Database statistics |
| `GET` | `/healthyBackend` | Public | Server health check |

### Frontend Routes

| Path | Access | Screen |
|------|--------|--------|
| `/` | Public (unauthenticated only) | `HomeScreen` — landing page |
| `/login` | Public | `LoginScreen` |
| `/products` | Protected | `ProductScreen` — list view |
| `/products/new` | Protected | `ProductScreen` — create form |
| `/products/edit/:id` | Protected | `ProductScreen` — edit form |
| `/transactions` | Protected | `TransactionScreen` |
| `/admin` | Admin only | `AdminScreen` |
| `*` | Any | Redirects to `/` |

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express 5
- **Database**: SQLite via `better-sqlite3`
- **Auth**: JSON Web Tokens (`jsonwebtoken`) + `bcrypt`
- **Testing**: Jest + Supertest

### Frontend
- **Framework**: React 18 (Create React App)
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: React Context API (`AuthContext`, `UiSettingsContext`)
- **Testing**: React Testing Library + Jest

---

## 🚀 How to Run

### Prerequisites
- **Node.js** (v18 or later recommended)
- **npm**

---

### 1. Install root dependencies (for tests & tools)
```bash
npm install
```

### 2. Start the Backend
```bash
cd backend
node index.js
```
The server starts on **port 3000** by default (configurable via `PORT` environment variable).

### 3. Start the Frontend (development)
```bash
cd frontend
npm install
npm start
```
The React dev server starts on **port 3001** and proxies API requests to the backend.

---

### Production Build (serve frontend from backend)
```bash
# Build the React app
cd frontend
npm run build

# Run the backend (it serves the built frontend)
cd ..
node backend/index.js
```

---

### Expose for Mobile Testing (ngrok)
```bash
# From project root
npm run tunnel
# or manually:
npx ngrok http 3000
```

---

## 🧪 Testing

### Backend Integration Tests
```bash
# From the project root
npm test
```
Runs Jest on all `tests/backend/*.test.js` files using Supertest to hit the live Express app.

### Frontend Component Tests
```bash
cd frontend
npm test
```
Runs React Testing Library tests from `src/components.test.jsx`.

---

## 🔧 Environment Variables

Create a `.env` file in the **backend** directory (or project root):

```env
PORT=3000
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
```

---

## 🗺️ Future Improvements

- [ ] Replace hardcoded frontend build path with a relative path for cross-platform portability
- [ ] Add end-to-end tests (e.g., Playwright or Cypress) covering the full auth flow
- [ ] Deploy to a stable cloud host (Railway, Render, or VPS) to replace the ngrok tunnel
- [ ] Add detailed analytics: revenue charts, inventory history, and export to CSV
- [ ] Implement token auto-refresh (silent renewal) on the client side
- [ ] Add product categories and search/filter functionality
