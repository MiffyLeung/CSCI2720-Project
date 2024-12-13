// frontend/src/utils/secure.ts

// This file contains the `useAuthState` hook implementation
import { useState, useEffect, useCallback, useMemo } from 'react';
import Cookies from 'js-cookie';
import md5 from 'md5';

export const useAuthState = () => {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  // Check if the current authentication is valid
  const validateAuth = useCallback((): boolean => {
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    const storedRole = localStorage.getItem('role');
    const storedHash = Cookies.get('auth_hash');
    const computedHash = md5(`${storedUsername}${storedRole}${storedToken}`);

    if (
      token !== storedToken ||
      username !== storedUsername ||
      role !== storedRole ||
      storedHash !== computedHash
    ) {
      cleanAuth();
      return false;
    }
    return true;
  }, [token, username, role]);

  // Set new authentication data
  const setAuth = useCallback((newToken: string, newUsername: string, newRole: string) => {
    const hash = md5(`${newUsername}${newRole}${newToken}`);

    localStorage.setItem('token', newToken);
    localStorage.setItem('username', newUsername);
    localStorage.setItem('role', newRole);
    Cookies.set('auth_hash', hash, { secure: true, sameSite: 'strict' });

    setToken(newToken);
    setUsername(newUsername);
    setRole(newRole);
  }, []);

  // Clear all authentication data
  const cleanAuth = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    Cookies.remove('auth_hash');

    setToken(null);
    setUsername(null);
    setRole(null);
    alert('Login status cleared');
  }, []);

  // Initialize the authentication state
  const initializeAuth = useCallback(() => {
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    const storedRole = localStorage.getItem('role');
    const storedHash = Cookies.get('auth_hash');
    const computedHash = md5(`${storedUsername}${storedRole}${storedToken}`);

    if (
      storedToken && storedUsername && storedRole &&
      storedHash === computedHash &&
      !token && !username && !role
    ) {
      setToken(storedToken);
      setUsername(storedUsername);
      setRole(storedRole);
    }

    setAuthInitialized(true);
  }, [validateAuth, cleanAuth, token, username, role]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Derived state for authentication status
  const isAuthenticated = useMemo((): boolean => {
    return !!(authInitialized && token && username && role && validateAuth());
  }, [authInitialized, token, username, role, validateAuth]);

  // Derived state for admin status
  const isAdmin = useMemo((): boolean => {
    return isAuthenticated && role === 'admin';
  }, [isAuthenticated, role]);

  return {
    username,
    isAuthenticated,
    isAdmin,
    getToken: () => (validateAuth() ? token : null),
    setAuth,
    cleanAuth,
  };
};
