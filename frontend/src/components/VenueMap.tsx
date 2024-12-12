// frontend\src\components\VenueMap.tsx

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export interface VenueMapProps {
  locations: { id: string; name: string; latitude: number; longitude: number }[];
  onMarkerClick: (id: string) => void;
  onMarkerHover?: (id: string) => void;
  renderPopup?: (id: string) => React.ReactNode;
}

const LocationMap: React.FC<VenueMapProps> = ({ locations }) => {
  return (
    <MapContainer center={[22.3964, 114.1095]} zoom={12} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
      />
      {locations.map((Venue) => (
        <Marker key={Venue.id} position={[Venue.latitude, Venue.longitude]}>
          <Popup>{Venue.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default LocationMap;
