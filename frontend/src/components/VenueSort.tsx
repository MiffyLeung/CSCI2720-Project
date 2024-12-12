// frontend/src/components/VenueSort.tsx

import React from 'react';

interface VenueSortProps {
  onSortChange: (sortField: string, sortOrder: string) => void;
}

const VenueSort: React.FC<VenueSortProps> = ({ onSortChange }) => {
  const handleSortFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortField = e.target.value;
    const sortOrder = (document.getElementById('sort-order') as HTMLSelectElement).value;
    onSortChange(sortField, sortOrder);
  };

  const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortOrder = e.target.value;
    const sortField = (document.getElementById('sort-field') as HTMLSelectElement).value;
    onSortChange(sortField, sortOrder);
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <label htmlFor="sort-field">Sort By: </label>
      <select id="sort-field" onChange={handleSortFieldChange} style={{ marginRight: '10px' }}>
        <option value="name">Name</option>
        <option value="latitude">Latitude</option>
        <option value="longitude">Longitude</option>
      </select>
      <label htmlFor="sort-order">Order: </label>
      <select id="sort-order" onChange={handleSortOrderChange}>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
};

export default VenueSort;
