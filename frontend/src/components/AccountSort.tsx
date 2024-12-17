// frontend/src/components/AccountSort.tsx

import React from 'react';

interface AccountSortProps {
  onSortChange: (sortField: string, sortOrder: string) => void;
}

const AccountSort: React.FC<AccountSortProps> = ({ onSortChange }) => {
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
    <div className="mb-3">
      <div className="d-flex align-items-center gap-3">
        <label htmlFor="sort-field" className="fw-bold form-label">
          Sort By:
        </label>
        <select
          id="sort-field"
          className="form-select"
          onChange={handleSortFieldChange}
        >
          <option value="username">Username</option>
          <option value="email">Email</option>
          <option value="role">Role</option>
        </select>
        <label htmlFor="sort-order" className="form-label">
          Order:
        </label>
        <select
          id="sort-order"
          className="form-select"
          onChange={handleSortOrderChange}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>
  );
};

export default AccountSort;
