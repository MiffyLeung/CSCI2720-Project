// frontend/src/pages/AdminAccountsPage.tsx

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Account } from '../types/Account';
import AccountList from '../components/AccountList';
import AccountForm from '../components/AccountForm';
import AccountFilter from '../components/AccountFilter';
import AccountSort from '../components/AccountSort';
import { apiRequest } from '../utils/api'; // Centralized API request handler
import { useAuthState } from '../utils/secure'; // Authentication handling

const AdminAccountsPage: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | undefined>(undefined);
  const { cleanAuth } = useAuthState(); // Access cleanAuth for token handling

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await apiRequest('/accounts', {}, cleanAuth);
        setAccounts(data);
        setFilteredAccounts(data);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };

    fetchAccounts();
  }, [cleanAuth]);

  const openModal = (account?: Account) => {
    setEditingAccount(account);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingAccount(undefined);
    setIsModalOpen(false);
  };

  const handleSave = async (data: Account) => {
    const method = editingAccount ? 'PUT' : 'POST';
    const endpoint = editingAccount
      ? `/accounts/${editingAccount.id}`
      : '/accounts';

    try {
      const savedAccount = await apiRequest(
        endpoint,
        {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        },
        cleanAuth
      );

      alert(editingAccount ? 'Account updated successfully!' : 'Account created successfully!');
      closeModal();

      setAccounts((prevAccounts) =>
        editingAccount
          ? prevAccounts.map((u) => (u.id === editingAccount.id ? savedAccount : u))
          : [...prevAccounts, savedAccount]
      );
      setFilteredAccounts((prevAccounts) =>
        editingAccount
          ? prevAccounts.map((u) => (u.id === editingAccount.id ? savedAccount : u))
          : [...prevAccounts, savedAccount]
      );
    } catch (error) {
      console.error('Error saving account:', error);
      alert('Failed to save account.');
    }
  };

  const handleFilterChange = async (query: string) => {
    if (!query) {
      setFilteredAccounts(accounts);
      return;
    }

    try {
      const data = await apiRequest(`/accounts?search=${query}`, {}, cleanAuth);
      setFilteredAccounts(data);
    } catch (error) {
      console.error('Error filtering accounts:', error);
    }
  };

  const handleSortChange = async (sortField: string, sortOrder: string) => {
    try {
      const data = await apiRequest(
        `/accounts?sortField=${sortField}&sortOrder=${sortOrder}`,
        {},
        cleanAuth
      );
      setFilteredAccounts(data);
    } catch (error) {
      console.error('Error sorting accounts:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <h1>Manage Accounts</h1>
        <button className="btn btn-primary mb-3" onClick={() => openModal()}>
          Add Account
        </button>
        <div className="d-flex flex-wrap gap-3">
          <AccountFilter onFilterChange={handleFilterChange} />
          <AccountSort onSortChange={handleSortChange} />
        </div>
        <AccountList accounts={filteredAccounts} onEdit={openModal} />
        {isModalOpen && (
          <div
            className="modal fade show d-block"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{editingAccount ? 'Edit Account' : 'Add Account'}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                  ></button>
                </div>
                <div className="modal-body">
                  <AccountForm
                    initialData={editingAccount}
                    onSave={handleSave}
                    onCancel={closeModal}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAccountsPage;
