// frontend/src/components/Navbar.tsx

import React, { useState, useEffect } from 'react';
import { Container, Nav, Navbar, NavDropdown, Form, Alert } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../core/AuthContext';
import { useApi } from '../core/useApi';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';

/**
 * AppNavbar displays the navigation bar with links, user menu, and admin options.
 */
const AppNavbar: React.FC = () => {
    const { isAuthenticated, isAdmin, resetAuth, username } = useAuth();
    const apiRequest = useApi();
    const navigate = useNavigate();

    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<'success' | 'danger' | null>(null);
    const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 1200); // State for screen width

    // Update screen width state on resize
    useEffect(() => {
        const handleResize = () => setIsWideScreen(window.innerWidth > 1200);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        document.body.className = isDarkMode ? 'bg-dark text-white' : 'bg-light text-dark';
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const handleLogout = () => {
        resetAuth();
        alert('You have been logged out.');
        navigate('/login');
    };

    const toggleTheme = () => {
        setIsDarkMode((prev) => !prev);
    };

    const handleUpdateData = async () => {
        setLoading(true);
        setMessage(null);
        setMessageType(null);
        try {
            const response = await apiRequest('/updateData', { method: 'GET' });
            setMessage(response.message || 'Data updated successfully.');
            setMessageType('success');
        } catch (error: unknown) {
            setMessage(error instanceof Error ? error.message : 'An unknown error occurred.');
            setMessageType('danger');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Renders the user's profile avatar with initials.
     * @param name User's name for extracting initials.
     */
    const renderAvatar = (name: string) => {
        const initials = name ? name[0].toUpperCase() : '?';
        return (
            <div
                style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: '8px',
                }}
            >
                {initials}
            </div>
        );
    };

    return (
        <>
            <Navbar
                bg={isDarkMode ? 'dark' : 'light'}
                variant={isDarkMode ? 'dark' : 'light'}
                expand="md"
                className="px-3"
            >
                <Container fluid>
                    <div className="d-flex justify-content-between align-items-center">
                        <LinkContainer to="/">
                            <Navbar.Brand className="me-0">
                                <img src="/logo.png" alt="Logo" style={{ height: '3.5rem' }} />
                            </Navbar.Brand>
                        </LinkContainer>
                        <div className="d-flex flex-row flex-nowrap align-items-center">
                            <LinkContainer to="/recent">
                                <Nav.Link className="px-2">Recent</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/hotest">
                                <Nav.Link className="px-2">Hottest</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/map">
                                <Nav.Link className="px-2">Map</Nav.Link>
                            </LinkContainer>
                        </div>
                    </div>
                    <Navbar.Toggle aria-controls="navbarNav" />
                    <Navbar.Collapse id="navbarNav" className="justify-content-end">
                        <Nav className="d-flex flex-row flex-wrap flex-grow-1 align-items-start">
                            {isAdmin && (
                                <>
                                    {isWideScreen ? (
                                        <div className="d-flex flex-row align-items-center flex-grow-1 py-2">
                                            <LinkContainer to="/admin/programmes">
                                                <Nav.Link className="px-2">Manage Programmes</Nav.Link>
                                            </LinkContainer>
                                            <LinkContainer to="/admin/venues">
                                                <Nav.Link className="px-2">Manage Venues</Nav.Link>
                                            </LinkContainer>
                                            <LinkContainer to="/admin/accounts">
                                                <Nav.Link className="px-2">Manage Accounts</Nav.Link>
                                            </LinkContainer>
                                            <Nav.Link
                                                onClick={handleUpdateData}
                                                className="px-2"
                                            >
                                                {loading ? 'Updating...' : 'Update Data'}
                                            </Nav.Link>
                                        </div>
                                    ) : (
                                        <NavDropdown title="Admin Menu" id="adminMenu" className="p-2 me-auto">
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
                                </>
                            )}
                            <Form className="d-flex align-items-center me-3 py-3">
                                <Form.Check
                                    type="switch"
                                    id="dark-mode-switch"
                                    label="Dark Mode"
                                    checked={isDarkMode}
                                    onChange={toggleTheme}
                                    className="me-2"
                                />
                            </Form>

                            {isAuthenticated && (
                                <NavDropdown
                                    title={
                                        <div className="d-inline-flex align-items-center py-1">
                                            {renderAvatar(username || 'U')}
                                            <span className="fw-bold">{username}</span>
                                        </div>
                                    }
                                    id="userMenu"
                                    align="end"
                                >
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
                        </Nav>
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
