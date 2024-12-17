// frontend/src/components/VenueInfo.tsx

import React from 'react';
import { Venue } from '../types/Venue';

interface VenueInfoProps {
  venue: Venue | null;
  onClose: () => void;
}

const VenueInfo: React.FC<VenueInfoProps> = ({ venue, onClose }) => {
  if (!venue) return null; 
  return (
    <div className="modal">
      <h2>{venue.name}</h2>
      <p>Latitude: {venue.latitude}</p>
      <p>Longitude: {venue.longitude}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default VenueInfo;
