// frontend\src\pages\MapViewPage.tsx

import React, { useEffect, useState } from 'react';
import VenueMap from '../components/VenueMap';
import Navbar from '../components/Navbar';
import ProgrammeInfos from '../components/ProgrammeInfo';
import { Programme } from '../types/Programme';

const MapViewPage: React.FC = () => {
    const [programmes, setProgrammes] = useState<Programme[]>([]);

    useEffect(() => {
        const fetchProgrammes = async () => {
            try {
                const response = await fetch('/api/programmes/upcoming');
                if (!response.ok) {
                    throw new Error('Failed to fetch programmes');
                }
                const data = await response.json();
                setProgrammes(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchProgrammes();
    }, []);

    const handleMarkerClick = (programme: Programme) => {
        alert(`Navigate to /programmes/${programme.event_id}`);
    };

    return (
        <div>
            <Navbar />
            <div style={{ padding: '20px' }}>
                <h1>Upcoming Programmes Map</h1>
                <VenueMap
                    locations={programmes.map((programme) => ({
                        id: programme.event_id,
                        name: programme.title,
                        latitude: programme.venue.latitude,
                        longitude: programme.venue.longitude,
                    }))}
                    onMarkerClick={(id: string) => {
                        const programme = programmes.find((p) => p.event_id === id);
                        if (programme) handleMarkerClick(programme);
                    }}
                    onMarkerHover={(id: string) => {
                        const programme = programmes.find((p) => p.event_id === id);
                        if (programme) {
                            console.log(`Hovered on: ${programme.title}`);
                        }
                    }}
                    renderPopup={(id: string) => {
                        const programme = programmes.find((p) => p.event_id === id);
                        return programme ? (
                            <ProgrammeInfos programme={programme} />
                        ) : null;
                    }}
                />
            </div>
        </div>
    );
};

export default MapViewPage;
