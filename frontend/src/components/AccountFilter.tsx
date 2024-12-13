// frontend/src/components/AccountFilter.tsx

import React, { useState } from 'react';

interface AccountFilterProps {
  onFilterChange: (query: string) => void;
}

const AccountFilter: React.FC<AccountFilterProps> = ({ onFilterChange }) => {
  const [query, setQuery] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onFilterChange(value);
  };

  return (
    <div className="mb-3">
      <label htmlFor="account-filter">Filter Accounts: </label>
      <input
        type="text"
        id="account-filter"
        value={query}
        onChange={handleInputChange}
        placeholder="Type to search..."
        className="form-control"
      />
    </div>
  );
};

export default AccountFilter;
