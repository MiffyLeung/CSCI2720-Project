// frontend/src/pages/MyProfilePage.tsx

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useApi } from '../core/useApi'; // Centralized API handler
import { useAuth } from '../core/AuthContext'; // Authentication handler

const MyProfilePage: React.FC = () => {
    const { isAuthenticated } = useAuth(); // Check authentication state
    const apiRequest = useApi(); // Use centralized API handler
    const [name, setName] = useState(''); // State to hold user name
    const [email, setEmail] = useState(''); // State to hold user email
    const [message, setMessage] = useState<string | null>(null); // Feedback message for user

    useEffect(() => {
        /**
         * Fetch user profile data from the server.
         */
        const fetchProfile = () => {
            if (!isAuthenticated) {
                console.error('User is not authenticated');
                return;
            }

            apiRequest('/myAccount', {}, (data: { name: string; email: string }) => {
                setName(data.name);
                setEmail(data.email);
            }).catch((error) => {
                console.error('Error fetching profile:', error);
            });
        };

        fetchProfile();
    }, [isAuthenticated, apiRequest]);

    /**
     * Handle profile update submission.
     * @param e Form submission event.
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        apiRequest(
            '/profile',
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email }),
            },
            () => {
                setMessage('Profile updated successfully!');
            }
        ).catch((error) => {
            console.error('Error updating profile:', error);
            setMessage('Failed to update profile.');
        });
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
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                    <button type="submit" className="btn btn-primary">
                        Update
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MyProfilePage;
