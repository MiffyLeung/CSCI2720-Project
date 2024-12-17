// frontend/src/pages/MyFavoritesPage.tsx

import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import { Programme } from '../types/Programme';
import { useApi } from '../core/useApi'; // Centralized API request handler

/**
 * MyFavoritesPage component displays a list of the user's favorite programmes.
 *
 * @component
 * @example
 * <MyFavoritesPage />
 */
const MyFavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<Programme[]>([]); // State to hold favorite programmes
  const apiRequest = useApi(); // Use centralized API handler
  const [hasFetched, setHasFetched] = useState(false); // Prevent multiple fetches
  const abortController = useRef<AbortController | null>(null);

  useEffect(() => {
    /**
     * Fetch the user's favorite programmes.
     */
    const fetchFavorites = async () => {
      if (hasFetched) return; // Skip if already fetched or not authenticated
      if (abortController.current) abortController.current.abort(); // Abort previous request
      abortController.current = new AbortController(); // Create a new controller for this request
      setHasFetched(true); // Mark as fetched

      console.log('Fetching favorite programmes...');
      try {
        const data: Programme[] = await apiRequest(
          '/myFavorites',
          { method: 'GET' },
          abortController.current.signal, // Attach AbortSignal
          (response) => {
            console.log('Fetched favorites:', response);
            setFavorites(response); // Update state with fetched favorites
          },
          (error) => {
            console.error('Error fetching favorites:', error);
          }
        );
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          console.log('Fetch aborted');
        } else {
          console.error('Unexpected error:', error);
        }
      }
    };

    fetchFavorites();

    // Cleanup on component unmount
    return () => {
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, [apiRequest, hasFetched]);

  return (
    <div>
      <Navbar />
      <div className="container p-5 rounded" style={{backgroundColor: 'rgb(95 127 89 / 75%)'}}>
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
