// src/components/Navbar.tsx

import React, { useState, useEffect } from 'react';
import { Container, Nav, Navbar, NavDropdown, Button, Form } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuthState } from '../utils/secure';
import { useNavigate } from 'react-router-dom';

const AppNavbar: React.FC = () => {
  const { cleanAuth, isAdmin } = useAuthState();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Load initial theme from localStorage or default to false
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    // Apply theme to document body
    document.body.className = isDarkMode ? 'bg-dark text-white' : 'bg-light text-dark';
    // Save the current theme to localStorage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleLogout = () => {
    cleanAuth();
    alert(`Bye ~`);
    navigate('/login'); // Redirect to login page after logout
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <Navbar
      bg={isDarkMode ? 'dark' : 'light'}
      variant={isDarkMode ? 'dark' : 'light'}
      expand="lg"
    >
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>My App</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="me-auto">
            <LinkContainer to="/recent">
              <Nav.Link>Recent</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/hotest">
              <Nav.Link>Hottest</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/map">
              <Nav.Link>Map</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/myFavorites">
              <Nav.Link>My Favourites</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/myProfile">
              <Nav.Link>My Profile</Nav.Link>
            </LinkContainer>
            {isAdmin && (
              <NavDropdown title="Admin Menu" id="adminMenu">
                <LinkContainer to="/admin/programmes">
                  <NavDropdown.Item>Manage Programmes</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/venues">
                  <NavDropdown.Item>Manage Venues</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/accounts">
                  <NavDropdown.Item>Manage Accounts</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
            )}
          </Nav>
          <Form className="d-flex align-items-center">
            <Form.Check
              type="switch"
              id="dark-mode-switch"
              label="Dark Mode"
              checked={isDarkMode}
              onChange={toggleTheme}
              className="me-3"
            />
            <Button variant="danger" onClick={handleLogout}>
              Logout
            </Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
