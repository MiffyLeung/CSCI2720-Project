// src/pages/AdminLocations.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Location {
  _id: string;
  name: string;
  latitude: number;
  longitude: number;
  description: string;
}

const AdminLocations: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [newLocation, setNewLocation] = useState<Location>({
    _id: '',
    name: '',
    latitude: 0,
    longitude: 0,
    description: '',
  });

  const [isEditing, setIsEditing] = useState(false);

  // Fetch all locations from the backend
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get('/api/locations');
        setLocations(response.data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };
    fetchLocations();
  }, []);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewLocation((prev) => ({
      ...prev,
      [name]: name === 'latitude' || name === 'longitude' ? parseFloat(value) : value,
    }));
  };

  // Handle add or update location
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (isEditing) {
        // Update location
        const response = await axios.put(`/api/locations/${newLocation._id}`, newLocation);
        setLocations((prev) =>
          prev.map((loc) => (loc._id === response.data._id ? response.data : loc))
        );
      } else {
        // Add location
        const response = await axios.post('/api/locations', newLocation);
        setLocations((prev) => [...prev, response.data]);
      }

      // Reset form
      setNewLocation({ _id: '', name: '', latitude: 0, longitude: 0, description: '' });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving location:', error);
    }
  };

  // Handle edit
  const handleEdit = (location: Location) => {
    setNewLocation(location);
    setIsEditing(true);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/locations/${id}`);
      setLocations((prev) => prev.filter((loc) => loc._id !== id));
    } catch (error) {
      console.error('Error deleting location:', error);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
      <h1>Admin Locations</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={newLocation.name}
              onChange={handleChange}
              required
              style={{ marginLeft: '10px', width: '100%' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Latitude:
            <input
              type="number"
              name="latitude"
              value={newLocation.latitude}
              onChange={handleChange}
              required
              style={{ marginLeft: '10px', width: '100%' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Longitude:
            <input
              type="number"
              name="longitude"
              value={newLocation.longitude}
              onChange={handleChange}
              required
              style={{ marginLeft: '10px', width: '100%' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Description:
            <input
              type="text"
              name="description"
              value={newLocation.description}
              onChange={handleChange}
              style={{ marginLeft: '10px', width: '100%' }}
            />
          </label>
        </div>
        <button type="submit" style={{ padding: '10px 20px', marginRight: '10px' }}>
          {isEditing ? 'Update Location' : 'Add Location'}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setNewLocation({ _id: '', name: '', latitude: 0, longitude: 0, description: '' });
            }}
            style={{ padding: '10px 20px', backgroundColor: '#f44336', color: '#fff' }}
          >
            Cancel
          </button>
        )}
      </form>
      <h2>Existing Locations</h2>
      <ul style={{ listStyleType: 'none', padding: '0' }}>
        {locations.map((location) => (
          <li
            key={location._id}
            style={{
              borderBottom: '1px solid #ddd',
              padding: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <strong>{location.name}</strong>
              <p style={{ margin: 0 }}>Latitude: {location.latitude}</p>
              <p style={{ margin: 0 }}>Longitude: {location.longitude}</p>
              <p style={{ margin: 0 }}>Description: {location.description}</p>
            </div>
            <div>
              <button
                onClick={() => handleEdit(location)}
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
                onClick={() => handleDelete(location._id)}
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
      {locations.length === 0 && <p>No locations found.</p>}
    </div>
  );
};

export default AdminLocations;
