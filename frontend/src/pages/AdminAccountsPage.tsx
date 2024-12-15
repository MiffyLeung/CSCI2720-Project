// frontend/src/pages/AdminAccountsPage.tsx

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Account } from '../types/Account';
import AccountList from '../components/AccountList';
import AccountForm from '../components/AccountForm';
import AccountFilter from '../components/AccountFilter';
import AccountSort from '../components/AccountSort';
import { useApi } from '../core/useApi'; // Centralized API request handler
import { useAuth } from '../core/AuthContext'; // Authentication handling

const AdminAccountsPage: React.FC = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState<Account | undefined>(undefined);
    const apiRequest = useApi(); // Centralized API handler
    const { isAuthenticated } = useAuth(); // Check authentication state

    // Fetch all accounts on mount
    useEffect(() => {
        if (!isAuthenticated) {
            console.error('User is not authenticated');
            return;
        }

        apiRequest('/accounts', {}, (data: Account[]) => {
            setAccounts(data);
            setFilteredAccounts(data);
        });
    }, [isAuthenticated, apiRequest]);

    // Open modal to add/edit account
    const openModal = (account?: Account) => {
        setEditingAccount(account);
        setIsModalOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setEditingAccount(undefined);
        setIsModalOpen(false);
    };

    // Save account (add/edit)
    const handleSave = async (data: Account) => {
        const method = editingAccount ? 'PUT' : 'POST';
        const endpoint = editingAccount ? `/accounts/${editingAccount.id}` : '/accounts';

        apiRequest(
            endpoint,
            {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            },
            (savedAccount: Account) => {
                alert(editingAccount ? 'Account updated successfully!' : 'Account created successfully!');
                closeModal();

                // Update state based on whether it's an edit or new addition
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
            },
            (error: any) => {
                console.error('Error saving account:', error);
                alert('Failed to save account.');
            }
        );
    };

    // Handle filtering accounts
    const handleFilterChange = async (query: string) => {
        if (!query) {
            setFilteredAccounts(accounts);
            return;
        }

        apiRequest(
            `/accounts?search=${query}`,
            {},
            (data: Account[]) => {
                setFilteredAccounts(data);
            },
            (error: any) => {
                console.error('Error filtering accounts:', error);
            }
        );
    };

    // Handle sorting accounts
    const handleSortChange = async (sortField: string, sortOrder: string) => {
        apiRequest(
            `/accounts?sortField=${sortField}&sortOrder=${sortOrder}`,
            {},
            (data: Account[]) => {
                setFilteredAccounts(data);
            },
            (error: any) => {
                console.error('Error sorting accounts:', error);
            }
        );
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
                                    <h5 className="modal-title">
                                        {editingAccount ? 'Edit Account' : 'Add Account'}
                                    </h5>
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
