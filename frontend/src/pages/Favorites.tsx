// src/pages/Favorites.tsx

import React, { useState } from 'react';

interface Location {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

const initialFavorites: Location[] = [
  { id: 1, name: 'Hong Kong Central Library', latitude: 22.2796, longitude: 114.1928 },
  { id: 2, name: 'Victoria Peak', latitude: 22.2758, longitude: 114.1457 },
];

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<Location[]>(initialFavorites);

  const removeFavorite = (id: number) => {
    setFavorites(favorites.filter((location) => location.id !== id));
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h1>Your Favorite Locations</h1>
      {favorites.length > 0 ? (
        <ul style={{ listStyleType: 'none', padding: '0' }}>
          {favorites.map((location) => (
            <li
              key={location.id}
              style={{
                padding: '10px',
                borderBottom: '1px solid #ddd',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <strong>{location.name}</strong>
                <p style={{ margin: 0 }}>Latitude: {location.latitude}</p>
                <p style={{ margin: 0 }}>Longitude: {location.longitude}</p>
              </div>
              <button
                onClick={() => removeFavorite(location.id)}
                style={{
                  backgroundColor: '#f44336',
                  color: '#fff',
                  border: 'none',
                  padding: '5px 10px',
                  cursor: 'pointer',
                  borderRadius: '4px',
                }}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ textAlign: 'center', color: '#888' }}>No favorite locations yet.</p>
      )}
    </div>
  );
};

export default Favorites;
