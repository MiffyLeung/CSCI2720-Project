// frontend/src/components/VenueDetails.tsx

import React from 'react';
import { Venue } from '../types/Venue';

interface VenueDetailsProps {
  venue: Venue;
  onClose: () => void;
}

const VenueDetails: React.FC<VenueDetailsProps> = ({ venue, onClose }) => {
  return (
    <div className="modal">
      <h2>{venue.name}</h2>
      <p>Latitude: {venue.latitude}</p>
      <p>Longitude: {venue.longitude}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default VenueDetails;
