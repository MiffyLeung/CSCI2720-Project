// src/pages/AdminHome.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminHome: React.FC = () => {
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Manage Locations', path: '/admin/locations' },
    { label: 'Manage Users', path: '/admin/users' },
    { label: 'System Settings', path: '/admin/settings' }, // Optional future section
  ];

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome to the admin dashboard! Use the menu below to manage the system.</p>
      <ul style={{ listStyleType: 'none', padding: '0' }}>
        {menuItems.map((item) => (
          <li
            key={item.path}
            style={{
              margin: '15px 0',
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
            onClick={() => navigate(item.path)}
          >
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{item.label}</span>
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{'>'}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminHome;
