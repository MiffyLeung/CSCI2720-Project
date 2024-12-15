// frontend/src/pages/MapViewPage.tsx

import React, { useEffect, useState } from 'react';
import VenueMap from '../components/VenueMap';
import Navbar from '../components/Navbar';
import VenueInfo from '../components/VenueInfo';
import { Venue } from '../types/Venue';
import { useApi } from '../core/useApi'; // Centralized API handler
import { useAuth } from '../core/AuthContext'; // Authentication handler

const MapViewPage: React.FC = () => {
    const [venues, setVenues] = useState<Venue[]>([]); // State to hold venue data
    const apiRequest = useApi(); // Use centralized API handler
    const { isAuthenticated } = useAuth(); // Check authentication status

    useEffect(() => {
        /**
         * Fetch venues data for the map.
         */
        const fetchVenues = () => {
            if (!isAuthenticated) {
                console.error('User is not authenticated');
                return;
            }

            apiRequest('/venues/forMap', {}, (data: Venue[]) => {
                setVenues(data); // Update state with fetched venue data
            }).catch((error) => {
                console.error('Error fetching venues:', error);
            });
        };

        fetchVenues();
    }, [isAuthenticated, apiRequest]);

    /**
     * Handle click events on a map marker.
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
