// frontend/src/pages/MyFavoritesPage.tsx

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Programme } from '../types/Programme';

const MyFavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<Programme[]>([]);
  const REACT_APP_API = process.env.REACT_APP_API || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch(`${REACT_APP_API}/favorites`);
        if (response.ok) {
          const data: Programme[] = await response.json();
          setFavorites(data);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavorites();
  }, [REACT_APP_API]);

  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h1>My Favorites</h1>
        <ul>
          {favorites.map((programme) => (
            <li key={programme.event_id}>
              {programme.title} - {programme.dateline}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MyFavoritesPage;
