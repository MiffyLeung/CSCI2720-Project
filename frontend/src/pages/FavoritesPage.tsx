// src/pages/FavoritesPage.tsx

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Programme } from '../types/Programme';

const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<Programme[]>([]);
  const token = localStorage.getItem('token');
  const REACT_APP_API = process.env.REACT_APP_API || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch(`${REACT_APP_API}/favorites`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setFavorites(data);
        } else {
          console.error('Failed to fetch favorites');
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavorites();
  }, [REACT_APP_API, token]);

  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h1>Favorites</h1>
        <ul>
          {favorites.map((Programme) => (
            <li key={Programme.event_id}>
              {Programme.title} - {Programme.description}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FavoritesPage;
