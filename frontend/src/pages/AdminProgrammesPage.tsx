// frontend/src/pages/AdminProgrammesPage.tsx

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Programme } from '../types/Programme';
import ProgrammeList from '../components/ProgrammeList';
import ProgrammeEditForm from '../components/ProgrammeEditForm';
import ProgrammeCreateForm from '../components/ProgrammeCreateForm';
import ProgrammeFilter from '../components/ProgrammeFilter';
import ProgrammeSort from '../components/ProgrammeSort';
import { useApi } from '../core/useApi';
import { useAuth } from '../core/AuthContext';

/**
 * AdminProgrammesPage is used to manage programmes.
 * Admins can view, create, edit, delete, filter, and sort programmes.
 *
 * @component
 */
const AdminProgrammesPage: React.FC = () => {
  const [programmes, setProgrammes] = useState<Programme[]>([]); // List of all programmes
  const [filteredProgrammes, setFilteredProgrammes] = useState<Programme[]>([]); // Filtered programmes
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [editingProgramme, setEditingProgramme] = useState<Programme | undefined>(undefined); // Programme for editing
  const [filterQuery, setFilterQuery] = useState<string>(''); // Search query
  const [sortFunction, setSortFunction] = useState<(a: Programme, b: Programme) => number>(
    () => (a: Programme, b: Programme): number => (b.submitdate || 0) - (a.submitdate || 0) // Default: Sort by submitdate descending
  ); // Current sort function
  const apiRequest = useApi(); // API request hook
  const { isAuthenticated } = useAuth(); // Authentication context
  const [hasFetched, setHasFetched] = useState(false); // Ensures data is fetched only once

  /**
   * Fetches the list of programmes from the server.
   */
  useEffect(() => {
    const fetchProgrammes = async () => {
      if (hasFetched) return;

      if (!isAuthenticated) {
        console.error('User is not authenticated');
        return;
      }

      try {
        console.log('Fetching programmes...');
        const data: Programme[] = await apiRequest('/programmes');
        setProgrammes(data);

        // Apply default sort
        const sortedData = [...data].sort((a, b) => (b.submitdate || 0) - (a.submitdate || 0));
        setFilteredProgrammes(sortedData);

        setHasFetched(true);
      } catch (error) {
        console.error('Error fetching programmes:', error);
      }
    };

    fetchProgrammes();
  }, [isAuthenticated, apiRequest, hasFetched]);

  /**
   * Opens the modal for adding or editing a programme.
   * @param programme Optional - The programme to edit.
   */
  const openModal = (programme?: Programme) => {
    setEditingProgramme(programme);
    setIsModalOpen(true);
  };

  /**
   * Closes the modal and resets the editing state.
   */
  const closeModal = () => {
    setEditingProgramme(undefined);
    setIsModalOpen(false);
  };

  /**
   * Handles saving a programme, either creating a new one or updating an existing one.
   * @param data The programme data to save.
   */
  const handleSave = async (data: Programme) => {
    const method = editingProgramme ? 'PUT' : 'POST';
    const endpoint = editingProgramme
      ? `/programme/${editingProgramme.event_id}`
      : '/programmes';

    try {
      const savedProgramme: Programme = await apiRequest(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      alert(
        editingProgramme
          ? 'Programme updated successfully!'
          : 'Programme created successfully!'
      );
      closeModal();

      setProgrammes((prevProgrammes) =>
        editingProgramme
          ? prevProgrammes.map((p) =>
              p.event_id === editingProgramme.event_id ? savedProgramme : p
            )
          : [...prevProgrammes, savedProgramme]
      );

      setFilteredProgrammes((prevProgrammes) =>
        editingProgramme
          ? prevProgrammes.map((p) =>
              p.event_id === editingProgramme.event_id ? savedProgramme : p
            )
          : [...prevProgrammes, savedProgramme]
      );
    } catch (error) {
      console.error('Error saving programme:', error);
      alert('Failed to save programme.');
    }
  };

  /**
   * Handles deleting a programme.
   * @param programme The programme to delete.
   */
  const handleDelete = async (programme: Programme) => {
    if (!window.confirm(`Are you sure you want to delete "${programme.title}"?`)) return;

    try {
      await apiRequest(`/programme/${programme.event_id}`, { method: 'DELETE' });

      alert('Programme deleted successfully!');
      setProgrammes((prev) =>
        prev.filter((p) => p.event_id !== programme.event_id)
      );
      setFilteredProgrammes((prev) =>
        prev.filter((p) => p.event_id !== programme.event_id)
      );
    } catch (error) {
      console.error('Error deleting programme:', error);
      alert('Failed to delete programme.');
    }
  };

  /**
   * Filters programmes based on the query and updates the filtered list.
   * @param query The search query.
   */
  const handleFilterChange = (query: string) => {
    setFilterQuery(query);

    let filtered = programmes.filter(
      (programme) =>
        programme.title.toLowerCase().includes(query.toLowerCase()) ||
        programme.presenter.toLowerCase().includes(query.toLowerCase()) ||
        programme.venue.name.toLowerCase().includes(query.toLowerCase())
    );

    // Apply current sort to the filtered data
    filtered = filtered.sort(sortFunction);

    setFilteredProgrammes(filtered);
  };

  /**
   * Handles sorting of programmes using a sort function.
   * @param {(a: Programme, b: Programme) => number} sortFunction - The sort function.
   */
  const handleSortChange = (sortFunction: (a: Programme, b: Programme) => number) => {
    setSortFunction(() => sortFunction);
    const sortedData = [...filteredProgrammes].sort(sortFunction);
    setFilteredProgrammes(sortedData);
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <h1 className="mb-4">Manage Programmes</h1>

        {/* Add Programme Button */}
        <button className="btn btn-primary mb-4" onClick={() => openModal()}>
          Add Programme
        </button>

        {/* Programme Filter and Sort */}
        <div className="d-flex justify-content-between mb-4">
          <ProgrammeFilter onFilterChange={handleFilterChange} />
          <ProgrammeSort
            onSortChange={handleSortChange}
            defaultField="submitdate" // Default sorting field
          />
        </div>

        {/* Programme List */}
        <ProgrammeList
          programmes={filteredProgrammes}
          onEdit={openModal}
          onDelete={handleDelete}
        />

        {/* Modal for Creating or Editing Programmes */}
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
                  {editingProgramme ? (
                    <ProgrammeEditForm
                      initialData={editingProgramme}
                      onSave={handleSave}
                      onCancel={closeModal}
                    />
                  ) : (
                    <ProgrammeCreateForm
                      onSave={handleSave}
                      onCancel={closeModal}
                    />
                  )}
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
