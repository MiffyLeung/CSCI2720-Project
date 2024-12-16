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

/**
 * A page to manage user accounts. Allows administrators to view,
 * filter, sort, add, and edit accounts.
 */
const AdminAccountsPage: React.FC = () => {
    const [accounts, setAccounts] = useState<Account[]>([]); // State to hold all accounts
    const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]); // State to hold filtered accounts
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state for adding/editing accounts
    const [editingAccount, setEditingAccount] = useState<Account | undefined>(undefined); // Account being edited
    const apiRequest = useApi(); // Centralized API handler
    const { isAuthenticated } = useAuth(); // Check authentication state
    const [hasFetched, setHasFetched] = useState(false); // Prevent duplicate fetches

    useEffect(() => {
        /**
         * Fetch all accounts from the API.
         * Ensures the user is authenticated and data is only fetched once.
         */
        const fetchAccounts = async () => {
            if (!isAuthenticated || hasFetched) return;

            console.log('Fetching accounts...');
            try {
                const data: Account[] = await apiRequest('/accounts');
                console.log('Fetched accounts:', data);
                setAccounts(data); // Update accounts state
                setFilteredAccounts(data); // Initialize filtered accounts
                setHasFetched(true); // Mark as fetched
            } catch (error) {
                console.error('Error fetching accounts:', error);
            }
        };

        fetchAccounts();
    }, [isAuthenticated, apiRequest, hasFetched]);

    /**
     * Open the modal to add or edit an account.
     * @param account Optional account to edit; if not provided, the modal is used for adding.
     */
    const openModal = (account?: Account) => {
        setEditingAccount(account);
        setIsModalOpen(true);
    };

    /**
     * Close the modal and reset the editing account state.
     */
    const closeModal = () => {
        setEditingAccount(undefined);
        setIsModalOpen(false);
    };

    /**
     * Handle saving an account (either adding or editing).
     * @param data The account data to save.
     */
    const handleSave = async (data: Account) => {
        const method = editingAccount ? 'PUT' : 'POST';
        const endpoint = editingAccount ? `/accounts/${editingAccount.id}` : '/accounts';

        try {
            const savedAccount: Account = await apiRequest(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            alert(editingAccount ? 'Account updated successfully!' : 'Account created successfully!');
            closeModal();

            // Update state based on whether it's an edit or a new addition
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

    /**
     * Handle filtering accounts based on a search query.
     * @param query The search query to filter accounts.
     */
    const handleFilterChange = async (query: string) => {
        if (!query) {
            setFilteredAccounts(accounts); // Reset filter when query is empty
            return;
        }

        try {
            const data: Account[] = await apiRequest(`/accounts?search=${query}`);
            setFilteredAccounts(data); // Update filtered accounts
        } catch (error) {
            console.error('Error filtering accounts:', error);
        }
    };

    /**
     * Handle sorting accounts based on a field and order.
     * @param sortField The field to sort by.
     * @param sortOrder The order of sorting (ascending/descending).
     */
    const handleSortChange = async (sortField: string, sortOrder: string) => {
        try {
            const data: Account[] = await apiRequest(
                `/accounts?sortField=${sortField}&sortOrder=${sortOrder}`
            );
            setFilteredAccounts(data); // Update sorted accounts
        } catch (error) {
            console.error('Error sorting accounts:', error);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container mt-5">
                <h1>Manage Accounts</h1>
                <button className="btn btn-success mb-3" onClick={() => openModal()}>
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
