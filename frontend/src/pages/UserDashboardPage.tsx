// frontend/src/pages/UserDashboardPage.tsx

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ProgrammeList from '../components/ProgrammeList';
import ProgrammeInfo from '../components/ProgrammeInfo';
import { Programme } from '../types/Programme';
import { useApi } from '../core/useApi'; // Centralized API request handler
import { useAuth } from '../core/AuthContext'; // Authentication handler

const UserDashboardPage: React.FC = () => {
    const [programmes, setProgrammes] = useState<Programme[]>([]); // State to hold programmes
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
    const [selectedProgramme, setSelectedProgramme] = useState<Programme | null>(null); // Selected programme
    const apiRequest = useApi(); // Use centralized API handler
    const { isAuthenticated } = useAuth(); // Check authentication status

    useEffect(() => {
        /**
         * Fetch programmes from the API.
         */
        const fetchProgrammes = () => {
            if (!isAuthenticated) {
                console.error('User is not authenticated');
                return;
            }

            apiRequest('/programmes', {}, (data: Programme[]) => {
                setProgrammes(data); // Update state with fetched programmes
            }).catch((error) => {
                console.error('Error fetching programmes:', error);
            });
        };

        fetchProgrammes();
    }, [isAuthenticated, apiRequest]);

    /**
     * Open modal with selected programme.
     * @param programme The programme to view details for.
     */
    const openModal = (programme: Programme) => {
        setSelectedProgramme(programme);
        setIsModalOpen(true);
    };

    /**
     * Close the modal.
     */
    const closeModal = () => {
        setSelectedProgramme(null);
        setIsModalOpen(false);
    };

    return (
        <div>
            <Navbar />
            <div className="container mt-5">
                <h1 className="mb-4">User Dashboard</h1>
                <ProgrammeList programmes={programmes} onEdit={openModal} />
                {isModalOpen && selectedProgramme && (
                    <div
                        className="modal fade show d-block"
                        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                    >
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Programme Details</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={closeModal}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <ProgrammeInfo programme={selectedProgramme} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDashboardPage;
