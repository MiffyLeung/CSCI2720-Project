// frontend/src/pages/AdminProgrammesPage.tsx

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Programme } from '../types/Programme';
import ProgrammeList from '../components/ProgrammeList';
import ProgrammeForm from '../components/ProgrammeForm';
import ProgrammeFilter from '../components/ProgrammeFilter';
import { useApi } from '../core/useApi'; // Reusable API request
import { useAuth } from '../core/AuthContext'; // Authentication handling

const AdminProgrammesPage: React.FC = () => {
    const [programmes, setProgrammes] = useState<Programme[]>([]);
    const [filteredProgrammes, setFilteredProgrammes] = useState<Programme[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProgramme, setEditingProgramme] = useState<Programme | undefined>(undefined);
    const apiRequest = useApi(); // Centralized API request handler
    const { isAuthenticated } = useAuth(); // Check authentication status

    useEffect(() => {
        /**
         * Fetches all programmes.
         * Calls the API and updates the state with the fetched data.
         */
        const fetchProgrammes = async () => {
            if (!isAuthenticated) {
                console.error('User is not authenticated');
                return;
            }

            try {
                await apiRequest('/programmes', {}, (data: Programme[]) => {
                    setProgrammes(data);
                    setFilteredProgrammes(data);
                });
            } catch (error) {
                console.error('Error fetching programmes:', error);
            }
        };

        fetchProgrammes();
    }, [isAuthenticated, apiRequest]);

    /**
     * Opens the modal for adding or editing a programme.
     * @param programme Programme to edit (optional).
     */
    const openModal = (programme?: Programme) => {
        setEditingProgramme(programme);
        setIsModalOpen(true);
    };

    /**
     * Closes the modal and resets editing state.
     */
    const closeModal = () => {
        setEditingProgramme(undefined);
        setIsModalOpen(false);
    };

    /**
     * Saves a new programme or updates an existing one.
     * @param data Programme data to save.
     */
    const handleSave = async (data: Programme) => {
        const method = editingProgramme ? 'PUT' : 'POST';
        const endpoint = editingProgramme ? `/programmes/${editingProgramme.event_id}` : '/programmes';

        try {
            await apiRequest(
                endpoint,
                {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                },
                (savedProgramme: Programme) => {
                    alert(editingProgramme ? 'Programme updated successfully!' : 'Programme created successfully!');
                    closeModal();

                    setProgrammes((prevProgrammes) =>
                        editingProgramme
                            ? prevProgrammes.map((p) => (p.event_id === editingProgramme.event_id ? savedProgramme : p))
                            : [...prevProgrammes, savedProgramme]
                    );
                    setFilteredProgrammes((prevProgrammes) =>
                        editingProgramme
                            ? prevProgrammes.map((p) => (p.event_id === editingProgramme.event_id ? savedProgramme : p))
                            : [...prevProgrammes, savedProgramme]
                    );
                }
            );
        } catch (error) {
            console.error('Error saving programme:', error);
            alert('Failed to save programme.');
        }
    };

    /**
     * Filters the programme list based on a query.
     * @param query Search query to filter programmes.
     */
    const handleFilterChange = async (query: string) => {
        if (!query) {
            setFilteredProgrammes(programmes);
            return;
        }

        try {
            await apiRequest(`/programmes?search=${query}`, {}, (data: Programme[]) => {
                setFilteredProgrammes(data);
            });
        } catch (error) {
            console.error('Error filtering programmes:', error);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container mt-5">
                <h1 className="mb-4">Manage Programmes</h1>
                <button className="btn btn-primary mb-4" onClick={() => openModal()}>
                    Add Programme
                </button>
                <div className="mb-4">
                    <ProgrammeFilter onFilterChange={handleFilterChange} />
                </div>
                <ProgrammeList programmes={filteredProgrammes} onEdit={openModal} />
                {isModalOpen && (
                    <div
                        className="modal fade show d-block"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                    >
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">
                                        {editingProgramme ? 'Edit Programme' : 'Add Programme'}
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        aria-label="Close"
                                        onClick={closeModal}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <ProgrammeForm
                                        initialData={editingProgramme}
                                        onSave={handleSave}
                                        onCancel={closeModal}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminProgrammesPage;
