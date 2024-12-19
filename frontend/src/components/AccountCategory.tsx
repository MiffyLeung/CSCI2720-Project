// frontend/src/components/AccountCategroy.tsx

import React from 'react';

interface AccountCategoryProps {
  onCategoryChange: (category: string) => void;
  currentCategory: string;
}

const AccountCategory: React.FC<AccountCategoryProps> = ({ onCategoryChange, currentCategory }) => {
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onCategoryChange(e.target.value); // Pass selected value to parent
  };

  return (
    <div className="mb-3">
      <label htmlFor="account-category" className="form-label fw-bold">Category:</label>
      <select
        id="account-category"
        className="form-select"
        value={currentCategory}
        onChange={handleCategoryChange}
      >
        <option value="">All roles</option>
        <option value="admin">Admin</option>
        <option value="user">User</option>
        <option value="banned">Banned</option>
      </select>
    </div>
  );
};


export default AccountCategory;
