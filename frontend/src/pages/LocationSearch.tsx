// src/pages/LocationSearch.tsx

import React, { useState } from 'react';

interface Location {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

const dummyLocations: Location[] = [
  { id: 1, name: 'Hong Kong Central Library', latitude: 22.2796, longitude: 114.1928 },
  { id: 2, name: 'Hong Kong Cultural Centre', latitude: 22.2946, longitude: 114.1717 },
  { id: 3, name: 'Hong Kong Science Museum', latitude: 22.3019, longitude: 114.1773 },
  { id: 4, name: 'Hong Kong Park', latitude: 22.2772, longitude: 114.1638 },
  { id: 5, name: 'Victoria Peak', latitude: 22.2758, longitude: 114.1457 },
];

const LocationSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<Location[]>(dummyLocations);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setQuery(value);

    const results = dummyLocations.filter((location) =>
      location.name.toLowerCase().includes(value)
    );
    setFilteredLocations(results);
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h1>Search Locations</h1>
      <input
        type="text"
        placeholder="Search by name..."
        value={query}
        onChange={handleSearch}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '20px',
          border: '1px solid #ccc',
          borderRadius: '4px',
        }}
      />
      <ul style={{ listStyleType: 'none', padding: '0' }}>
        {filteredLocations.map((location) => (
          <li
            key={location.id}
            style={{
              padding: '10px',
              borderBottom: '1px solid #ddd',
              cursor: 'pointer',
            }}
            onClick={() => console.log(`Selected Location: ${location.name}`)}
          >
            <strong>{location.name}</strong>
            <p style={{ margin: 0 }}>Latitude: {location.latitude}</p>
            <p style={{ margin: 0 }}>Longitude: {location.longitude}</p>
          </li>
        ))}
        {filteredLocations.length === 0 && (
          <p style={{ textAlign: 'center', color: '#888' }}>No locations found.</p>
        )}
      </ul>
    </div>
  );
};

export default LocationSearch;
