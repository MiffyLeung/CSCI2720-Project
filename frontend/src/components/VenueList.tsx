// frontend/src/components/VenueList.tsx

import React from 'react';
import { Venue } from '../types/Venue';

interface VenueListProps {
  venues: Venue[];
  onEdit?: (venue: Venue) => void; // Optional callback for edit actions
}

const VenueList: React.FC<VenueListProps> = ({ venues, onEdit }) => {
  return (
    <div>
      <h2>Venues</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Latitude</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Longitude</th>
            {onEdit && <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {venues.map((venue) => (
            <tr key={venue.id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{venue.id}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{venue.name}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{venue.latitude}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{venue.longitude}</td>
              {onEdit && (
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  <button
                    onClick={() => onEdit(venue)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#007bff',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
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
