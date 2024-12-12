// frontend/src/pages/HotestPage.tsx

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Programme } from '../types/Programme';

const HotestPage: React.FC = () => {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const REACT_APP_API = process.env.REACT_APP_API || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchHotestProgrammes = async () => {
      try {
        const response = await fetch(`${REACT_APP_API}/programmes?sort=ranking_desc`);
        if (response.ok) {
          const data: Programme[] = await response.json();
          setProgrammes(data);
        }
      } catch (error) {
        console.error('Error fetching hotest programmes:', error);
      }
    };

    fetchHotestProgrammes();
  }, [REACT_APP_API]);

  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h1>Hotest Events</h1>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Ranking</th>
            </tr>
          </thead>
          <tbody>
            {programmes.map((programme) => (
              <tr key={programme.event_id}>
                <td>{programme.title}</td>
                <td>{programme.likes + programme.comments.length * 5}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HotestPage;
