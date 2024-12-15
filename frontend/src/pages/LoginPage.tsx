// frontend/src/pages/LoginPage.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../core/AuthContext';
import { useApi } from '../core/useApi';

/**
 * Login page component for user authentication.
 */
const LoginPage: React.FC = () => {
    const [username, setUsername] = useState(''); // State for username input
    const [password, setPassword] = useState(''); // State for password input
    const [error, setError] = useState<string | null>(null); // State for error messages

    const { updateAuth } = useAuth(); // Hook for authentication state
    const apiRequest = useApi(); // Centralized API request handler
    const navigate = useNavigate(); // React Router navigation handler

    /**
     * Handles the login form submission.
     * @param e - Form event
     */
    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null); // Reset error state

        apiRequest(
            '/login',
            {
                method: 'POST',
                body: JSON.stringify({ username, password }),
            },
            (data) => {
                // Callback to handle successful login
                updateAuth(data.token, data.username, data.role);
                navigate('/recent'); // Redirect to recent programmes
            }
        ).catch((err) => {
            // Handle errors during API request
            console.error('Login error:', err);
            setError(err instanceof Error ? err.message : 'Login failed');
        });
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-body">
                            <h2 className="card-title text-center text-primary mb-4">Login</h2>
                            <form onSubmit={handleLogin}>
                                <div className="mb-3">
                                    <label className="form-label">Username</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                {error && <div className="text-danger mb-3">{error}</div>}
                                <button type="submit" className="btn btn-primary w-100">
                                    Login
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
