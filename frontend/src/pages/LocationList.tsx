import React, { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';

// 定義 Location 接口，用於描述數據結構
interface Location {
    _id: string;
    name: string;
}

function LocationList() {
    // useState 需要指定類型為 Location 的數組
    const [locations, setLocations] = useState<Location[]>([]);

    useEffect(() => {
        // 使用 axios 的內建類型進行響應類型的明確定義
        axios.get<Location[]>('http://localhost:5000/api/locations')
            .then((response: AxiosResponse<Location[]>) => setLocations(response.data))
            .catch((error) => console.error(error));
    }, []);

    return (
        <div>
            <h1>Locations</h1>
            <ul>
                {locations.map((location) => (
                    <li key={location._id}>{location.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default LocationList;
