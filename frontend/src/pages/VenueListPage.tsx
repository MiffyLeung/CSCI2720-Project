// frontend/src/pages/VenueListPage.tsx

import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import { Venue } from '../types/Venue';
import VenueList from '../components/VenueList';
import VenueSort from '../components/VenueSort';
import VenueSearch from '../components/VenueSearch';
import VenueDistance from '../components/VenueDistance';
import VenueCategory from '../components/VenueCategory';
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
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]); // Filtered data
  const [sortField, setSortField] = useState<string>('name'); // Default sort field
  const [searchQuery, setSearchQuery] = useState<string>(''); // Search query
  const [userLocation, setUserLocation] = useState<GeolocationCoordinates | null>(null); // User coordinates
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // Category filter
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
        { method: 'GET', signal: abortController.current.signal },
        undefined,
        (error: any) => console.error('Error fetching venues:', error)
      );
      setVenues(data);
      setFilteredVenues(data); // Initialize filtered data
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

  /**
   * Handles sorting changes and updates the filtered list.
   * @param {string} field - The field to sort by.
   */
  const handleSortChange = (field: string) => {
    setSortField(field);
    const sortedVenues = [...filteredVenues].sort((a, b) => {
      if (field === 'favourite') {
        return b.isFavourite ? 1 : -1;
      }
      return (a[field as keyof Venue] || '').toString().localeCompare((b[field as keyof Venue] || '').toString());
    });
    setFilteredVenues(sortedVenues);
  };

  /**
   * Handles search query changes and filters the venue list.
   * @param {string} query - The search query.
   */
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    const filtered = venues.filter((venue) =>
      venue.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredVenues(filtered);
  };

  /**
   * Filters venues based on the specified distance.
   * @param {number} distance - The maximum distance in kilometers.
   */
  const handleDistanceFilter = (distance: number) => {
    if (!userLocation) return;

    const filtered = venues.filter((venue) => {
      const haversineDistance = calculateDistance(
        { latitude: venue.latitude, longitude: venue.longitude },
        { latitude: userLocation.latitude, longitude: userLocation.longitude }
      );
      return haversineDistance <= distance;
    });

    setFilteredVenues(filtered);
  };

  /**
   * Filters venues based on the selected category.
   * @param {string} category - The selected category.
   */
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const filtered = venues.filter((venue) => venue.programmes?.includes(category));
    setFilteredVenues(filtered);
  };

  /**
   * Calculates the distance between two coordinates using the Haversine formula.
   * @param {{ latitude: number; longitude: number }} coord1 - First coordinate.
   * @param {{ latitude: number; longitude: number }} coord2 - Second coordinate.
   * @returns {number} Distance in kilometers.
   */
  const calculateDistance = (coord1: { latitude: number; longitude: number }, coord2: { latitude: number; longitude: number }) => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371; // Earth's radius in km
    const dLat = toRad(coord2.latitude - coord1.latitude);
    const dLon = toRad(coord2.longitude - coord1.longitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(coord1.latitude)) *
      Math.cos(toRad(coord2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <h1 className="mb-4">Venues</h1>

        {/* Filter Components */}
        <div className="d-flex justify-content-between gap-3 mb-4">
          <VenueSearch onSearch={handleSearchChange} />
          <VenueSort onSortChange={handleSortChange} />
          <VenueDistance onFilter={handleDistanceFilter} />
          <VenueCategory onCategoryChange={handleCategoryChange} />
        </div>

        {/* Venue List */}
        <VenueList venues={filteredVenues} />
      </div>
    </div>
  );
};

export default VenueListPage;
