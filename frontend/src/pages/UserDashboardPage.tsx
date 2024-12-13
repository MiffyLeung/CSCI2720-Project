// frontend/src/pages/UserDashboardPage.tsx

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ProgrammeList from '../components/ProgrammeList';
import ProgrammeInfo from '../components/ProgrammeInfo';
import { Programme } from '../types/Programme';
import { apiRequest } from '../utils/api'; // Centralized API request handler
import { useAuthState } from '../utils/secure'; // Authentication handler

const UserDashboardPage: React.FC = () => {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProgramme, setSelectedProgramme] = useState<Programme | null>(null);
  const { cleanAuth } = useAuthState(); // Handle token management

  // Fetch programmes from API on mount
  useEffect(() => {
    const fetchProgrammes = async () => {
      try {
        const data = await apiRequest('/programmes', {}, cleanAuth);
        setProgrammes(data);
      } catch (error) {
        console.error('Error fetching programmes:', error);
      }
    };

    fetchProgrammes();
  }, [cleanAuth]);

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
      <div className="container mt-5">
        <h1 className="mb-4">User Dashboard</h1>
        <ProgrammeList programmes={programmes} onEdit={openModal} />
        {isModalOpen && selectedProgramme && (
          <div
            className="modal fade show d-block"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Programme Details</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                  ></button>
                </div>
                <div className="modal-body">
                  <ProgrammeInfo programme={selectedProgramme} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboardPage;
