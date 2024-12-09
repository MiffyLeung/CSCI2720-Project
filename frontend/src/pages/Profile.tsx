// src/pages/Profile.tsx

import React, { useState } from 'react';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const initialProfileData: ProfileData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '123-456-7890',
  address: '123 Main Street, Hong Kong',
};

const Profile: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData>(initialProfileData);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Updated Profile Data:', profileData);
    setIsEditing(false);
    // TODO: Integrate with backend to save updated profile data
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h1>Profile</h1>
      {!isEditing ? (
        <div>
          <p>
            <strong>Name:</strong> {profileData.name}
          </p>
          <p>
            <strong>Email:</strong> {profileData.email}
          </p>
          <p>
            <strong>Phone:</strong> {profileData.phone}
          </p>
          <p>
            <strong>Address:</strong> {profileData.address}
          </p>
          <button
            onClick={() => setIsEditing(true)}
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '4px',
            }}
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>
              Name:
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={profileData.name}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>
              Email:
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={profileData.email}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="phone" style={{ display: 'block', marginBottom: '5px' }}>
              Phone:
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={profileData.phone}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="address" style={{ display: 'block', marginBottom: '5px' }}>
              Address:
            </label>
            <input
              id="address"
              name="address"
              type="text"
              value={profileData.address}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <button
            type="submit"
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '4px',
              marginRight: '10px',
            }}
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            type="button"
            style={{
              backgroundColor: '#f44336',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '4px',
            }}
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default Profile;
