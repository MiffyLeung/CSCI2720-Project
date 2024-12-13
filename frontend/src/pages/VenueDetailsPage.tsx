// frontend/src/pages/VenueDetailsPage.tsx

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Venue } from '../types/Venue';
import { apiRequest } from '../utils/api'; // Centralized API handler
import { useAuthState } from '../utils/secure'; // Authentication handler

const VenueDetailsPage: React.FC = () => {
  const [venue, setVenue] = useState<Venue | null>(null);
  const { cleanAuth } = useAuthState(); // Token management

  useEffect(() => {
    const fetchVenue = async () => {
      const id = window.location.pathname.split('/').pop();
      try {
        const data: Venue = await apiRequest(`/venue/${id}`, {}, cleanAuth);
        setVenue(data);
      } catch (error) {
        console.error('Error fetching venue:', error);
      }
    };

    fetchVenue();
  }, [cleanAuth]);

  if (!venue) {
    return (
      <div>
        <Navbar />
        <div className="container mt-5">
          <div className="alert alert-info" role="alert">
            Loading venue details...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <h1 className="mb-4">{venue.name}</h1>
        <div className="card">
          <div className="card-body">
            <p className="card-text">
              <strong>Latitude:</strong> {venue.latitude}
            </p>
            <p className="card-text">
              <strong>Longitude:</strong> {venue.longitude}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueDetailsPage;
