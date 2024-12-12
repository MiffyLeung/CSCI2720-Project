// frontend/src/pages/MyProfilePage.tsx

import React from 'react';
import Navbar from '../components/Navbar';

const MyProfilePage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h1>My Profile</h1>
        <form>
          <label>
            Name:
            <input type="text" name="name" defaultValue="John Doe" />
          </label>
          <br />
          <label>
            Email:
            <input type="email" name="email" defaultValue="john.doe@example.com" />
          </label>
          <br />
          <button type="submit">Update</button>
        </form>
      </div>
    </div>
  );
};

export default MyProfilePage;
