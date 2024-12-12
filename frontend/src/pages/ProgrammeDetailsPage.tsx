// frontend/src/pages/ProgrammeDetailsPage.tsx

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Programme } from '../types/Programme';

const ProgrammeDetailsPage: React.FC = () => {
  const [programme, setProgramme] = useState<Programme | null>(null);
  const REACT_APP_API = process.env.REACT_APP_API || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchProgramme = async () => {
      const id = window.location.pathname.split('/').pop();
      try {
        const response = await fetch(`${REACT_APP_API}/programmes/${id}`);
        if (response.ok) {
          const data: Programme = await response.json();
          setProgramme(data);
        }
      } catch (error) {
        console.error('Error fetching programme:', error);
      }
    };

    fetchProgramme();
  }, [REACT_APP_API]);

  if (!programme) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h1>{programme.title}</h1>
        <p>{programme.description}</p>
        <p>Presenter: {programme.presenter}</p>
        <p>Date: {programme.dateline}</p>
        <p>Price: {programme.price}</p>
      </div>
    </div>
  );
};

export default ProgrammeDetailsPage;
