// frontend/src/pages/AdminVenuesPage.tsx

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Venue } from '../types/Venue';
import VenueList from '../components/VenueList';
import VenueForm from '../components/VenueForm';
import VenueFilter from '../components/VenueFilter';
import { useApi } from '../core/useApi'; // Centralized API request handler
import { useAuth } from '../core/AuthContext'; // Authentication handling

const AdminVenuesPage: React.FC = () => {
    const [venues, setVenues] = useState<Venue[]>([]);
    const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVenue, setEditingVenue] = useState<Venue | undefined>(undefined);
    const apiRequest = useApi(); // Use centralized API handler
    const { isAuthenticated } = useAuth(); // Check authentication state

    useEffect(() => {
        /**
         * Fetch venues from the API.
         * Ensures the user is authenticated before making the request.
         */
        const fetchVenues = async () => {
            if (!isAuthenticated) {
                console.error('User is not authenticated');
                return;
            }

            apiRequest('/venues', {}, (data: Venue[]) => {
                setVenues(data); // Update state with fetched venues
                setFilteredVenues(data); // Initialize filtered venues
            }).catch((error) => console.error('Error fetching venues:', error));
        };

        fetchVenues();
    }, [isAuthenticated, apiRequest]);

    /**
     * Open the modal for adding or editing a venue.
     * @param venue Optional venue to edit; if not provided, the modal is used for adding.
     */
    const openModal = (venue?: Venue) => {
        setEditingVenue(venue);
        setIsModalOpen(true);
    };

    /**
     * Close the modal.
     */
    const closeModal = () => {
        setEditingVenue(undefined);
        setIsModalOpen(false);
    };

    /**
     * Handle saving a venue (either adding or editing).
     * @param data The venue data to save.
     */
    const handleSave = async (data: Venue) => {
        const method = editingVenue ? 'PUT' : 'POST';
        const endpoint = editingVenue ? `/venues/${editingVenue.id}` : '/venues';

        apiRequest(
            endpoint,
            {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            },
            (savedVenue: Venue) => {
                alert(editingVenue ? 'Venue updated successfully!' : 'Venue created successfully!');
                closeModal();

                setVenues((prevVenues) =>
                    editingVenue
                        ? prevVenues.map((v) => (v.id === editingVenue.id ? savedVenue : v))
                        : [...prevVenues, savedVenue]
                );
                setFilteredVenues((prevVenues) =>
                    editingVenue
                        ? prevVenues.map((v) => (v.id === editingVenue.id ? savedVenue : v))
                        : [...prevVenues, savedVenue]
                );
            }
        ).catch((error) => {
            console.error('Error saving venue:', error);
            alert('Failed to save venue.');
        });
    };

    /**
     * Handle filtering venues based on the user's query.
     * @param query The search query to filter venues.
     */
    const handleFilterChange = (query: string) => {
        if (!query) {
            setFilteredVenues(venues); // Reset filter when query is empty
            return;
        }

        apiRequest(`/venues?search=${query}`, {}, (data: Venue[]) => {
            setFilteredVenues(data); // Update filtered venues based on query
        }).catch((error) => console.error('Error filtering venues:', error));
    };

    return (
        <div>
            <Navbar />
            <div className="container mt-5">
                <h1 className="mb-4">Manage Venues</h1>
                <button className="btn btn-primary mb-4" onClick={() => openModal()}>
                    Add Venue
                </button>
                <div className="mb-4">
                    <VenueFilter onFilterChange={handleFilterChange} />
                </div>
                <VenueList venues={filteredVenues} onEdit={openModal} />
                {isModalOpen && (
                    <div
                        className="modal fade show d-block"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                    >
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">
                                        {editingVenue ? 'Edit Venue' : 'Add Venue'}
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        aria-label="Close"
                                        onClick={closeModal}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <VenueForm
                                        initialData={editingVenue}
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

export default AdminVenuesPage;
