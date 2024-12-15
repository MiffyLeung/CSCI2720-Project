// frontend/src/components/MapButton.tsx

import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet's default marker issue with React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

/**
 * Props for the MapButton component.
 */
interface MapButtonProps {
    /** Venue name for display */
    venueName: string;
    /** Latitude of the venue */
    latitude: number;
    /** Longitude of the venue */
    longitude: number;
}

/**
 * A reusable Map Button component that shows a Leaflet Map modal with the given coordinates.
 *
 * @component
 * @example
 * <MapButton venueName="Sample Venue" latitude={22.3193} longitude={114.1694} />
 */
const MapButton: React.FC<MapButtonProps> = ({ venueName, latitude, longitude }) => {
    const [showMap, setShowMap] = useState(false);

    const handleClose = () => setShowMap(false);
    const handleShow = () => setShowMap(true);

    return (
        <>
            <Button variant="outline-primary" size="sm" onClick={handleShow}>
                View on Map
            </Button>

            <Modal show={showMap} onHide={handleClose} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Venue Location - {venueName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <MapContainer
                        center={[latitude, longitude]}
                        zoom={15}
                        style={{ height: '400px', width: '100%' }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[latitude, longitude]}>
                            <Popup>{venueName}</Popup>
                        </Marker>
                    </MapContainer>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default MapButton;
