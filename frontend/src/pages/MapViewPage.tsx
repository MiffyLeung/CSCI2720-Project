// frontend/src/pages/MapViewPage.tsx

import React, { useEffect, useState, useRef } from 'react';
import VenueMap from '../components/VenueMap';
import Navbar from '../components/Navbar';
import VenueInfo from '../components/VenueInfo';
import { Venue } from '../types/Venue';
import { useApi } from '../core/useApi'; // Centralized API handler

/**
 * A page displaying a map with markers for upcoming programmes at various venues.
 * Allows interaction with map markers to display venue-specific details.
 */
const MapViewPage: React.FC = () => {
    const [venues, setVenues] = useState<Venue[]>([]); // State to hold venue data
    const apiRequest = useApi(); // API handler
    const hasFetched = useRef(false); // Track whether data has already been fetched
    const abortController = useRef<AbortController | null>(null); // AbortController for fetch requests

    useEffect(() => {
        /**
         * Fetches venue data for the map.
         * Ensures data is only fetched once and user is authenticated.
         */
        const fetchVenues = async () => {
            if (hasFetched.current) return; // Prevent repeated fetch
            hasFetched.current = true; // Mark as fetched

            if (abortController.current) {
                abortController.current.abort(); // Abort any existing requests
            }
            abortController.current = new AbortController();

            try {
                const data: Venue[] = await apiRequest('/venues/forMap');
                setVenues(data); // Update state with fetched venue data
            } catch (error) {
                console.error('Error fetching venues:', error);
            }
        };

        fetchVenues();
    }, [apiRequest, hasFetched]);

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
            <div className="container p-5 rounded" style={{ backgroundColor: 'rgb(95 127 89 / 75%)' }}>
                <h1 className="mb-4">Upcoming Programmes Map</h1>
                <div className="map-container">
                    <VenueMap type='Many'
                        venues={venues.map((venue) => ({
                            venue_id: venue.venue_id,
                            name: venue.name,
                            latitude: venue.latitude,
                            longitude: venue.longitude,
                            programmes: venue.programmes,
                            isFavourite: venue.isFavourite,
                            comments: venue.comments,
                        }))} // Transform venues data for the map component
                        onMarkerClick={(id: string) => {
                            const venue = venues.find((p) => p.venue_id === id);
                            if (venue) handleMarkerClick(venue); // Handle marker click events
                        }}
                        onMarkerHover={(id: string) => {
                            const venue = venues.find((p) => p.venue_id === id);
                            if (venue) {
                                console.log(`Hovered on: ${venue.name}`); // Log hover events for debugging
                            }
                        }}
                        renderPopup={(id: string) => {
                            const venue = venues.find((p) => p.venue_id === id);
                            return venue ? (
                                <VenueInfo venue={venue} />
                            ) : null; // Render popup information for the hovered venue
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default MapViewPage;
