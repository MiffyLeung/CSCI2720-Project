// frontend/src/components/VenueSearch.tsx

import React, { useState } from 'react';

/**
 * Props for VenueSearch component.
 * @interface VenueSearchProps
 * @property {(query: string) => void} onSearch - Callback function for handling search queries.
 */
interface VenueSearchProps {
  /**
   * Callback function triggered when the user types in the search box.
   * @param query - The search query entered by the user.
   */
  onSearch: (query: string) => void;
}

/**
 * VenueSearch component provides a search input for filtering venues.
 *
 * @component
 * @example
 * <VenueSearch onSearch={(query) => console.log(query)} />
 */
const VenueSearch: React.FC<VenueSearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  /**
   * Handles input change and triggers the `onSearch` callback.
   * @param e - React change event for the input.
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value); // Trigger callback
  };

  return (
        <div className="mb-3">
      <label htmlFor="venue-filter" className="form-label fw-bold">
        Search Venues:
      </label>
      <input
        type="text"
        id="venue-filter"
        className="form-control"
        placeholder="Search for venues..."
        value={query}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default VenueSearch;
