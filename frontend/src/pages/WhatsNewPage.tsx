// frontend/src/pages/WhatsNewPage.tsx

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Programme } from '../types/Programme';
import { useApi } from '../core/useApi'; // Centralized API handler
import { useAuth } from '../core/AuthContext'; // Authentication handler

const WhatsNewPage: React.FC = () => {
    const [programmes, setProgrammes] = useState<Programme[]>([]); // State to hold programmes
    const apiRequest = useApi(); // Use centralized API handler
    const { isAuthenticated } = useAuth(); // Check authentication state

    useEffect(() => {
        /**
         * Fetch the latest programmes from the API.
         */
        const fetchProgrammes = () => {
            if (!isAuthenticated) {
                console.error('User is not authenticated');
                return;
            }

            apiRequest('/programmes?sort=releaseDate_desc', {}, (data: Programme[]) => {
                setProgrammes(data); // Update state with fetched programmes
            }).catch((error) => {
                console.error('Error fetching programmes:', error);
            });
        };

        fetchProgrammes();
    }, [isAuthenticated, apiRequest]);

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
