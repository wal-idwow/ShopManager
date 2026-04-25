/**
 * Entry Point for React Application
 * 
 * Responsibilities:
 * - Import and initialize the React application.
 * - Render the root `App` component inside the `#root` DOM element.
 * - Wrap the application with necessary providers and utilities.
 * - Enable development checks and warnings using `React.StrictMode`.
 * 
 * Features:
 * - Uses `ReactDOM.createRoot` for rendering.
 * - Wraps the application with `UiSettingsProvider` for context management.
 * - Includes global styles for consistent theming.
 */

import React from 'react';
import ReactDOM from 'react-dom/client'; // Import ReactDOM for rendering the React application to the DOM
import App from './App'; // Import the main App component which serves as the root component for the application
import { UiSettingsProvider } from './context/UiSettingsContext';
import './styles/global.css'; // Import global styles
import './styles/product.css'; // Import product-specific styles

const root = ReactDOM.createRoot(document.getElementById('root')); // Create a root DOM node using ReactDOM.createRoot and target the element with the ID 'root' in the HTML file
root.render(
  <React.StrictMode>
    <UiSettingsProvider>
      <App /> {/* Render the App component wrapped with UiSettingsProvider */}
    </UiSettingsProvider>
  </React.StrictMode>
);
