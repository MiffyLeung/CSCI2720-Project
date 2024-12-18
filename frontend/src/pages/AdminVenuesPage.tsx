// frontend/src/pages/AdminVenuesPage.tsx

import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import { Venue } from '../types/Venue';
import VenueList from '../components/VenueList';
import VenueForm from '../components/VenueForm';
import Modal from '../components/Modal';
import ToastStack from '../components/ToastStack';
import { useApi } from '../core/useApi';

/**
 * AdminVenuesPage provides functionality to manage venues.
 * It allows users to view, filter, add, edit, and delete venues.
 */
const AdminVenuesPage: React.FC = () => {
    const [venues, setVenues] = useState<Venue[]>([]); // State to store all venues
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state for adding/editing venues
    const [editingVenue, setEditingVenue] = useState<Venue | undefined>(undefined); // Venue being edited
    const [confirmDelete, setConfirmDelete] = useState<Venue | null>(null); // State for confirmation modal
    const [toasts, setToasts] = useState<{ id: number; text: string }[]>([]); // Toast messages
    const apiRequest = useApi(); // Centralized API handler
    const hasFetched = useRef(false);
    const abortController = useRef<AbortController | null>(null);
    let toastId = useRef(0); // Unique toast IDs for stacking

    /**
     * Fetch venues from the API.
     */
    const fetchVenues = async () => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        if (abortController.current) {
            abortController.current.abort();
        }
        abortController.current = new AbortController();

        try {
            const data: Venue[] = await apiRequest('/venues', {
                method: 'GET',
                signal: abortController.current.signal,
            });
            setVenues(data);
        } catch (error) {
            console.error('Error fetching venues:', error);
            addToast('Failed to fetch venues.');
        }
    };

    useEffect(() => {
        fetchVenues();
        return () => abortController.current?.abort();
    }, []);

    /**
     * Open modal for adding/editing venues.
     */
    const openModal = (venue?: Venue) => {
        setEditingVenue(venue);
        setIsModalOpen(true);
    };

    /**
     * Close modal and reset states.
     */
    const closeModal = () => {
        setEditingVenue(undefined);
        setIsModalOpen(false);
    };

    /**
     * Add toast message.
     * @param message Toast text to display.
     */
    const addToast = (message: string) => {
        setToasts((prev) => [...prev, { id: toastId.current++, text: message }]);
    };

    /**
     * Remove toast message.
     * @param id Toast ID to remove.
     */
    const handleRemoveToast = (id: number) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    /**
     * Handle saving a venue.
     */
    const handleSave = async (data: Venue) => {
        const method = editingVenue ? 'PUT' : 'POST';
        const endpoint = editingVenue ? `/venue/${editingVenue.venue_id}` : '/venue';
    
        // Prepare the payload: only send required fields
        const venuePayload = {
            venue_id: data.venue_id,
            name: data.name,
            latitude: data.latitude,
            longitude: data.longitude,
        };
    
        try {
            const response = await apiRequest(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(venuePayload),
            });
    
            console.log("API Response:", response); // Debug the response
    
            // Safely access 'coordinates' and other response fields
            const updatedVenue: Venue = {
                venue_id: response.data?.venue_id || data.venue_id,
                name: response.data?.name || data.name,
                latitude: response.data?.coordinates?.latitude ?? data.latitude,
                longitude: response.data?.coordinates?.longitude ?? data.longitude,
                programmes: response.data?.programmes || [],
                isFavourite: data.isFavourite, // Preserve existing favorite state
                comments:response.comments
            };
    
            // Update venue list
            setVenues((prev) =>
                editingVenue
                    ? prev.map((v) => (v.venue_id === editingVenue.venue_id ? updatedVenue : v))
                    : [...prev, updatedVenue]
            );
    
            closeModal();
            addToast("Venue successfully saved!");
        } catch (error) {
            console.error("Error saving venue:", error);
            addToast("Failed to save venue. Please try again.");
        }
    };
    

    /**
     * Open confirmation modal for delete.
     */
    const confirmDeleteVenue = (venue: Venue) => {
        setConfirmDelete(venue);
    };

    /**
     * Handle deletion of a venue.
     */
    const handleDelete = async () => {
        if (!confirmDelete) return;

        try {
            await apiRequest(`/venues/${confirmDelete.venue_id}`, { method: 'DELETE' });
            addToast('Venue deleted successfully!');
            setVenues((prevVenues) =>
                prevVenues.filter((v) => v.venue_id !== confirmDelete.venue_id)
            );
            setConfirmDelete(null);
        } catch (error) {
            console.error('Error deleting venue:', error);
            addToast('Failed to delete venue.');
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container p-5 rounded" style={{ backgroundColor: 'rgb(95 127 89 / 75%)' }}>
                <h1 className="mb-4 d-flex">
                    Manage Venues
                    <button className="btn btn-warning ms-auto shadow" onClick={() => openModal()}>
                        Add Venue
                    </button>
                </h1>

                <VenueList
                    venues={venues}
                    onEdit={openModal}
                    onDelete={(venue: Venue) => confirmDeleteVenue(venue)}
                />

                {/* Add/Edit Modal */}
                <Modal
                    title={editingVenue ? 'Edit Venue' : 'Add Venue'}
                    show={isModalOpen}
                    onClose={closeModal}
                    showFooter={false}
                >
                    <VenueForm initialData={editingVenue} onSave={handleSave} onCancel={closeModal} />
                </Modal>

                {/* Delete Confirmation Modal */}
                {confirmDelete && (
                    <Modal
                        title="Confirm Deletion"
                        show={true}
                        onClose={() => setConfirmDelete(null)}
                        onSave={handleDelete}
                    >
                        <p>
                            Are you sure you want to delete <strong>{confirmDelete.name}</strong>?
                        </p>
                    </Modal>
                )}

                {/* Toast Messages */}
                <ToastStack messages={toasts} onRemove={handleRemoveToast} />
            </div>
        </div>
    );
};

export default AdminVenuesPage;
