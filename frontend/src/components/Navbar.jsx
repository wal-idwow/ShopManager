/**
 * Navbar Component
 *
 * Responsibilities:
 * - Render the application title and tagline.
 * - Provide navigation links to Home, Products, and Transactions pages.
 * - Include buttons to toggle language, theme, and session role awareness.
 *
 * Props:
 * - None (uses context for UI settings).
 *
 * Context:
 * - `t`: Function for translations.
 * - `language`: Current language setting.
 * - `theme`: Current theme setting.
 * - `toggleLanguage`: Function to toggle the language.
 * - `toggleTheme`: Function to toggle the theme.
 */

import React from 'react'; // Import React for creating the component
import { NavLink } from 'react-router-dom'; // Import Link component from react-router-dom for navigation between pages
import { useAuth } from '../context/AuthContext';
import { useUiSettings } from '../context/UiSettingsContext';

// Navbar component with links to Home, Products, and Transactions pages
const Navbar = () => {
  const { t, language, theme, toggleLanguage, toggleTheme } = useUiSettings();
  const { role, isAuthenticated, logout } = useAuth();

  const roleLabel =
    role === 'admin' ? t('adminAccount') : role === 'user' ? t('userAccount') : t('guestAccount');

  return (
    <nav className="topbar">
      <div>
        {/* Render application title and tagline */}
        <p className="topbar-eyebrow">{t('dashboard')}</p>
        <h1 className="topbar-title">{t('appName')}</h1>
        <p className="topbar-subtitle">{t('appTagline')}</p>
      </div>
      <div className="topbar-actions">
        <div className="topbar-role-row">
          <span className="topbar-role-pill">
            {t('currentRole')}: {roleLabel}
          </span>
          {isAuthenticated ? (
            <button type="button" className="topbar-link topbar-toggle" onClick={logout}>
              {t('signOut')}
            </button>
          ) : null}
        </div>
        <div className="topbar-links">
          {/* Button to toggle language */}
          <button type="button" className="topbar-link topbar-toggle" onClick={toggleLanguage}>
            {language === 'en' ? t('arabic') : t('english')}
          </button>
          {/* Button to toggle theme */}
          <button type="button" className="topbar-link topbar-toggle" onClick={toggleTheme}>
            {theme === 'light' ? t('darkMode') : t('lightMode')}
          </button>
        </div>
        <div className="topbar-links">
          {/* Navigation links */}
          <NavLink to="/" className={({ isActive }) => `topbar-link${isActive ? ' active' : ''}`}>
            {t('home')}
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) => `topbar-link${isActive ? ' active' : ''}`}
          >
            {t('products')}
          </NavLink>
          <NavLink
            to="/transactions"
            className={({ isActive }) => `topbar-link${isActive ? ' active' : ''}`}
          >
            {t('transactions')}
          </NavLink>
          <NavLink
            to="/admin"
            className={({ isActive }) => `topbar-link${isActive ? ' active' : ''}`}
          >
            {t('admin') || 'Admin'}
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
