// frontend/src/pages/AdminUsersPage.tsx

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { User } from '../types/User';
import UserList from '../components/UserList';
import UserForm from '../components/UserForm';
import UserFilter from '../components/UserFilter';
import UserSort from '../components/UserSort';

const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined);
  const REACT_APP_API = process.env.REACT_APP_API || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${REACT_APP_API}/users`);
        if (response.ok) {
          const data: User[] = await response.json();
          setUsers(data);
          setFilteredUsers(data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [REACT_APP_API]);

  const openModal = (user?: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingUser(undefined);
    setIsModalOpen(false);
  };

  const handleSave = async (data: User) => {
    const method = editingUser ? 'PUT' : 'POST';
    const url = editingUser
      ? `${REACT_APP_API}/users/${editingUser.id}`
      : `${REACT_APP_API}/users`;

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert(editingUser ? 'User updated successfully!' : 'User created successfully!');
        closeModal();
        setUsers((prevUsers) =>
          editingUser
            ? prevUsers.map((u) => (u.id === editingUser.id ? data : u))
            : [...prevUsers, data]
        );
        setFilteredUsers((prevUsers) =>
          editingUser
            ? prevUsers.map((u) => (u.id === editingUser.id ? data : u))
            : [...prevUsers, data]
        );
      } else {
        alert('Failed to save user.');
      }
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleFilterChange = async (query: string) => {
    if (!query) {
      setFilteredUsers(users);
      return;
    }

    try {
      const response = await fetch(`${REACT_APP_API}/users?search=${query}`);
      if (response.ok) {
        const data: User[] = await response.json();
        setFilteredUsers(data);
      }
    } catch (error) {
      console.error('Error filtering users:', error);
    }
  };

  const handleSortChange = async (sortField: string, sortOrder: string) => {
    try {
      const response = await fetch(`${REACT_APP_API}/users?sortField=${sortField}&sortOrder=${sortOrder}`);
      if (response.ok) {
        const data: User[] = await response.json();
        setFilteredUsers(data);
      }
    } catch (error) {
      console.error('Error sorting users:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h1>Manage Users</h1>
        <button onClick={() => openModal()}>Add User</button>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <UserFilter onFilterChange={handleFilterChange} />
          <UserSort onSortChange={handleSortChange} />
        </div>
        <UserList users={filteredUsers} onEdit={openModal} />
        {isModalOpen && (
          <div className="modal">
            <UserForm
              initialData={editingUser}
              onSave={handleSave}
              onCancel={closeModal}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
