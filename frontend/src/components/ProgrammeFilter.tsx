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
    <div className="me-4 d-flex flex-grow-1">
      <label htmlFor="programme-filter" className="form-label">
        Filter Programmes:
      </label>
      <input
        type="text"
        id="programme-filter"
        className="form-control"
        value={query}
        onChange={handleInputChange}
        placeholder="Type to search..."
      />
    </div>
  );
};

export default ProgrammeFilter;
