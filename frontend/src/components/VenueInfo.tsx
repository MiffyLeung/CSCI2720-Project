// frontend/src/components/VenueInfo.tsx

import React from 'react';
import { Venue } from '../types/Venue';
import { Link } from 'react-router-dom';
import { Search } from 'react-bootstrap-icons';

interface VenueInfoProps {
  venue: Venue;
}

const VenueInfo: React.FC<VenueInfoProps> = ({ venue }) => {
  return (
    <div className="p-1 flex text-center">
      <h4 className="mt-2">
        <Link className="link-success" to={`/venue/${venue.venue_id}`}>
          {venue.name}
        </Link>
      </h4>
      <p className="pt-1">
        <Link className="btn btn-outline-success" to={`/venue/${venue.venue_id}`}>
        <Search className="me-1" />
          Details
        </Link>
      </p>
    </div>
  );
};

export default VenueInfo;
