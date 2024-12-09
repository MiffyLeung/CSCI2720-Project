import React, { useEffect, useState } from 'react';
import axios from 'axios';

function LocationList() {
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/locations')
            .then(response => setLocations(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div>
            <h1>Locations</h1>
            <ul>
                {locations.map(location => (
                    <li key={location._id}>{location.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default LocationList;
