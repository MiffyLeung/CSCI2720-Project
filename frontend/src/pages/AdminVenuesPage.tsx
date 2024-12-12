// frontend/src/pages/AdminVenuesPage.tsx

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Venue } from '../types/Venue';
import VenueList from '../components/VenueList';
import VenueForm from '../components/VenueForm';
import VenueFilter from '../components/VenueFilter';
import VenueSort from '../components/VenueSort';

const AdminVenuesPage: React.FC = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | undefined>(undefined);
  const REACT_APP_API = process.env.REACT_APP_API || 'http://localhost:5000/api';

  // Fetch all venues from the backend
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await fetch(`${REACT_APP_API}/venues`);
        if (response.ok) {
          const data: Venue[] = await response.json();
          setVenues(data);
          setFilteredVenues(data); // Set initial filtered venues
        }
      } catch (error) {
        console.error('Error fetching venues:', error);
      }
    };

    fetchVenues();
  }, [REACT_APP_API]);

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
    const url = editingVenue
      ? `${REACT_APP_API}/venues/${editingVenue.id}`
      : `${REACT_APP_API}/venues`;

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert(editingVenue ? 'Venue updated successfully!' : 'Venue created successfully!');
        closeModal();
        setVenues((prevVenues) =>
          editingVenue
            ? prevVenues.map((v) => (v.id === editingVenue.id ? data : v))
            : [...prevVenues, data]
        );
        setFilteredVenues((prevVenues) =>
          editingVenue
            ? prevVenues.map((v) => (v.id === editingVenue.id ? data : v))
            : [...prevVenues, data]
        );
      } else {
        alert('Failed to save venue.');
      }
    } catch (error) {
      console.error('Error saving venue:', error);
    }
  };

  // Handle filter change
  const handleFilterChange = async (query: string) => {
    if (!query) {
      setFilteredVenues(venues); // Reset to full list if query is empty
      return;
    }

    try {
      const response = await fetch(`${REACT_APP_API}/venues?search=${query}`);
      if (response.ok) {
        const data: Venue[] = await response.json();
        setFilteredVenues(data);
      }
    } catch (error) {
      console.error('Error filtering venues:', error);
    }
  };

  // Handle sort change
  const handleSortChange = async (sortField: string, sortOrder: string) => {
    try {
      const response = await fetch(`${REACT_APP_API}/venues?sortField=${sortField}&sortOrder=${sortOrder}`);
      if (response.ok) {
        const data: Venue[] = await response.json();
        setFilteredVenues(data);
      }
    } catch (error) {
      console.error('Error sorting venues:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h1>Manage Venues</h1>
        <button onClick={() => openModal()}>Add Venue</button>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginTop: '20px' }}>
          <VenueFilter onFilterChange={handleFilterChange} />
          <VenueSort onSortChange={handleSortChange} />
        </div>
        <VenueList venues={filteredVenues} onEdit={openModal} />
        {isModalOpen && (
          <div className="modal">
            <VenueForm
              initialData={editingVenue}
              onSave={handleSave}
              onCancel={closeModal}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVenuesPage;
