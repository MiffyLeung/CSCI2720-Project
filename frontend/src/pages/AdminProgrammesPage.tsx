// frontend/src/pages/AdminProgrammesPage.tsx

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Programme } from '../types/Programme';
import ProgrammeList from '../components/ProgrammeList';
import ProgrammeForm from '../components/ProgrammeForm';
import ProgrammeFilter from '../components/ProgrammeFilter';
import { apiRequest } from '../utils/api'; // Reusable API request
import { useAuthState } from '../utils/secure'; // Authentication handling

const AdminProgrammesPage: React.FC = () => {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [filteredProgrammes, setFilteredProgrammes] = useState<Programme[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgramme, setEditingProgramme] = useState<Programme | undefined>(undefined);
  const { cleanAuth } = useAuthState(); // Get cleanAuth from secure.ts

  // Fetch programmes on mount
  useEffect(() => {
    const fetchProgrammes = async () => {
      try {
        const data = await apiRequest('/programmes', {}, cleanAuth);
        setProgrammes(data);
        setFilteredProgrammes(data);
      } catch (error) {
        console.error('Error fetching programmes:', error);
      }
    };

    fetchProgrammes();
  }, [cleanAuth]);

  const openModal = (programme?: Programme) => {
    setEditingProgramme(programme);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingProgramme(undefined);
    setIsModalOpen(false);
  };

  const handleSave = async (data: Programme) => {
    const method = editingProgramme ? 'PUT' : 'POST';
    const endpoint = editingProgramme
      ? `/programmes/${editingProgramme.event_id}`
      : '/programmes';

    try {
      const savedProgramme = await apiRequest(
        endpoint,
        {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        },
        cleanAuth
      );

      alert(editingProgramme ? 'Programme updated successfully!' : 'Programme created successfully!');
      closeModal();

      setProgrammes((prevProgrammes) =>
        editingProgramme
          ? prevProgrammes.map((p) => (p.event_id === editingProgramme.event_id ? savedProgramme : p))
          : [...prevProgrammes, savedProgramme]
      );
      setFilteredProgrammes((prevProgrammes) =>
        editingProgramme
          ? prevProgrammes.map((p) => (p.event_id === editingProgramme.event_id ? savedProgramme : p))
          : [...prevProgrammes, savedProgramme]
      );
    } catch (error) {
      console.error('Error saving programme:', error);
      alert('Failed to save programme.');
    }
  };

  const handleFilterChange = async (query: string) => {
    if (!query) {
      setFilteredProgrammes(programmes);
      return;
    }

    try {
      const data = await apiRequest(`/programmes?search=${query}`, {}, cleanAuth);
      setFilteredProgrammes(data);
    } catch (error) {
      console.error('Error filtering programmes:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <h1 className="mb-4">Manage Programmes</h1>
        <button className="btn btn-primary mb-4" onClick={() => openModal()}>
          Add Programme
        </button>
        <div className="mb-4">
          <ProgrammeFilter onFilterChange={handleFilterChange} />
        </div>
        <ProgrammeList programmes={filteredProgrammes} onEdit={openModal} />
        {isModalOpen && (
          <div
            className="modal fade show d-block"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingProgramme ? 'Edit Programme' : 'Add Programme'}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={closeModal}
                  ></button>
                </div>
                <div className="modal-body">
                  <ProgrammeForm
                    initialData={editingProgramme}
                    onSave={handleSave}
                    onCancel={closeModal}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProgrammesPage;
