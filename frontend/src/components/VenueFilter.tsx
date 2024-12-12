// frontend/src/components/VenueFilter.tsx

import React, { useState } from 'react';

interface VenueFilterProps {
  onFilterChange: (query: string) => void;
}

const VenueFilter: React.FC<VenueFilterProps> = ({ onFilterChange }) => {
  const [query, setQuery] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onFilterChange(value);
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <label htmlFor="venue-filter">Filter Venues: </label>
      <input
        type="text"
        id="venue-filter"
        value={query}
        onChange={handleInputChange}
        placeholder="Type to search..."
        style={{ padding: '8px', width: '300px' }}
      />
    </div>
  );
};

export default VenueFilter;
