// frontend/src/pages/VenueDetailsPage.tsx

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Venue } from '../types/Venue';

const VenueDetailsPage: React.FC = () => {
  const [venue, setVenue] = useState<Venue | null>(null);
  const REACT_APP_API = process.env.REACT_APP_API || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchVenue = async () => {
      const id = window.location.pathname.split('/').pop();
      try {
        const response = await fetch(`${REACT_APP_API}/venues/${id}`);
        if (response.ok) {
          const data: Venue = await response.json();
          setVenue(data);
        }
      } catch (error) {
        console.error('Error fetching venue:', error);
      }
    };

    fetchVenue();
  }, [REACT_APP_API]);

  if (!venue) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h1>{venue.name}</h1>
        <p>Latitude: {venue.latitude}</p>
        <p>Longitude: {venue.longitude}</p>
      </div>
    </div>
  );
};

export default VenueDetailsPage;
