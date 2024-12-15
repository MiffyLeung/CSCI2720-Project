// frontend/src/pages/MyFavoritesPage.tsx

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Programme } from '../types/Programme';
import { useApi } from '../core/useApi'; // Centralized API request handler
import { useAuth } from '../core/AuthContext'; // Authentication handling

const MyFavoritesPage: React.FC = () => {
    const [favorites, setFavorites] = useState<Programme[]>([]); // State to hold favorite programmes
    const { isAuthenticated } = useAuth(); // Access authentication status
    const apiRequest = useApi(); // Use centralized API handler

    useEffect(() => {
        /**
         * Fetch the user's favorite programmes.
         */
        const fetchFavorites = () => {
            if (!isAuthenticated) {
                console.error('User is not authenticated');
                return;
            }

            apiRequest('/myFavorites', {}, (data: Programme[]) => {
                setFavorites(data); // Update state with fetched favorites
            }).catch((error) => {
                console.error('Error fetching favorites:', error);
            });
        };

        fetchFavorites();
    }, [isAuthenticated, apiRequest]);

    return (
        <div>
            <Navbar />
            <div className="container mt-5">
                <h1 className="mb-4">My Favorites</h1>
                {favorites.length > 0 ? (
                    <div className="row">
                        {favorites.map((programme) => (
                            <div className="col-md-4 mb-4" key={programme.event_id}>
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">{programme.title}</h5>
                                        <p className="card-text">
                                            <strong>Dateline:</strong> {programme.dateline}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="alert alert-info" role="alert">
                        You have no favorite programmes yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyFavoritesPage;
