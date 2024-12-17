// frontend/src/pages/LoginPage.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../core/AuthContext';
import { useApi } from '../core/useApi';

/**
 * Login page component for user authentication.
 * Provides username and password inputs and handles login API requests.
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
     * @param e - Form submission event
     */
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null); // Reset error state

        console.log('Attempting login...');

        try {
            const data = await apiRequest('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            console.log('Login successful:', data);

            // Update authentication state and navigate to the home page
            updateAuth(data.token, data.username, data.role);
            navigate('/');
        } catch (err) {
            // Handle API errors
            console.error('Login error:', err);
            setError(err instanceof Error ? err.message : 'Login failed');
        }
    };

    return (
        <div className="mt-5 container p-5 rounded" style={{backgroundColor: 'rgb(95 127 89 / 75%)'}}>
            <div className="my-5 
            row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-body">
                            <h2 className="card-title text-center text-success mb-4">Login</h2>
                            <form onSubmit={handleLogin}>
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        id="username"
                                        className="form-control"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                {error && <div className="text-danger mb-3">{error}</div>}
                                <button type="submit" className="btn btn-success w-100">
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
