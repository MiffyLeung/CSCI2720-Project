// frontend\src\components\VenueMap.tsx

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Venue } from 'types/Venue';

export interface VenueMapProps {
  venues: Venue[];
  onMarkerClick: (id: string) => void;
  onMarkerHover?: (id: string) => void;
  renderPopup?: (id: string) => React.ReactNode;
}

const DEFAULT_CENTER: [number, number] = [22.4133574, 114.2104115]; // Chinese University of Hong Kong
const HONG_KONG_BOUNDS = {
  north: 22.559,
  south: 22.153,
  west: 113.837,
  east: 114.41,
};

/**
 * Checks if the given coordinates are within the bounds of Hong Kong.
 * @param lat Latitude
 * @param lng Longitude
 * @returns True if within bounds, false otherwise.
 */
const isInHongKong = (lat: number, lng: number) => {
  return (
    lat >= HONG_KONG_BOUNDS.south &&
    lat <= HONG_KONG_BOUNDS.north &&
    lng >= HONG_KONG_BOUNDS.west &&
    lng <= HONG_KONG_BOUNDS.east
  );
};

// Custom icon for user's location
const userLocationIcon = new L.Icon({
  iconUrl: '/marker-icon.png',
  iconSize: [32, 32], // Adjust size of the icon
  iconAnchor: [16, 32], // Position the icon properly on the map
});

const VenueMap: React.FC<VenueMapProps> = ({ venues }) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    // Get user's location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (isInHongKong(latitude, longitude)) {
          setMapCenter([latitude, longitude]);
          setUserLocation([latitude, longitude]);
        } else {
          setMapCenter(DEFAULT_CENTER);
        }
      },
      () => {
        // If geolocation fails, use default center
        setMapCenter(DEFAULT_CENTER);
      }
    );
  }, []);

  return (
    <MapContainer center={mapCenter} zoom={11} style={{ height: '600px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
      />
      {venues.map((venue) => (
        <Marker key={venue.venue_id} position={[venue.latitude, venue.longitude]}>
          <Popup>{venue.name}</Popup>
        </Marker>
      ))}
        <Marker position={mapCenter} icon={userLocationIcon}>
          <Popup>You are here</Popup>
        </Marker>
    </MapContainer>
  );
};

export default VenueMap;
