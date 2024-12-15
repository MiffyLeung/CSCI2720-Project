// frontend/src/components/ProgrammeList.tsx

import React, { useState } from 'react';
import { Table } from 'react-bootstrap';
import { Programme } from '../types/Programme';
import ProgrammeInfo from './ProgrammeInfo';
import { useAuth } from '../core/AuthContext';

interface ProgrammeListProps {
  programmes: Programme[]; // List of programmes to display
  onEdit?: (programme: Programme) => void; // Edit handler
  onDelete?: (programme: Programme) => void; // Delete handler
}

/**
 * ProgrammeList displays a list of programmes in a table format.
 * - Admins can see "Edit" and "Delete" buttons for each row.
 * - Clicking on a programme title opens a modal with its details.
 */
const ProgrammeList: React.FC<ProgrammeListProps> = ({ programmes, onEdit, onDelete }) => {
  const { isAdmin } = useAuth();
  const [selectedProgramme, setSelectedProgramme] = useState<Programme | null>(null);

  return (
    <div>
      <Table striped bordered hover responsive>
        <thead className="table-success text-white">
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Presenter</th>
            {isAdmin && (onEdit || onDelete) && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {programmes.map((programme) => (
            <tr key={programme.event_id}>
              <td
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedProgramme(programme)}
              >
                {programme.title}
              </td>
              <td
                style={{ cursor: 'pointer', maxWidth: '180px' }}
                onClick={() => setSelectedProgramme(programme)}
              >
                {programme.dateline}
              </td>
              <td
                style={{ cursor: 'pointer', maxWidth: '180px' }}
                onClick={() => setSelectedProgramme(programme)}
              >
                {programme.presenter}
              </td>
              {isAdmin && (onEdit || onDelete) && (
                <td>
                  {onEdit && (
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => onEdit(programme)}
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => onDelete(programme)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>

      {/* ProgrammeInfo Modal */}
      {selectedProgramme && (
        <ProgrammeInfo
          programme={selectedProgramme}
          onClose={() => setSelectedProgramme(null)}
        />
      )}
    </div>
  );
};

export default ProgrammeList;
