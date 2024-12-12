// frontend/src/components/ProgrammeSort.tsx

import React from 'react';

interface ProgrammeSortProps {
  onSortChange: (sortField: string, sortOrder: string) => void;
}

const ProgrammeSort: React.FC<ProgrammeSortProps> = ({ onSortChange }) => {
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
        <option value="title">Title</option>
        <option value="dateline">Date</option>
        <option value="event_id">ID</option>
      </select>
      <label htmlFor="sort-order">Order: </label>
      <select id="sort-order" onChange={handleSortOrderChange}>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
};

export default ProgrammeSort;
