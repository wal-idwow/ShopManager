/**
 * AuthContext
 *
 * Responsibilities:
 * - Manage JWT token-based authentication
 * - Persist JWT token in localStorage
 * - Decode JWT to extract user info (userId, role)
 * - Provide login/register/logout functions
 * - Protect routes based on authentication and role
 *
 * Features:
 * - Automatic token retrieval from localStorage on app load
 * - JWT decoding without external libraries (using base64)
 * - Role-based authorization (user vs admin)
 * - Server-side token verification
 */

import React from 'react';

const TOKEN_STORAGE_KEY = 'minishop-token';

/**
 * Decode JWT token (without verification - verification happens on backend)
 * JWT format: header.payload.signature
 */
const decodeToken = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }

    // Decode the payload (second part)
    const payload = parts[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (err) {
    console.error('Error decoding token:', err);
    return null;
  }
};

/**
 * Check if token is expired
 */
const isTokenExpired = (decoded) => {
  if (!decoded || !decoded.exp) {
    return true;
  }
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
};

/**
 * Get initial auth state from localStorage
 */
const getInitialAuthState = () => {
  if (typeof window === 'undefined') {
    return { token: null, userId: null, role: null, isAuthenticated: false };
  }

  const token = window.localStorage.getItem(TOKEN_STORAGE_KEY);

  if (!token) {
    return { token: null, userId: null, role: null, isAuthenticated: false };
  }

  const decoded = decodeToken(token);

  // If token is expired or invalid, clear it
  if (!decoded || isTokenExpired(decoded)) {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    return { token: null, userId: null, role: null, isAuthenticated: false };
  }

  return {
    token,
    userId: decoded.userId,
    role: decoded.role,
    isAuthenticated: true,
  };
};

const AuthContext = React.createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = React.useState(getInitialAuthState);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const login = React.useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || 'Login failed');
      }

      const { token } = data.data;
      const decoded = decodeToken(token);

      if (!decoded) {
        throw new Error('Invalid token received from server');
      }

      // Store token
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
      }

      // Update state
      setAuthState({
        token,
        userId: decoded.userId,
        role: decoded.role,
        isAuthenticated: true,
      });

      return { success: true, data: data.data };
    } catch (err) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = React.useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || 'Registration failed');
      }

      const { token } = data.data;
      const decoded = decodeToken(token);

      if (!decoded) {
        throw new Error('Invalid token received from server');
      }

      // Store token
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
      }

      // Update state
      setAuthState({
        token,
        userId: decoded.userId,
        role: decoded.role,
        isAuthenticated: true,
      });

      return { success: true, data: data.data };
    } catch (err) {
      const errorMessage = err.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = React.useCallback(() => {
    setAuthState({
      token: null,
      userId: null,
      role: null,
      isAuthenticated: false,
    });

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    }

    setError(null);
  }, []);

  const value = React.useMemo(
    () => ({
      ...authState,
      login,
      register,
      logout,
      isLoading,
      error,
      isUser: authState.role === 'user',
      isAdmin: authState.role === 'admin',
      clearError: () => setError(null),
    }),
    [authState, login, register, logout, isLoading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};