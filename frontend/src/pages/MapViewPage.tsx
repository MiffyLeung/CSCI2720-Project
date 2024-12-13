// frontend/src/pages/MapViewPage.tsx

import React, { useEffect, useState } from 'react';
import VenueMap from '../components/VenueMap';
import Navbar from '../components/Navbar';
import VenueInfo from '../components/VenueInfo';
import { Venue } from '../types/Venue';
import { apiRequest } from '../utils/api'; // Centralized API handler
import { useAuthState } from '../utils/secure'; // Authentication handler

const MapViewPage: React.FC = () => {
  const [venues, setVences] = useState<Venue[]>([]);
  const { cleanAuth } = useAuthState(); // Handle token management

  useEffect(() => {
    const fetchVences = async () => {
      try {
        const data = await apiRequest('/venues/forMap', {}, cleanAuth);
        setVences(data);
      } catch (error) {
        console.error('Error fetching venues:', error);
      }
    };

    fetchVences();
  }, [cleanAuth]);

  const handleMarkerClick = (venue: Venue) => {
    alert('Todo: Get Venue Programmes');
    // Ajax get `venue/${venue.id}`);
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <h1 className="mb-4">Upcoming Programmes Map</h1>
        <div className="map-container">
          <VenueMap
            venues={venues.map((venue) => ({
              id: venue.id,
              name: venue.name,
              latitude: venue.latitude,
              longitude: venue.longitude,
            }))}
            onMarkerClick={(id: string) => {
              const venue = venues.find((p) => p.id === id);
              if (venue) handleMarkerClick(venue);
            }}
            onMarkerHover={(id: string) => {
              const venue = venues.find((p) => p.id === id);
              if (venue) {
                console.log(`Hovered on: ${venue.name}`);
              }
            }}
            renderPopup={(id: string) => {
              const venue = venues.find((p) => p.id === id);
              return venue ? (
                <VenueInfo venue={venue} onClose={function (): void {
                  throw new Error('Function not implemented.');
                } } />
              ) : null;
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MapViewPage;
