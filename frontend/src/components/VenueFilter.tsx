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
    <div className="mb-3">
      <label htmlFor="venue-filter" className="form-label">
        Filter Venues:
      </label>
      <input
        type="text"
        id="venue-filter"
        className="form-control"
        value={query}
        onChange={handleInputChange}
        placeholder="Type to search..."
      />
    </div>
  );
};

export default VenueFilter;
