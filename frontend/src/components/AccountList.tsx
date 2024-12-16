// frontend/src/components/AccountList.tsx

import React from 'react';
import { Account } from '../types/Account';

interface AccountListProps {
  accounts: Account[];
  onEdit: (account: Account) => void;
}

const AccountList: React.FC<AccountListProps> = ({ accounts, onEdit }) => {
  return (
    <table className="table table-striped">
      <thead>
        <tr className="table-success"> {/* Apply Bootstrap success class for header */}
          <th>Username</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {accounts.map((account) => (
          <tr key={account.id}>
            <td>{account.username}</td>
            <td>{account.role}</td>
            <td>
              <button
                className="btn btn-success btn-sm"
                onClick={() => onEdit(account)}
              >
                Edit
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AccountList;
