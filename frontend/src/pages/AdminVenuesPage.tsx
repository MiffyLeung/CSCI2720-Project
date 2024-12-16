// frontend/src/pages/AdminVenuesPage.tsx

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Venue } from '../types/Venue';
import VenueList from '../components/VenueList';
import VenueForm from '../components/VenueForm';
import VenueFilter from '../components/VenueFilter';
import { useApi } from '../core/useApi'; // Centralized API request handler
import { useAuth } from '../core/AuthContext'; // Authentication handling

/**
 * AdminVenuesPage provides functionality to manage venues.
 * It allows users to view, filter, add, and edit venues.
 */
const AdminVenuesPage: React.FC = () => {
    const [venues, setVenues] = useState<Venue[]>([]); // State to store all venues
    const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]); // State to store filtered venues
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state for adding/editing venues
    const [editingVenue, setEditingVenue] = useState<Venue | undefined>(undefined); // Venue being edited
    const apiRequest = useApi(); // Centralized API handler
    const { isAuthenticated } = useAuth(); // Check user authentication
    const [hasFetched, setHasFetched] = useState(false); // Prevent duplicate fetches

    useEffect(() => {
        /**
         * Fetch venues from the API.
         * Ensures the user is authenticated and data is only fetched once.
         */
        const fetchVenues = async () => {
            if (!isAuthenticated || hasFetched) return;

            console.log('Fetching venues...');
            try {
                const data: Venue[] = await apiRequest('/venues');
                console.log('Fetched venues:', data);
                setVenues(data); // Update state with fetched venues
                setFilteredVenues(data); // Initialize filtered venues
                setHasFetched(true); // Mark data as fetched
            } catch (error) {
                console.error('Error fetching venues:', error);
            }
        };

        fetchVenues();
    }, [isAuthenticated, apiRequest, hasFetched]);

    /**
     * Open the modal for adding or editing a venue.
     * @param venue Optional venue to edit; if not provided, the modal is used for adding.
     */
    const openModal = (venue?: Venue) => {
        setEditingVenue(venue);
        setIsModalOpen(true);
    };

    /**
     * Close the modal and reset the editing venue state.
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

        try {
            const savedVenue: Venue = await apiRequest(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
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
        } catch (error) {
            console.error('Error saving venue:', error);
            alert('Failed to save venue.');
        }
    };

    /**
     * Handle filtering venues based on the user's query.
     * @param query The search query to filter venues.
     */
    const handleFilterChange = async (query: string) => {
        if (!query) {
            setFilteredVenues(venues); // Reset filter when query is empty
            return;
        }

        try {
            const data: Venue[] = await apiRequest(`/venues?search=${query}`);
            setFilteredVenues(data); // Update filtered venues based on query
        } catch (error) {
            console.error('Error filtering venues:', error);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container mt-5">
                <h1 className="mb-4">Manage Venues</h1>
                <button className="btn btn-success mb-4" onClick={() => openModal()}>
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
