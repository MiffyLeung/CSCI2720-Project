// frontend/src/pages/AdminAccountsPage.tsx

import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import AccountList from '../components/AccountList';
import AccountSearch from '../components/AccountSearch';
import AccountSort from '../components/AccountSort';
import AccountCategory from '../components/AccountCategory';
import AccountForm from '../components/AccountForm';
import { Account } from '../types/Account';
import { useApi } from '../core/useApi';

const AdminAccountsPage: React.FC = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState<Account | undefined>();
    const apiRequest = useApi();
    const hasFetched = useRef(false);
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const fetchAccounts = async () => {
            if (hasFetched.current) return;
            hasFetched.current = true;

            try {
                const data: Account[] = await apiRequest('/accounts');
                setAccounts(data);
                setFilteredAccounts(data);
            } catch (error) {
                console.error('Error fetching accounts:', error);
            }
        };

        fetchAccounts();
    }, [apiRequest]);
    const handleSave = async (data: Account) => {
        const method = editingAccount ? 'PATCH' : 'POST';
        const endpoint = editingAccount ? `/account/${editingAccount._id}` : '/account';
        const { _id, __v, favourites, ...reqBody } = data;

        try {
            const savedAccount: Account = await apiRequest(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reqBody),
            });

            alert(editingAccount ? 'Account updated successfully!' : 'Account created successfully!');
            closeModal();

            setAccounts((prevAccounts) =>
                editingAccount
                    ? prevAccounts.map((u) => (u.username === editingAccount.username ? savedAccount : u))
                    : [...prevAccounts, savedAccount]
            );
            applyFiltersAndSort();
        } catch (error) {
            console.error('Error saving account:', error);
            alert('Failed to save account.');
        }
    };

    const applyFiltersAndSort = () => {
        let result = [...accounts];

        // Apply search filter
        if (searchQuery) {
            result = result.filter((account) =>
                account.username.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply category filter
        if (category) {
            result = result.filter((account) => account.role === category);
        }

        // Apply sorting
        if (sortOrder) {
            result.sort((a, b) =>
                sortOrder === 'asc'
                    ? a.username.localeCompare(b.username)
                    : b.username.localeCompare(a.username)
            );
        }

        setFilteredAccounts(result);
    };

    const handleFilterChange = (query: string) => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(() => {
            setSearchQuery(query);
            applyFiltersAndSort();
        }, 300);
    };

    const handleCategoryChange = (selectedCategory: string) => {
        setCategory(selectedCategory);
        applyFiltersAndSort();
    };

    const handleSortChange = (sortField: string, sortOrder: string) => {
        setSortOrder(sortOrder);
        applyFiltersAndSort();
    };

    const openModal = (account?: Account) => {
        setEditingAccount(account);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setEditingAccount(undefined);
        setIsModalOpen(false);
    };

    return (
        <div>
            <Navbar />
            <div className="container p-5 rounded position-relative" style={{ backgroundColor: 'rgb(95 127 89 / 75%)' }}>
                <h1>Manage Accounts</h1>
                <button className="btn btn-success mb-3" onClick={() => openModal()}>Add Account</button>
                <div className="d-flex flex-wrap gap-3 align-items-center">
                    <AccountSearch onFilterChange={handleFilterChange} />
                    <AccountCategory onCategoryChange={handleCategoryChange} currentCategory={category} />
                    <AccountSort onSortChange={handleSortChange} currentSortOrder={sortOrder} />
                </div>
                <AccountList accounts={filteredAccounts} onEdit={openModal} onDelete={() => { }} />
                {isModalOpen && (
                    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">{editingAccount ? 'Edit Account' : 'Add Account'}</h5>
                                    <button type="button" className="btn-close" onClick={closeModal}></button>
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
