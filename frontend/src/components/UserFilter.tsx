// frontend/src/components/UserFilter.tsx

import React, { useState } from 'react';

interface UserFilterProps {
  onFilterChange: (query: string) => void;
}

const UserFilter: React.FC<UserFilterProps> = ({ onFilterChange }) => {
  const [query, setQuery] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onFilterChange(value);
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <label htmlFor="user-filter">Filter Users: </label>
      <input
        type="text"
        id="user-filter"
        value={query}
        onChange={handleInputChange}
        placeholder="Type to search..."
        style={{ padding: '8px', width: '300px' }}
      />
    </div>
  );
};

export default UserFilter;
