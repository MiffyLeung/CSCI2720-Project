// frontend/src/pages/VenueDetailsPage.tsx

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Venue } from '../types/Venue';
import { useApi } from '../core/useApi'; // Centralized API handler
import { useAuth } from '../core/AuthContext'; // Authentication handler

/**
 * A page that displays the details of a specific venue.
 * Fetches the venue details based on the ID in the URL.
 */
const VenueDetailsPage: React.FC = () => {
    const [venue, setVenue] = useState<Venue | null>(null); // State to hold venue details
    const apiRequest = useApi(); // Use centralized API handler
    const { isAuthenticated } = useAuth(); // Check authentication state
    const [hasFetched, setHasFetched] = useState(false); // Prevent duplicate fetches

    useEffect(() => {
        /**
         * Fetch venue details from the API.
         * Ensures the user is authenticated and the data is fetched only once.
         */
        const fetchVenue = async () => {
            if (!isAuthenticated || hasFetched) return;

            const id = window.location.pathname.split('/').pop();
            if (!id) {
                console.error('Venue ID not found in URL');
                return;
            }

            console.log('Fetching venue details...');
            try {
                const data: Venue = await apiRequest(`/venue/${id}`);
                console.log('Fetched venue:', data);
                setVenue(data); // Update state with fetched venue details
                setHasFetched(true); // Mark as fetched
            } catch (error) {
                console.error('Error fetching venue:', error);
            }
        };

        fetchVenue();
    }, [isAuthenticated, apiRequest, hasFetched]);

    if (!venue) {
        return (
            <div>
                <Navbar />
                <div className="container p-5 rounded" style={{backgroundColor: 'rgb(95 127 89 / 75%)'}}>
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
            <div className="container p-5 rounded" style={{backgroundColor: 'rgb(95 127 89 / 75%)'}}>
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
