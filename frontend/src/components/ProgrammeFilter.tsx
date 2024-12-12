// frontend/src/components/ProgrammeFilter.tsx

import React, { useState } from 'react';

interface ProgrammeFilterProps {
  onFilterChange: (query: string) => void;
}

const ProgrammeFilter: React.FC<ProgrammeFilterProps> = ({ onFilterChange }) => {
  const [query, setQuery] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onFilterChange(value); // Call parent-provided filter change handler
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <label htmlFor="programme-filter">Filter Programmes: </label>
      <input
        type="text"
        id="programme-filter"
        value={query}
        onChange={handleInputChange}
        placeholder="Type to search..."
        style={{ padding: '8px', width: '300px' }}
      />
    </div>
  );
};

export default ProgrammeFilter;
