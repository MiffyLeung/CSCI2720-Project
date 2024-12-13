// frontend/src/pages/AdminVenuesPage.tsx

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Venue } from '../types/Venue';
import VenueList from '../components/VenueList';
import VenueForm from '../components/VenueForm';
import VenueFilter from '../components/VenueFilter';
import { apiRequest } from '../utils/api'; // Centralized API request handler
import { useAuthState } from '../utils/secure'; // Authentication handling

const AdminVenuesPage: React.FC = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | undefined>(undefined);
  const { cleanAuth } = useAuthState(); // Get cleanAuth for token management

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const data = await apiRequest('/venues', {}, cleanAuth);
        setVenues(data);
        setFilteredVenues(data);
      } catch (error) {
        console.error('Error fetching venues:', error);
      }
    };

    fetchVenues();
  }, [cleanAuth]);

  // Open modal to add/edit venue
  const openModal = (venue?: Venue) => {
    setEditingVenue(venue);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setEditingVenue(undefined);
    setIsModalOpen(false);
  };

  // Handle save (add/edit venue)
  const handleSave = async (data: Venue) => {
    const method = editingVenue ? 'PUT' : 'POST';
    const endpoint = editingVenue
      ? `/venues/${editingVenue.id}`
      : '/venues';

    try {
      const savedVenue = await apiRequest(
        endpoint,
        {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        },
        cleanAuth
      );

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

  // Handle filter change
  const handleFilterChange = async (query: string) => {
    if (!query) {
      setFilteredVenues(venues);
      return;
    }

    try {
      const data = await apiRequest(`/venues?search=${query}`, {}, cleanAuth);
      setFilteredVenues(data);
    } catch (error) {
      console.error('Error filtering venues:', error);
    }
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
