// frontend/src/pages/MapViewPage.tsx

import React, { useEffect, useState } from 'react';
import VenueMap from '../components/VenueMap';
import Navbar from '../components/Navbar';
import ProgrammeInfos from '../components/ProgrammeInfo';
import { Programme } from '../types/Programme';
import { apiRequest } from '../utils/api'; // Centralized API handler
import { useAuthState } from '../utils/secure'; // Authentication handler

const MapViewPage: React.FC = () => {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const { cleanAuth } = useAuthState(); // Handle token management

  useEffect(() => {
    const fetchProgrammes = async () => {
      try {
        const data = await apiRequest('/programmes/upcoming', {}, cleanAuth);
        setProgrammes(data);
      } catch (error) {
        console.error('Error fetching programmes:', error);
      }
    };

    fetchProgrammes();
  }, [cleanAuth]);

  const handleMarkerClick = (programme: Programme) => {
    alert(`Navigate to /programmes/${programme.event_id}`);
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <h1 className="mb-4">Upcoming Programmes Map</h1>
        <div className="map-container">
          <VenueMap
            venues={programmes.map((programme) => ({
              id: programme.event_id,
              name: programme.title,
              latitude: programme.venue.latitude,
              longitude: programme.venue.longitude,
            }))}
            onMarkerClick={(id: string) => {
              const programme = programmes.find((p) => p.event_id === id);
              if (programme) handleMarkerClick(programme);
            }}
            onMarkerHover={(id: string) => {
              const programme = programmes.find((p) => p.event_id === id);
              if (programme) {
                console.log(`Hovered on: ${programme.title}`);
              }
            }}
            renderPopup={(id: string) => {
              const programme = programmes.find((p) => p.event_id === id);
              return programme ? (
                <ProgrammeInfos programme={programme} />
              ) : null;
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MapViewPage;
