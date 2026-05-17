# MiniShop App

MiniShop is a full-stack web application designed to manage a small shop's products and transactions. The project is divided into two main parts: the backend and the frontend. Below is an overview of the project structure, features, and usage instructions.

## Features

- **Product Management**: Add, edit, delete, and view products.
- **Transaction Management**: Record purchase and sale transactions.
- **Dashboard**: View key metrics such as total stock, low-stock products, and recent transactions.
- **Admin Panel**: View live database statistics, health checks, and cleanup tools.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Dark Mode**: Toggle between light and dark themes.
- **Multilingual Support**: English and Arabic translations.

## Live Deployment

The app is currently deployed and tested through an ngrok public URL for device testing.

- Backend serves the React build directly from `backend/index.js`.
- The live URL is accessible from phones and other devices through ngrok.
- Home and admin screens now read from the same live database state.
- Admin statistics are aligned with the dashboard counts shown on the home page.

## Project Structure

### Backend
The backend is built using Node.js and is responsible for handling the server-side logic, including database interactions and API endpoints. It is organized as follows:

- **Controllers**: Contains logic for handling requests related to products, transactions and admin.
  - `productController.js`
  - `transactionController.js`
  - `adminController.js`
- **Database**: Manages database connections and operations.
  - `database.js`
  - `databaseTest.js`
- **Models**: Defines the data structure for products and transactions.
  - `productModel.js`
  - `transactionModel.js`
- **Routes**: Defines API endpoints for products and transactions.
  - `productRoutes.js`
  - `transactionRoutes.js`
  - `adminRoutes.js`

### Frontend
The frontend is built using React and provides the user interface for interacting with the application. It is organized as follows:

- **Public**: Contains static files, including the main `index.html`.
- **Src**: Contains the main application logic and components.
  - `App.jsx`: The main application component.
  - `index.js`: Entry point for the React application.
  - **Components**: Reusable UI components such as `Navbar`, `ProductCard`, and `ProductList`, `transactionsCard`, `transactionsList` .
  - **Screens**: Pages of the application, including `HomeScreen`, `ProductScreen`, and `TransactionScreen`, `AdminScreen`.
  - **Services**: Contains `api.js` for handling API requests and `adminApi.js` for handling adminAPI requests.
  - **Styles**: CSS files for styling the application.
    - `global.css`
    - `product.css`
    - `admin.css`

### Tests
The project includes test files for both the backend and frontend to ensure functionality:

- **Backend Tests**:
  - `products.test.js`
  - `transactions.test.js`
- **Frontend Tests**: 
  - `components.test.jsx`

## How to Run the Project

### Prerequisites
- Node.js installed on your system.
- A package manager such as npm.

### Backend
To start the backend server:
1. Navigate to the `backend` directory:
   ```
   cd backend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the server:
   ```
   node index.js
   ```

### Frontend
To start the frontend development server:
1. Navigate to the `frontend` directory:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```

### Production-style local run

To verify the deployed setup locally, build the frontend and start the backend server:

```bash
cd frontend
npm run build
cd ..
node backend/index.js
```

To expose the app publicly for phone testing:

```bash
npx ngrok http 3000
```

## Testing

### Backend Tests
Run backend tests using:
```bash
npm test
```

### Frontend Tests
Frontend tests are available and the UI has been verified manually in a browser and on mobile phones through the live ngrok URL.

## Project Context & Current Status

MiniShop already covers the core operational flow for a small shop: inventory management, purchase/sale tracking, and a dashboard/admin view that surfaces live database metrics. The backend exposes REST endpoints backed by SQLite, while the React frontend focuses on day-to-day operations and quick visibility into stock levels. The current deployment approach (backend serving the frontend build, with ngrok for device testing) makes it easy to demo and validate features on real devices.

If the current feature set meets the immediate business needs (inventory tracking, transaction entry, and basic reporting), the project is in a solid "good enough for internal use and demos" stage. The next phase should focus on hardening, automation, and production readiness rather than adding large new features.

## Forward Plan (when the current version is good enough)

1. **Quality & Reliability**
   - Ensure automated backend and frontend tests pass consistently.
   - Add CI coverage for tests and linting to catch regressions early.
   - Document the expected demo dataset and the minimum data needed to validate key flows.
2. **Security & Access**
   - Add user authentication and role-based access (admin vs. staff).
   - Store credentials securely and add password reset or admin bootstrapping guidance.
3. **Deployment & Operations**
   - Replace the temporary ngrok tunnel with a stable hosting target.
   - Add environment-based configuration for database paths, ports, and API URLs.
4. **Product Enhancements (optional)**
   - Expand analytics and reporting (profit margins, daily/weekly summaries).
   - Add automated end-to-end tests for the live deployment path.

## Future Improvements
- Add user authentication for secure access.
- Add more detailed analytics and reporting features.
- Replace the temporary ngrok tunnel with a stable deployment target.
- Add automated end-to-end tests for the live deployment path.


