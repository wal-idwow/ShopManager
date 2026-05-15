/**
 * AuthContext
 *
 * Responsibilities:
 * - Persist the selected session role in localStorage.
 * - Expose a small login/logout API for user and admin entry points.
 * - Provide role flags that can be used by route guards and navigation.
 *
 * Notes:
 * - This is a lightweight client-side session foundation.
 * - Server-side authorization is still required for sensitive endpoints.
 */

import React from 'react';

const ROLE_STORAGE_KEY = 'minishop-role';

const VALID_ROLES = new Set(['guest', 'user', 'admin']);

const getInitialRole = () => {
  if (typeof window === 'undefined') {
    return 'guest';
  }

  const storedRole = window.localStorage.getItem(ROLE_STORAGE_KEY);
  return VALID_ROLES.has(storedRole) ? storedRole : 'guest';
};

const AuthContext = React.createContext(null);

export const AuthProvider = ({ children }) => {
  const [role, setRole] = React.useState(getInitialRole);

  const loginAs = React.useCallback((nextRole) => {
    const safeRole = VALID_ROLES.has(nextRole) ? nextRole : 'guest';

    setRole(safeRole);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(ROLE_STORAGE_KEY, safeRole);
    }
  }, []);

  const logout = React.useCallback(() => {
    setRole('guest');

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(ROLE_STORAGE_KEY);
    }
  }, []);

  const value = React.useMemo(
    () => ({
      role,
      isGuest: role === 'guest',
      isUser: role === 'user',
      isAdmin: role === 'admin',
      isAuthenticated: role !== 'guest',
      loginAs,
      logout,
    }),
    [loginAs, logout, role]
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