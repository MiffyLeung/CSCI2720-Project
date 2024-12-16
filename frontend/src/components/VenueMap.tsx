// frontend\src\components\VenueMap.tsx

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Venue } from 'types/Venue';

export interface VenueMapProps {
  venues: Venue[];
  onMarkerClick: (id: string) => void;
  onMarkerHover?: (id: string) => void;
  renderPopup?: (id: string) => React.ReactNode;
}

const VenueMap: React.FC<VenueMapProps> = ({ venues }) => {
  return (
    <MapContainer center={[22.3964, 114.1095]} zoom={12} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
      />
      {venues.map((Venue) => (
        <Marker key={Venue.venue_id} position={[Venue.latitude, Venue.longitude]}>
          <Popup>{Venue.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default VenueMap;
