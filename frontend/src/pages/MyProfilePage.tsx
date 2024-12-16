// frontend/src/pages/MyProfilePage.tsx

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useApi } from '../core/useApi';
import { useAuth } from '../core/AuthContext';

/**
 * MyProfilePage allows authenticated users to view and update their profile details.
 * It fetches the user's profile information on mount and enables updates to the password.
 */
const MyProfilePage: React.FC = () => {
    const { isAuthenticated } = useAuth(); // Authentication state
    const apiRequest = useApi(); // Centralized API request handler

    const [name, setName] = useState<string>(''); // User's name
    const [password, setPassword] = useState<string>(''); // User's password
    const [message, setMessage] = useState<string | null>(null); // Feedback message for updates
    const [hasFetched, setHasFetched] = useState<boolean>(false); // Prevent multiple fetches

    useEffect(() => {
        /**
         * Fetches the user's profile details from the server.
         * Ensures the data is fetched only once and the user is authenticated.
         */
        const fetchProfile = async () => {
            if (!isAuthenticated || hasFetched) return;

            console.log('Fetching profile data...');
            try {
                const data: { name: string; password: string } = await apiRequest('/myAccount');
                setName(data.name || ''); // Set fetched name
                setPassword(data.password || ''); // Set fetched password
                setHasFetched(true); // Mark as fetched
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, [isAuthenticated, apiRequest, hasFetched]);

    /**
     * Handles form submission to update the user's profile.
     * Sends the updated name and password to the server.
     * @param e The form submission event.
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        try {
            await apiRequest('/password', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, password }),
            });
            setMessage('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage('Failed to update profile.');
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container mt-5">
                <h1 className="mb-4">My Profile</h1>
                <form onSubmit={handleSubmit} className="needs-validation">
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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
                            name="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {message && (
                        <div
                            className={`alert ${
                                message.includes('success') ? 'alert-success' : 'alert-danger'
                            }`}
                            role="alert"
                        >
                            {message}
                        </div>
                    )}
                    <button type="submit" className="btn btn-success">
                        Update
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MyProfilePage;
