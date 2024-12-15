// frontend/src/pages/VenueDetailsPage.tsx

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Venue } from '../types/Venue';
import { useApi } from '../core/useApi'; // Centralized API handler
import { useAuth } from '../core/AuthContext'; // Authentication handler

const VenueDetailsPage: React.FC = () => {
    const [venue, setVenue] = useState<Venue | null>(null); // State to hold venue details
    const apiRequest = useApi(); // Use centralized API handler
    const { isAuthenticated } = useAuth(); // Check authentication state

    useEffect(() => {
        /**
         * Fetch venue details from the API.
         */
        const fetchVenue = () => {
            if (!isAuthenticated) {
                console.error('User is not authenticated');
                return;
            }

            const id = window.location.pathname.split('/').pop();
            if (!id) {
                console.error('Venue ID not found in URL');
                return;
            }

            apiRequest(`/venue/${id}`, {}, (data: Venue) => {
                setVenue(data); // Update state with fetched venue details
            }).catch((error) => {
                console.error('Error fetching venue:', error);
            });
        };

        fetchVenue();
    }, [isAuthenticated, apiRequest]);

    if (!venue) {
        return (
            <div>
                <Navbar />
                <div className="container mt-5">
                    <div className="alert alert-info" role="alert">
                        Loading venue details...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="container mt-5">
                <h1 className="mb-4">{venue.name}</h1>
                <div className="card">
                    <div className="card-body">
                        <p className="card-text">
                            <strong>Latitude:</strong> {venue.latitude}
                        </p>
                        <p className="card-text">
                            <strong>Longitude:</strong> {venue.longitude}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VenueDetailsPage;
