// frontend/src/pages/HotestPage.tsx

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Programme } from '../types/Programme';
import { useApi } from '../core/useApi'; // Centralized API handler

const HotestPage: React.FC = () => {
    const [programmes, setProgrammes] = useState<Programme[]>([]);
    const apiRequest = useApi(); // Use centralized API handler

    useEffect(() => {
        /**
         * Fetch the hottest programmes sorted by ranking.
         */
        const fetchHotestProgrammes = () => {
            apiRequest('/programmes?sort=ranking_desc', {}, (data: Programme[]) => {
                setProgrammes(data); // Update state with fetched programmes
            }).catch((error) => {
                console.error('Error fetching hottest programmes:', error);
            });
        };

        fetchHotestProgrammes();
    }, [apiRequest]);

    return (
        <div>
            <Navbar />
            <div className="container mt-5">
                <h1 className="mb-4">Hottest Events</h1>
                <table className="table table-striped table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Title</th>
                            <th>Ranking</th>
                        </tr>
                    </thead>
                    <tbody>
                        {programmes.map((programme) => (
                            <tr key={programme.event_id}>
                                <td>{programme.title}</td>
                                <td>{programme.likes + programme.comments.length * 5}</td> {/* Compute ranking */}
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
