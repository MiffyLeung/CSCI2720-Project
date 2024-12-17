// frontend/src/pages/HottestPage.tsx

import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import { Programme } from '../types/Programme';
import ProgrammeList from '../components/ProgrammeList';
import ProgrammeFilter from '../components/ProgrammeFilter';
import ProgrammeSort from '../components/ProgrammeSort';
import { useApi } from '../core/useApi';

/**
 * HottestPage component to list programmes with filtering and sorting functionality.
 * Default sorting is by Likes (descending).
 *
 * @component
 */
const HottestPage: React.FC = () => {
  const [programmes, setProgrammes] = useState<Programme[]>([]); // Full data
  const [filteredProgrammes, setFilteredProgrammes] = useState<Programme[]>([]); // Filtered data
  const [filterQuery, setFilterQuery] = useState<string>(''); // Current filter query
  const [sortFunction, setSortFunction] = useState<((a: Programme, b: Programme) => number) | null>(null); // Current sort function
  const apiRequest = useApi(); // API handler
  const hasFetched = useRef(false); // Track whether data has already been fetched
  const abortController = useRef<AbortController | null>(null); // AbortController for fetch requests
 
  /**
   * Fetch programmes from the server once.
   */
  useEffect(() => {
    const fetchProgrammes = async () => {
      if (hasFetched.current) return; // Prevent repeated fetch
      hasFetched.current = true; // Mark as fetched
  
      if (abortController.current) {
        abortController.current.abort(); // Abort any existing requests
      }
      abortController.current = new AbortController();
  
      try {
        const data: Programme[] = await apiRequest('/programmes');
        setProgrammes(data);
      } catch (error) {
        console.error('Error fetching programmes:', error);
      }
    };

    fetchProgrammes();
  }, [apiRequest, hasFetched]);

  /**
   * Sets default sorting function to Likes (descending) after programmes are loaded.
   */
  useEffect(() => {
    if (programmes.length > 0 && !sortFunction) {
      const defaultSort = (a: Programme, b: Programme): number => (b.likes || 0) - (a.likes || 0);
      setSortFunction(() => defaultSort);
    }
  }, [programmes, sortFunction]);

  /**
   * Applies filtering and sorting to the list of programmes.
   */
  useEffect(() => {
    let data = programmes;

    // Apply filter
    if (filterQuery) {
      data = data.filter((programme) =>
        programme.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
        programme.presenter.toLowerCase().includes(filterQuery.toLowerCase()) ||
        programme.venue.name.toLowerCase().includes(filterQuery.toLowerCase())
      );
    }

    // Apply sort
    if (sortFunction) {
      data = [...data].sort((a, b) => sortFunction(a, b) || 0); // Ensure valid comparison result
    }

    setFilteredProgrammes(data);
  }, [programmes, filterQuery, sortFunction]);

  return (
    <div>
      <Navbar />
      <div className="container p-5 rounded" style={{backgroundColor: 'rgb(95 127 89 / 75%)'}}>
        <h1 className="mb-4">Hottest Programmes</h1>

        <div className="d-flex justify-content-between align-items-center">
          <ProgrammeFilter onFilterChange={(query) => setFilterQuery(query)} />
          <ProgrammeSort
            onSortChange={(sortFn) => setSortFunction(() => sortFn)}
            defaultField="likes" // Default field is Likes
          />
        </div>

        <ProgrammeList programmes={filteredProgrammes} />
      </div>
    </div>
  );
};

export default HottestPage;
