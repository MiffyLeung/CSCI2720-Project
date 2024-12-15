// frontend/src/pages/WhatsNewPage.tsx

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Programme } from '../types/Programme';
import { useApi } from '../core/useApi'; // Centralized API handler
import { useAuth } from '../core/AuthContext'; // Authentication handler

/**
 * A page to display the latest programmes sorted by release date.
 * Fetches programmes from the backend and renders them in a grid layout.
 */
const WhatsNewPage: React.FC = () => {
    const [programmes, setProgrammes] = useState<Programme[]>([]); // State to hold programmes
    const apiRequest = useApi(); // Use centralized API handler
    const { isAuthenticated } = useAuth(); // Check authentication state
    const [hasFetched, setHasFetched] = useState(false); // Prevent multiple fetches

    useEffect(() => {
        /**
         * Fetch the latest programmes from the API.
         * Only executes if the user is authenticated and data has not been fetched yet.
         */
        const fetchProgrammes = async () => {
            if (!isAuthenticated || hasFetched) return;
            setHasFetched(true); // Mark as fetched

            console.log('Fetching latest programmes...');
            try {
                const data: Programme[] = await apiRequest('/programmes?sort=releaseDate_desc');
                console.log('Fetched programmes:', data);
                setProgrammes(data); // Update state with fetched programmes
            } catch (error) {
                console.error('Error fetching programmes:', error);
            }
        };

        if (!hasFetched) fetchProgrammes();
    }, [isAuthenticated, apiRequest, hasFetched]);

    return (
        <div>
            <Navbar />
            <div className="container mt-5">
                <h1 className="mb-4">What’s New</h1>
                <div className="row">
                    {programmes.length > 0 ? (
                        programmes.map((programme) => (
                            <div className="col-md-4 mb-4" key={programme.event_id}>
                                <div className="card h-100">
                                    <div className="card-body">
                                        <h5 className="card-title">{programme.title}</h5>
                                        <p className="card-text">{programme.description}</p>
                                        <p className="text-muted">
                                            <strong>Release Date:</strong> {programme.dateline}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="alert alert-info" role="alert">
                            No new programmes available at the moment.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WhatsNewPage;
