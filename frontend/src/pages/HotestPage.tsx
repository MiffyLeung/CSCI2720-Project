// frontend/src/pages/HotestPage.tsx

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Programme } from '../types/Programme';
import { useApi } from '../core/useApi'; // Centralized API handler

/**
 * A page to display the hottest programmes, sorted by ranking.
 * Data is fetched from the backend and rendered in a table format.
 */
const HotestPage: React.FC = () => {
    const [programmes, setProgrammes] = useState<Programme[]>([]); // State to hold programmes data
    const apiRequest = useApi(); // Use centralized API handler
    const [hasFetched, setHasFetched] = useState(false); // Prevent duplicate fetches

    useEffect(() => {
        /**
         * Fetches the hottest programmes sorted by ranking.
         * Ensures that the data is only fetched once.
         */
        const fetchHotestProgrammes = async () => {
            if (hasFetched) return;

            console.log('Fetching hottest programmes...');
            try {
                const data: Programme[] = await apiRequest('/programmes?sort=ranking_desc');
                console.log('Fetched programmes:', data);
                setProgrammes(data); // Update state with fetched programmes
                setHasFetched(true); // Mark as fetched
            } catch (error) {
                console.error('Error fetching hottest programmes:', error);
            }
        };

        fetchHotestProgrammes();
    }, [apiRequest, hasFetched]);

    return (
        <div>
            <Navbar />
            <div className="container mt-5">
                <h1 className="mb-4">Hottest Events</h1>
                <table className="table table-striped table-hover">
                    <thead>
                        <tr className="table-success"> {/* Apply Bootstrap success class to header row */}
                            <th>Title</th>
                            <th>Ranking</th>
                        </tr>
                    </thead>
                    <tbody>
                        {programmes.map((programme) => (
                            <tr key={programme.event_id}>
                                <td>{programme.title}</td>
                                <td>{programme.likes + (programme.comments?.length || 0) * 5}</td> {/* Compute ranking */}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {programmes.length === 0 && (
                    <div className="alert alert-info" role="alert">
                        No hottest events available at the moment.
                    </div>
                )}
            </div>
        </div>
    );
};

export default HotestPage;
