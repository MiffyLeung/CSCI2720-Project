// frontend/src/pages/MapViewPage.tsx

import React, { useEffect, useState } from 'react';
import VenueMap from '../components/VenueMap';
import Navbar from '../components/Navbar';
import VenueInfo from '../components/VenueInfo';
import { Venue } from '../types/Venue';
import { useApi } from '../core/useApi'; // Centralized API handler
import { useAuth } from '../core/AuthContext'; // Authentication handler

/**
 * A page displaying a map with markers for upcoming programmes at various venues.
 * Allows interaction with map markers to display venue-specific details.
 */
const MapViewPage: React.FC = () => {
    const [venues, setVenues] = useState<Venue[]>([]); // State to hold venue data
    const apiRequest = useApi(); // Use centralized API handler
    const { isAuthenticated } = useAuth(); // Check authentication status
    const [hasFetched, setHasFetched] = useState(false); // Prevent multiple fetches

    useEffect(() => {
        /**
         * Fetches venue data for the map.
         * Ensures data is only fetched once and user is authenticated.
         */
        const fetchVenues = async () => {
            if (!isAuthenticated || hasFetched) return;

            console.log('Fetching venues data...');
            try {
                const data: Venue[] = await apiRequest('/venues/forMap');
                console.log('Fetched venues:', data);
                setVenues(data); // Update state with fetched venue data
                setHasFetched(true); // Mark as fetched
            } catch (error) {
                console.error('Error fetching venues:', error);
            }
        };

        fetchVenues();
    }, [isAuthenticated, apiRequest, hasFetched]);

    /**
     * Handles click events on a map marker.
     * @param venue - The clicked venue object.
     */
    const handleMarkerClick = (venue: Venue) => {
        alert(`Todo: Fetch programmes for venue: ${venue.name}`);
        // Placeholder for fetching venue-specific programmes
    };

    return (
        <div>
            <Navbar />
            <div className="container mt-5">
                <h1 className="mb-4">Upcoming Programmes Map</h1>
                <div className="map-container">
                    <VenueMap
                        venues={venues.map((venue) => ({
                            id: venue.id,
                            name: venue.name,
                            latitude: venue.latitude,
                            longitude: venue.longitude,
                        }))} // Transform venues data for the map component
                        onMarkerClick={(id: string) => {
                            const venue = venues.find((p) => p.id === id);
                            if (venue) handleMarkerClick(venue); // Handle marker click events
                        }}
                        onMarkerHover={(id: string) => {
                            const venue = venues.find((p) => p.id === id);
                            if (venue) {
                                console.log(`Hovered on: ${venue.name}`); // Log hover events for debugging
                            }
                        }}
                        renderPopup={(id: string) => {
                            const venue = venues.find((p) => p.id === id);
                            return venue ? (
                                <VenueInfo venue={venue} onClose={() => console.log('Popup closed')} />
                            ) : null; // Render popup information for the hovered venue
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default MapViewPage;
