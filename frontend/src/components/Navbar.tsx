// src/components/Navbar.tsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthState } from '../utils/secure';

interface NavbarProps { }

const Navbar: React.FC<NavbarProps> = () => {
  const { getToken, cleanAuth } = useAuthState();
  const navigate = useNavigate();
  const isAuthenticated = getToken();

  const handleLogout = () => {
    cleanAuth();
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: '#fff',
      }}
    >
      <div>
        <Link
          to="/dashboard"
          style={{
            marginRight: '15px',
            textDecoration: 'none',
            color: '#fff',
            fontWeight: 'bold',
          }}
        >
          Dashboard
        </Link>
        <Link
          to="/venues"
          style={{
            marginRight: '15px',
            textDecoration: 'none',
            color: '#fff',
            fontWeight: 'bold',
          }}
        >
          Venues
        </Link>
        <Link
          to="/admin/programmes"
          style={{
            textDecoration: 'none',
            color: '#fff',
            fontWeight: 'bold',
          }}
        >
          Admin
        </Link>
      </div>
      {isAuthenticated && (
        <button
          onClick={handleLogout}
          style={{
            padding: '5px 10px',
            backgroundColor: '#dc3545',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      )}
    </nav>
  );
};

export default Navbar;
