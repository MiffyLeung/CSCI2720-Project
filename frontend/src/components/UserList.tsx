// frontend/src/components/UserList.tsx

import React from 'react';
import { User } from '../types/User'; // Use shared type

interface UserListProps {
  users: User[];
  onEdit: (user: User) => void;
}

const UserList: React.FC<UserListProps> = ({ users, onEdit }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Username</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.username}</td>
            <td>{user.role}</td>
            <td>
              <button onClick={() => onEdit(user)}>Edit</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserList;
