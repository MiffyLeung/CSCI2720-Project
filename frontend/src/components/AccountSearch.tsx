import React, { useState, useEffect } from 'react';

interface AccountSearchProps {
  onFilterChange: (query: string) => void;
}

const AccountSearch: React.FC<AccountSearchProps> = ({ onFilterChange }) => {
  const [query, setQuery] = useState(''); // Local state for input value
  const [debouncedQuery, setDebouncedQuery] = useState(query); // Debounced query state

  // Update the debounced query with a delay
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query); // Update the debounced value after delay
    }, 300); // Adjust delay (300ms is standard for debounce)

    return () => {
      clearTimeout(handler); // Clear timeout if query changes before delay ends
    };
  }, [query]);

  // Trigger the parent filter function whenever the debounced query changes
  useEffect(() => {
    onFilterChange(debouncedQuery);
  }, [debouncedQuery, onFilterChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value); // Update the local input state
  };

  return (
    <div className="mb-3 col">
      <label htmlFor="account-search" className="form-label fw-bold">Search User:</label>
      <input
        type="text"
        id="account-search"
        value={query}
        onChange={handleInputChange}
        placeholder="Type to search..."
        className="form-control"
      />
    </div>
  );
};

export default AccountSearch;
