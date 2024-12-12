// frontend/src/utils/secure.ts

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import md5 from 'md5';

export const useAuthState = () => {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  const validateAuth = (): boolean => {
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    const storedRole = localStorage.getItem('role');
    const storedHash = Cookies.get('auth_hash');
    const computedHash = md5(`${storedUsername}${storedRole}${storedToken}`);

    const isConsistent =
      token === storedToken &&
      username === storedUsername &&
      role === storedRole &&
      storedHash === computedHash;

    if (!isConsistent) {
      cleanAuth(); // Clear all data if inconsistent
      return false;
    }

    return true;
  };

  const setAuth = (newToken: string, newUsername: string, newRole: string) => {
    const hash = md5(`${newUsername}${newRole}${newToken}`);

    // Update localStorage and cookies
    localStorage.setItem('token', newToken);
    localStorage.setItem('username', newUsername);
    localStorage.setItem('role', newRole);
    Cookies.set('auth_hash', hash, { secure: true, sameSite: 'strict' });

    // Update React state immediately
    setToken(newToken);
    setUsername(newUsername);
    setRole(newRole);
  };

  const cleanAuth = () => {
    // Clear localStorage and cookies
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    Cookies.remove('auth_hash');

    // Clear React state immediately
    setToken(null);
    setUsername(null);
    setRole(null);
  };

  const initializeAuth = () => {
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    const storedRole = localStorage.getItem('role');
    const storedHash = Cookies.get('auth_hash');
    const computedHash = md5(`${storedUsername}${storedRole}${storedToken}`);

    if (
      storedToken &&
      storedUsername &&
      storedRole &&
      storedHash === computedHash &&
      token === null &&
      username === null &&
      role === null
    ) {
      // Only initialize React state if all are null and data is valid
      setToken(storedToken);
      setUsername(storedUsername);
      setRole(storedRole);
    } else if (!validateAuth()) {
      cleanAuth();
    }

    setAuthInitialized(true); // Mark as initialized
  };

  useEffect(() => {
    initializeAuth(); // Run initialization on mount
  }, []);

  return {
    token,
    username,
    role,
    authInitialized,
    isAuthenticated: () => {
      if (!authInitialized || token === null || username === null || role === null) {
        return false;
      }
      return validateAuth();
    },
    isAdmin: () => {
      return validateAuth() && role === 'admin';
    },
    getToken: () => {
      return validateAuth() ? token : null;
    },
    setAuth,
    cleanAuth,
  };
};
