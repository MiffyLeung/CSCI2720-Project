// FILEPATH: frontend/src/pages/MyFavoritesPage.tsx

import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import VenueList from '../components/VenueList';
import { useApi } from '../core/useApi';
import { Venue } from '../types/Venue';
import { transformVenueFromBackend } from '../types/Venue';
/**
 * MyFavoritesPage displays the user's favorite venues.
 * It allows the user to remove bookmarked venues.
 */
const MyFavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<Venue[]>([]); // State to store favorite venues
  const apiRequest = useApi();
  const hasFetched = useRef(false);
  const abortController = useRef<AbortController | null>(null);

  /**
   * Fetch favorite venues from the API and map them to the required format.
   */

  const fetchFavorites = async () => {
    if (hasFetched.current) return;

    hasFetched.current = true;

    if (abortController.current) {
      abortController.current.abort();
    }
    abortController.current = new AbortController();

    try {
      const response = await apiRequest(
        '/myFavorites',
        { method: 'GET', signal: abortController.current.signal }
      );

      console.log('Fetched Favorites Response:', response);

      if (Array.isArray(response)) {
        const mappedFavorites = response.map(transformVenueFromBackend);

        // 預設根據 programmes 數量降序排序
        const sortedFavorites = mappedFavorites.sort(
          (a, b) => (b.programmes.length || 0) - (a.programmes.length || 0)
        );

        setFavorites(sortedFavorites);
      } else {
        console.warn('Unexpected API response structure:', response);
        setFavorites([]);
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Fetch aborted.');
      } else {
        console.error('Fetch error:', error);
      }
    }
  };


  /**
   * Remove a venue from bookmarks.
   * @param {string} venueId - The ID of the venue to remove.
   */
  const removeBookmark = async (venueId: string) => {
    try {
      await apiRequest(`/venue/${venueId}/bookmark`, { method: 'DELETE' });
      setFavorites((prev) => prev.filter((venue) => venue.venue_id !== venueId));
    } catch (error: any) {
      console.error('Error removing bookmark:', error);
    }
  };

  // Fetch favorites on component mount
  useEffect(() => {
    fetchFavorites();

    return () => {
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container p-5 rounded position-relative" style={{ backgroundColor: 'rgb(95 127 89 / 75%)' }}>
        <h1 className="mb-4">My Favorite Venues</h1>
        {favorites.length > 0 ? (
          <VenueList
            venues={favorites}
            defaultField="programmes"
            order="desc"
          />
        ) : (
          <div>No favorite venues found.</div>
        )}
      </div>
    </div>
  );
};

export default MyFavoritesPage;
