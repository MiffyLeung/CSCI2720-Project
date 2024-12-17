// frontend/src/pages/VenueListPage.tsx

import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import { Venue } from '../types/Venue';
import VenueList from '../components/VenueList';
import { useApi } from '../core/useApi';

/**
 * VenueListPage component provides functionality to view and manage venues.
 * Includes sorting, searching, distance filtering, and category filtering.
 *
 * @component
 * @example
 * <VenueListPage />
 */
const VenueListPage: React.FC = () => {
  const [venues, setVenues] = useState<Venue[]>([]); // Original venue data
  const apiRequest = useApi(); // API handler
  const hasFetched = useRef(false); // Track whether data has already been fetched
  const abortController = useRef<AbortController | null>(null); // AbortController for fetch requests

  /**
   * Fetch venues from the API.
   */
  const fetchVenues = async () => {
    if (hasFetched.current) return; // Prevent repeated fetch
    hasFetched.current = true; // Mark as fetched

    if (abortController.current) {
      abortController.current.abort(); // Abort any existing requests
    }
    abortController.current = new AbortController();

    try {
      const data: Venue[] = await apiRequest(
        '/venues',
        { method: 'GET', signal: abortController.current.signal,
        }
      );
      setVenues(data);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Fetch aborted.');
      } else {
        console.error('Fetch error:', error);
      }
    }
  };

  /**
   * Trigger fetch on component mount.
   */
  useEffect(() => {
    fetchVenues();

    // Cleanup on component unmount
    return () => {
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, []); // Empty dependency array ensures this runs only once


  return (
    <div>
      <Navbar />
      <div className="container p-5 rounded" style={{ backgroundColor: 'rgb(144 201 133 / 50%)' }}>
        <h1 className="mb-4">Venue Lists</h1>
        {venues.length > 0 ? (
          <VenueList venues={venues} />
        ) : (
          <div>Loading venues...</div>
        )}
      </div>
    </div>
  );
};

export default VenueListPage;
