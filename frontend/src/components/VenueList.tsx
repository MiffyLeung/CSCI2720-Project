// frontend/src/components/VenueList.tsx

import React from 'react';
import { Venue } from '../types/Venue';

interface VenueListProps {
  venues: Venue[];
  onEdit?: (venue: Venue) => void; // Optional callback for edit actions
}

const VenueList: React.FC<VenueListProps> = ({ venues, onEdit }) => {
  return (
    <div className="table-responsive">
      <h2>Venues</h2>
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Latitude</th>
            <th>Longitude</th>
            {onEdit && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {venues.map((venue) => (
            <tr key={venue.id}>
              <td>{venue.id}</td>
              <td>{venue.name}</td>
              <td>{venue.latitude}</td>
              <td>{venue.longitude}</td>
              {onEdit && (
                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => onEdit(venue)}
                  >
                    Edit
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VenueList;
