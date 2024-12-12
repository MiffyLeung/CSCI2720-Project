// frontend/src/pages/UserDashboardPage.tsx

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ProgrammeList from '../components/ProgrammeList';
import ProgrammeInfo from '../components/ProgrammeInfo'; // Updated reference
import { Programme } from '../types/Programme';

const UserDashboardPage: React.FC = () => {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProgramme, setSelectedProgramme] = useState<Programme | null>(null);
  const REACT_APP_API = process.env.REACT_APP_API || 'http://localhost:5000/api';

  // Fetch programmes from API on mount
  useEffect(() => {
    const fetchProgrammes = async () => {
      try {
        const response = await fetch(`${REACT_APP_API}/programmes`);
        if (response.ok) {
          const data: Programme[] = await response.json();
          setProgrammes(data);
        } else {
          console.error(`Failed to fetch programmes: ${response.status}`);
        }
      } catch (error) {
        console.error('Error fetching programmes:', error);
      }
    };

    fetchProgrammes();
  }, [REACT_APP_API]);

  // Open modal with selected programme
  const openModal = (programme: Programme) => {
    setSelectedProgramme(programme);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setSelectedProgramme(null);
    setIsModalOpen(false);
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h1>User Dashboard</h1>
        <ProgrammeList programmes={programmes} onEdit={openModal} />
        {isModalOpen && selectedProgramme && (
          <div className="modal">
            <ProgrammeInfo programme={selectedProgramme} onClose={closeModal} />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboardPage;
