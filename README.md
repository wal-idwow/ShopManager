# MiniShop App

MiniShop is a full-stack web application designed to manage a small shop's products and transactions. The project is divided into two main parts: the backend and the frontend. Below is an overview of the project structure, features, and usage instructions.

## Features

- **Product Management**: Add, edit, delete, and view products.
- **Transaction Management**: Record purchase and sale transactions.
- **Dashboard**: View key metrics such as total stock, low-stock products, and recent transactions.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Dark Mode**: Toggle between light and dark themes.
- **Multilingual Support**: English and Arabic translations.

## Project Structure

### Backend
The backend is built using Node.js and is responsible for handling the server-side logic, including database interactions and API endpoints. It is organized as follows:

- **Controllers**: Contains logic for handling requests related to products and transactions.
  - `productController.js`
  - `transactionController.js`
- **Database**: Manages database connections and operations.
  - `database.js`
  - `databaseTest.js`
- **Models**: Defines the data structure for products and transactions.
  - `productModel.js`
  - `transactionModel.js`
- **Routes**: Defines API endpoints for products and transactions.
  - `productRoutes.js`
  - `transactionRoutes.js`

### Frontend
The frontend is built using React and provides the user interface for interacting with the application. It is organized as follows:

- **Public**: Contains static files, including the main `index.html`.
- **Src**: Contains the main application logic and components.
  - `App.jsx`: The main application component.
  - `index.js`: Entry point for the React application.
  - **Components**: Reusable UI components such as `Navbar`, `ProductCard`, and `ProductList`.
  - **Screens**: Pages of the application, including `HomeScreen`, `ProductScreen`, and `TransactionScreen`.
  - **Services**: Contains `api.js` for handling API requests.
  - **Styles**: CSS files for styling the application.
    - `global.css`
    - `product.css`

### Tests
The project includes test files for both the backend and frontend to ensure functionality:

- **Backend Tests**:
  - `test_api.test.js`
  - `test_database.js`
- **Frontend Tests**: (To be implemented)

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

## Testing

### Backend Tests
Run backend tests using:
```bash
npm test
```

### Frontend Tests
Frontend tests are planned for future implementation.

## Future Improvements
- Add frontend tests for better reliability.
- Enhance the UI with additional features.
- Implement user authentication for secure access.
- Add more detailed analytics and reporting features.


