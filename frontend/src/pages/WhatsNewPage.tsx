// frontend/src/pages/WhatsNewPage.tsx

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Programme } from '../types/Programme';

const WhatsNewPage: React.FC = () => {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const REACT_APP_API = process.env.REACT_APP_API || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchProgrammes = async () => {
      try {
        const response = await fetch(`${REACT_APP_API}/programmes?sort=releaseDate_desc`);
        if (response.ok) {
          const data: Programme[] = await response.json();
          setProgrammes(data);
        }
      } catch (error) {
        console.error('Error fetching programmes:', error);
      }
    };

    fetchProgrammes();
  }, [REACT_APP_API]);

  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h1>What’s New</h1>
        <div className="card-grid">
          {programmes.map((programme) => (
            <div className="card" key={programme.event_id}>
              <h3>{programme.title}</h3>
              <p>{programme.description}</p>
              <p>Release Date: {programme.dateline}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhatsNewPage;
