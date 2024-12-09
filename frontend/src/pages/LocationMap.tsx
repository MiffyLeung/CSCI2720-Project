import React from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const LocationMap: React.FC = () => {
  React.useEffect(() => {
    const map = L.map('map').setView([22.27534, 114.16546], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker([22.27534, 114.16546]).addTo(map)
      .bindPopup('Hong Kong')
      .openPopup();
  }, []);

  return <div id="map" style={{ height: '100vh', width: '100%' }} />;
};

export default LocationMap;
