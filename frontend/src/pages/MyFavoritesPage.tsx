// frontend/src/pages/MyFavoritesPage.tsx

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Programme } from '../types/Programme';
import { apiRequest } from '../utils/api'; // Centralized API request handler
import { useAuthState } from '../utils/secure'; // Authentication handling

const MyFavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<Programme[]>([]);
  const { cleanAuth } = useAuthState(); // Access cleanAuth for handling token-related issues

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await apiRequest('/favorites', {}, cleanAuth);
        setFavorites(data);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavorites();
  }, [cleanAuth]);

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <h1 className="mb-4">My Favorites</h1>
        {favorites.length > 0 ? (
          <div className="row">
            {favorites.map((programme) => (
              <div className="col-md-4 mb-4" key={programme.event_id}>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{programme.title}</h5>
                    <p className="card-text">
                      <strong>Dateline:</strong> {programme.dateline}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-info" role="alert">
            You have no favorite programmes yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default MyFavoritesPage;
