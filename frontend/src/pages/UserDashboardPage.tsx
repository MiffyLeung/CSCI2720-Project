// frontend/src/pages/UserDashboardPage.tsx

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ProgrammeList from '../components/ProgrammeList';
import ProgrammeInfo from '../components/ProgrammeInfo';
import { Programme } from '../types/Programme';
import { useApi } from '../core/useApi'; // Centralized API request handler
import { useAuth } from '../core/AuthContext'; // Authentication handler

/**
 * The UserDashboardPage displays a list of programmes available to the user.
 * Users can view detailed information about a programme in a modal.
 */
const UserDashboardPage: React.FC = () => {
    const [programmes, setProgrammes] = useState<Programme[]>([]); // State to hold programmes
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
    const [selectedProgramme, setSelectedProgramme] = useState<Programme | null>(null); // Selected programme
    const apiRequest = useApi(); // Use centralized API handler
    const { isAuthenticated } = useAuth(); // Check authentication status
    const [hasFetched, setHasFetched] = useState(false); // Prevent duplicate fetches

    useEffect(() => {
        /**
         * Fetch programmes from the API.
         * Ensures data is fetched only once and the user is authenticated.
         */
        const fetchProgrammes = async () => {
            if (!isAuthenticated || hasFetched) return;

            console.log('Fetching programmes...');
            try {
                const data: Programme[] = await apiRequest('/programmes');
                console.log('Fetched programmes:', data);
                setProgrammes(data); // Update state with fetched programmes
                setHasFetched(true); // Mark data as fetched
            } catch (error) {
                console.error('Error fetching programmes:', error);
            }
        };

        fetchProgrammes();
    }, [isAuthenticated, apiRequest, hasFetched]);

    /**
     * Open modal with selected programme.
     * @param programme The programme to view details for.
     */
    const openModal = (programme: Programme) => {
        setSelectedProgramme(programme);
        setIsModalOpen(true);
    };

    /**
     * Close the modal and reset the selected programme state.
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
