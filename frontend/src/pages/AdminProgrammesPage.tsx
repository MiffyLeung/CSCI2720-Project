// frontend/src/pages/AdminProgrammesPage.tsx

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Programme } from '../types/Programme'; // Use shared type
import ProgrammeList from '../components/ProgrammeList';
import ProgrammeForm from '../components/ProgrammeForm';
import ProgrammeFilter from '../components/ProgrammeFilter';

const AdminProgrammesPage: React.FC = () => {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [filteredProgrammes, setFilteredProgrammes] = useState<Programme[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgramme, setEditingProgramme] = useState<Programme | undefined>(undefined);
  const REACT_APP_API = process.env.REACT_APP_API || 'http://localhost:5000/api';

  // Fetch initial programmes
  useEffect(() => {
    const fetchProgrammes = async () => {
      try {
        const response = await fetch(`${REACT_APP_API}/programmes`);
        if (response.ok) {
          const data: Programme[] = await response.json();
          setProgrammes(data);
          setFilteredProgrammes(data);
        }
      } catch (error) {
        console.error('Error fetching programmes:', error);
      }
    };

    fetchProgrammes();
  }, [REACT_APP_API]);

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
    const url = editingProgramme
      ? `${REACT_APP_API}/programmes/${editingProgramme.event_id}`
      : `${REACT_APP_API}/programmes`;

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert(editingProgramme ? 'Programme updated successfully!' : 'Programme created successfully!');
        closeModal();
        setProgrammes((prevProgrammes) =>
          editingProgramme
            ? prevProgrammes.map((p) => (p.event_id === editingProgramme.event_id ? data : p))
            : [...prevProgrammes, data]
        );
        setFilteredProgrammes((prevProgrammes) =>
          editingProgramme
            ? prevProgrammes.map((p) => (p.event_id === editingProgramme.event_id ? data : p))
            : [...prevProgrammes, data]
        );
      } else {
        alert('Failed to save programme.');
      }
    } catch (error) {
      console.error('Error saving programme:', error);
    }
  };

  // Handle filtering of programmes
  const handleFilterChange = async (query: string) => {
    if (!query) {
      setFilteredProgrammes(programmes); // Reset if query is empty
      return;
    }

    try {
      const response = await fetch(`${REACT_APP_API}/programmes?search=${query}`);
      if (response.ok) {
        const data: Programme[] = await response.json();
        setFilteredProgrammes(data);
      }
    } catch (error) {
      console.error('Error filtering programmes:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h1>Manage Programmes</h1>
        <button onClick={() => openModal()}>Add Programme</button>
        <ProgrammeFilter onFilterChange={handleFilterChange} />
        <ProgrammeList programmes={filteredProgrammes} onEdit={openModal} />
        {isModalOpen && (
          <div className="modal">
            <ProgrammeForm
              initialData={editingProgramme}
              onSave={handleSave}
              onCancel={closeModal}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProgrammesPage;
