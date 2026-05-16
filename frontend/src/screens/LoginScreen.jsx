/**
 * LoginScreen Component
 *
 * Responsibilities:
 * - Provide login and registration forms
 * - Handle authentication with backend
 * - Redirect authenticated users to dashboard
 * - Display authentication errors
 *
 * Features:
 * - Toggle between login and registration modes
 * - Form validation
 * - Loading state during API call
 * - Error display
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUiSettings } from '../context/UiSettingsContext';

const LoginScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isLoading, error, clearError, isAuthenticated } = useAuth();
  const { t } = useUiSettings();

  const [isLoginMode, setIsLoginMode] = React.useState(true);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [localError, setLocalError] = React.useState('');

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from || '/products';
      navigate(from);
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    // Validation
    if (!email || !password) {
      setLocalError('Email and password are required');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    const result = isLoginMode
      ? await login(email, password)
      : await register(email, password);

    if (!result.success) {
      setLocalError(result.error || 'Authentication failed');
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setLocalError('');
    clearError();
    setEmail('');
    setPassword('');
  };

  const displayError = localError || error;

  return (
    <section className="page-section">
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="section-kicker">{t('landingTitle') || 'MiniShop'}</h1>
          <h2>{isLoginMode ? t('login') : t('register')}</h2>

          {displayError && <div className="error-banner">{displayError}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email"> {t('Email')} </label>
              <input
                id="email"
                type="email"
                placeholder="yourEmail@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">{t('password')}</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Please wait...' : isLoginMode ? t('login') : t('register')}
            </button>
          </form>

          <div className="auth-toggle">
            <p>
              {isLoginMode
                ? t('dontHaveAccount')
                : t('alreadyHaveAccount')}
              <button
                type="button"
                className="link-button"
                onClick={toggleMode}
                disabled={isLoading}
              >
                {isLoginMode ?  t('register') : t('login')}
              </button>
            </p>
          </div>

          {isLoginMode && (
            <div className="demo-credentials">
              <p className="text-muted"> {t('DemoAdmin')} </p>
              <p className="text-small">
                {t('Email')}: <code>admin@local</code>
              </p>
              <p className="text-small">
                {t('password')}: <code>admin123</code>
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LoginScreen;
