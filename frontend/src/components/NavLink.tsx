import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavLinkProps {
  path: string;
  label: string;
}

const NavLink: React.FC<NavLinkProps> = ({ path, label }) => {
  const location = useLocation();

  const isActive = location.pathname === path;

  return (
    <Link
      to={path}
      style={{
        marginRight: '15px',
        textDecoration: isActive ? 'underline' : 'none',
        color: '#fff',
        fontWeight: 'bold',
      }}
    >
      {label}
    </Link>
  );
};

export default NavLink;
