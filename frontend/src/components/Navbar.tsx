// frontend/src/components/Navbar.tsx

import React, { useState, useEffect } from 'react';
import { Container, Nav, Navbar, NavDropdown, Form, Alert } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../core/AuthContext';
import { useApi } from '../core/useApi';
import { useNavigate } from 'react-router-dom';

const AppNavbar: React.FC = () => {
    const { isAuthenticated, isAdmin, resetAuth, username } = useAuth();
    const apiRequest = useApi();
    const navigate = useNavigate();

    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Load initial theme from localStorage or default to false
        return localStorage.getItem('theme') === 'dark';
    });
    const [loading, setLoading] = useState(false); // Loading state for updating data
    const [message, setMessage] = useState<string | null>(null); // Feedback message
    const [messageType, setMessageType] = useState<'success' | 'danger' | null>(null); // Message type

    useEffect(() => {
        // Apply theme to document body
        document.body.className = isDarkMode ? 'bg-dark text-white' : 'bg-light text-dark';
        // Save the current theme to localStorage
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const handleLogout = () => {
        resetAuth();
        alert('You have been logged out.');
        navigate('/login'); // Redirect to login page after logout
    };

    const toggleTheme = () => {
        setIsDarkMode((prev) => !prev);
    };

    /**
     * Sends a GET request to update the database via backend API and handles feedback.
     */
    const handleUpdateData = async () => {
        setLoading(true);
        setMessage(null);
        setMessageType(null);
        try {
            const response = await apiRequest('/admin/update-data', { method: 'GET' });
            setMessage(response.message || 'Data updated successfully.');
            setMessageType('success');
        } catch (error: unknown) {
            if (error instanceof Error) {
                setMessage(error.message || 'An unknown error occurred.');
            } else {
                setMessage('An unknown error occurred.');
            }
            setMessageType('danger');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
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
                        </Nav>

                        <Nav className="ms-auto">
                            {isAuthenticated && (
                                <NavDropdown title={username || 'User'} id="userMenu" align="end">
                                    <LinkContainer to="/myProfile">
                                        <NavDropdown.Item>My Profile</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/myFavorites">
                                        <NavDropdown.Item>My Favourites</NavDropdown.Item>
                                    </LinkContainer>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={handleLogout}>
                                        Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                            )}

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
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={handleUpdateData}>
                                        {loading ? 'Updating...' : 'Update Data'}
                                    </NavDropdown.Item>
                                </NavDropdown>
                            )}
                        </Nav>

                        <Form className="d-flex align-items-center ms-3">
                            <Form.Check
                                type="switch"
                                id="dark-mode-switch"
                                label="Dark Mode"
                                checked={isDarkMode}
                                onChange={toggleTheme}
                                className="me-3"
                            />
                        </Form>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {message && (
                <Container className="mt-3">
                    <Alert
                        variant={messageType || 'info'}
                        onClose={() => setMessage(null)}
                        dismissible
                    >
                        {message}
                    </Alert>
                </Container>
            )}
        </>
    );
};

export default AppNavbar;
