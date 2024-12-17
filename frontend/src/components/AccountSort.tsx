// frontend/src/components/AccountSort.tsx

import React, { useState } from "react";

interface AccountSortProps {
  onSortChange: (sortField: string, sortOrder: string) => void;
}

const AccountSort: React.FC<AccountSortProps> = ({ onSortChange }) => {
  // Add state for sort field and sort order
  const [sortField, setSortField] = useState<string>("username"); // Default: 'username'
  const [sortOrder, setSortOrder] = useState<string>("asc"); // Default: 'asc'

  const handleSortFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortField = e.target.value;
  setSortField(newSortField); // Update state for sortField
  onSortChange(newSortField, sortOrder); // Call the parent handler with the updated field
  };

  const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortOrder = e.target.value;
    setSortOrder(newSortOrder); // Update state for sortOrder
    onSortChange(sortField, newSortOrder); // Call the parent handler with the updated order
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
          value={sortField} // Bind to state
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
          value={sortOrder} // Bind to state
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
