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
    <div className="mb-3 d-flex align-items-center gap-3">
      <label htmlFor="sort-field" className="form-label mb-0">
        Sort By:
      </label>
      <select
        id="sort-field"
        className="form-select"
        onChange={handleSortFieldChange}
        style={{ maxWidth: '200px' }}
      >
        <option value="title">Title</option>
        <option value="dateline">Date</option>
        <option value="event_id">ID</option>
      </select>
      <label htmlFor="sort-order" className="form-label mb-0">
        Order:
      </label>
      <select
        id="sort-order"
        className="form-select"
        onChange={handleSortOrderChange}
        style={{ maxWidth: '150px' }}
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
};

export default ProgrammeSort;
