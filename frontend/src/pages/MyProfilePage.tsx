// FILEPATH: frontend/src/pages/MyProfilePage.tsx

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useApi } from '../core/useApi';
import { useAuth } from '../core/AuthContext';
import ToastStack, { ToastMessage } from '../components/ToastStack';
import './MyProfilePage.css';

/**
 * MyProfilePage allows authenticated users to view and update their profile details.
 */
const MyProfilePage: React.FC = () => {
    const { isAuthenticated, resetAuth } = useAuth();
    const apiRequest = useApi();
    const [name, setName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [toastMessages, setToastMessages] = useState<ToastMessage[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [hasFetched, setHasFetched] = useState<boolean>(false);

    useEffect(() => {
        if (!isAuthenticated || hasFetched) return;

        apiRequest(
            '/myAccount',
            { method: 'GET' },
            undefined,
            (data) => {
                setName(data.name || '');
                setPassword(data.password || '');
                setHasFetched(true);
            },
            (error) => addToast('Failed to fetch profile data.')
        );
    }, [isAuthenticated, apiRequest, hasFetched]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        apiRequest(
            '/myAccount',
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, password }),
            },
            undefined,
            () => setShowModal(true),
            () => addToast('Failed to update profile.')
        );
    };

    const addToast = (text: string) => {
        setToastMessages((prev) => [...prev, { id: Date.now(), text }]);
    };

    const removeToast = (id: number) => {
        setToastMessages((prev) => prev.filter((msg) => msg.id !== id));
    };

    const handleModalConfirm = () => {
        resetAuth();
        window.location.href = '/login';
    };

    return (
        <><Navbar />

            <div className="profile-container">
                <div className="card shadow">
                    <div className="card-body">
                        <h2 className="card-title text-center text-success mb-4">Edit profile</h2>
                        <form onSubmit={handleSubmit} className="profile-form">
                            <div className="mb-3">
                                <label className="form-label" htmlFor="name">
                                    New Username
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
                            <div className="form-group">
                                <label htmlFor="password" className="form-label">
                                    New Password
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
                            <button type="submit" className="btn btn-success">
                                Update
                            </button>
                        </form>
                    </div>

                    {/* Toast Messages */}
                    <ToastStack messages={toastMessages} onRemove={removeToast} />

                    {/* Success Modal */}
                    {showModal && (
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <h2>Profile Updated Successfully</h2>
                                <p>Please log in again with your new credentials.</p>
                                <button onClick={handleModalConfirm}>OK</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default MyProfilePage;
