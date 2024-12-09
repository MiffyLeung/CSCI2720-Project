// src/pages/AdminUsers.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  _id: string;
  username: string;
  email: string;
  role: string; // e.g., "user" or "admin"
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<User>({
    _id: '',
    username: '',
    email: '',
    role: 'user',
  });

  const [isEditing, setIsEditing] = useState(false);

  // Fetch all users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle add or update user
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (isEditing) {
        // Update user
        const response = await axios.put(`/api/users/${newUser._id}`, newUser);
        setUsers((prev) =>
          prev.map((user) => (user._id === response.data._id ? response.data : user))
        );
      } else {
        // Add user
        const response = await axios.post('/api/users', newUser);
        setUsers((prev) => [...prev, response.data]);
      }

      // Reset form
      setNewUser({ _id: '', username: '', email: '', role: 'user' });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  // Handle edit
  const handleEdit = (user: User) => {
    setNewUser(user);
    setIsEditing(true);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/users/${id}`);
      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
      <h1>Admin Users</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Username:
            <input
              type="text"
              name="username"
              value={newUser.username}
              onChange={handleChange}
              required
              style={{ marginLeft: '10px', width: '100%' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={newUser.email}
              onChange={handleChange}
              required
              style={{ marginLeft: '10px', width: '100%' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Role:
            <select
              name="role"
              value={newUser.role}
              onChange={handleChange}
              style={{ marginLeft: '10px', width: '100%', padding: '8px' }}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </label>
        </div>
        <button type="submit" style={{ padding: '10px 20px', marginRight: '10px' }}>
          {isEditing ? 'Update User' : 'Add User'}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setNewUser({ _id: '', username: '', email: '', role: 'user' });
            }}
            style={{ padding: '10px 20px', backgroundColor: '#f44336', color: '#fff' }}
          >
            Cancel
          </button>
        )}
      </form>
      <h2>Existing Users</h2>
      <ul style={{ listStyleType: 'none', padding: '0' }}>
        {users.map((user) => (
          <li
            key={user._id}
            style={{
              borderBottom: '1px solid #ddd',
              padding: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <strong>{user.username}</strong> (<em>{user.role}</em>)
              <p style={{ margin: 0 }}>Email: {user.email}</p>
            </div>
            <div>
              <button
                onClick={() => handleEdit(user)}
                style={{
                  padding: '5px 10px',
                  marginRight: '10px',
                  backgroundColor: '#4CAF50',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(user._id)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#f44336',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      {users.length === 0 && <p>No users found.</p>}
    </div>
  );
};

export default AdminUsers;
