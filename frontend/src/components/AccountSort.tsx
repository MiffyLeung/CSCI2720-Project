// frontend/src/components/AccountSort.tsx

import React from 'react';

interface AccountSortProps {
  onSortChange: (sortField: string, sortOrder: string) => void;
  currentSortOrder: string;
}

const AccountSort: React.FC<AccountSortProps> = ({ onSortChange, currentSortOrder }) => {
  const handleSortOrderChange = (sortOrder: string) => {
    onSortChange('username', sortOrder); // Always sort by username
  };

  return (
    <div className="mb-3">
      <label className="form-label fw-bold text-center w-100">Sort by username:</label>
      <div className="btn-group w-100" role="group">
        {/* Ascending */}
        <input
          type="radio"
          className="btn-check"
          id="sort-asc"
          name="sortOrder"
          value="asc"
          checked={currentSortOrder === 'asc'}
          onChange={() => handleSortOrderChange('asc')}
        />
        <label className="btn btn-outline-light" htmlFor="sort-asc">
          Asc
        </label>

        {/* None */}
        <input
          type="radio"
          className="btn-check"
          id="sort-none"
          name="sortOrder"
          value=""
          checked={currentSortOrder === ''}
          onChange={() => handleSortOrderChange('')}
        />
        <label className="btn btn-outline-light" htmlFor="sort-none">
          None
        </label>

        {/* Descending */}
        <input
          type="radio"
          className="btn-check"
          id="sort-desc"
          name="sortOrder"
          value="desc"
          checked={currentSortOrder === 'desc'}
          onChange={() => handleSortOrderChange('desc')}
        />
        <label className="btn btn-outline-light" htmlFor="sort-desc">
          Desc
        </label>
      </div>
    </div>
  );
};

export default AccountSort;
