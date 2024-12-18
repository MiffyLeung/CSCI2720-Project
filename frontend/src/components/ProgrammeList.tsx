// frontend/src/components/ProgrammeList.tsx

import React, { useState } from 'react';
import { Table } from 'react-bootstrap';
import { Programme } from '../types/Programme';
import ProgrammeInfo from './ProgrammeInfo';
import { useAuth } from '../core/AuthContext';

interface ProgrammeListProps {
  /**
   * List of programmes to display in the table.
   */
  programmes: Programme[];
  /**
   * Optional handler for editing a programme.
   */
  onEdit?: (programme: Programme) => void;
  /**
   * Optional handler for deleting a programme.
   */
  onDelete?: (programme: Programme) => void;
  /**
   * Optional handler for sorting by a specific field.
   */
  onSort?: (field: string) => void;
}

/**
 * ProgrammeList displays a list of programmes in a table format.
 * - Supports sorting and filtering functionalities.
 * - Admins can see "Edit" and "Delete" buttons for each row.
 * - Includes "Venue" and "Ranking" columns showing Likes and Comments.
 * - Clicking on a programme row opens a modal with its details.
 *
 * @component
 * @param {ProgrammeListProps} props - Props containing programme data and action handlers.
 * @returns {React.ReactElement} A table displaying the list of programmes.
 */
const ProgrammeList: React.FC<ProgrammeListProps> = ({
  programmes,
  onEdit,
  onDelete,
  onSort,
}) => {
  const { isAdmin } = useAuth();
  const [selectedProgramme, setSelectedProgramme] = useState<Programme | null>(null);

  /**
   * Opens the programme info modal for the selected programme.
   * @param {Programme} programme - The selected programme.
   */
  const handleRowClick = (programme: Programme) => {
    setSelectedProgramme(programme);
  };

  return (
    <div>
      {/* Table */}
      <Table striped bordered hover responsive>
        <thead className="table-success text-white text-center">
          <tr>
            <th onClick={() => onSort && onSort('title')} style={{ cursor: 'pointer' }}>
              Title
            </th>
            <th onClick={() => onSort && onSort('dateline')} style={{ cursor: 'pointer' }}>
              Date
            </th>
            <th onClick={() => onSort && onSort('presenter')} style={{ cursor: 'pointer' }}>
              Presenter
            </th>
            <th onClick={() => onSort && onSort('venue')} style={{ cursor: 'pointer' }}>
              Venue
            </th>
            <th onClick={() => onSort && onSort('ranking')} style={{ cursor: 'pointer' }}>
              Ranking
            </th>
            {isAdmin && (onEdit || onDelete) && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {programmes.map((programme) => (
            <tr
              key={programme.event_id}
              onClick={() => handleRowClick(programme)} // Row click handler
              style={{ cursor: 'pointer' }}
            >
              {/* Title column */}
              <td>{programme.title}</td>

              {/* Date column */}
              <td style={{ maxWidth: '180px' }}>{programme.dateline}</td>

              {/* Presenter column */}
              <td style={{ maxWidth: '180px' }}>{programme.presenter}</td>

              {/* Venue column */}
              <td className="text-center align-middle">
                {programme.venue?.name || 'N/A'}
              </td>

              {/* Ranking column */}
              <td className="text-center h4 align-middle" style={{ whiteSpace: 'pre-line' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                  <div>
                    <span className="fw-bold">{programme.likes}</span>{' '}
                    <span role="img" aria-label="likes">👍</span>
                  </div>
                </div>
              </td>

              {/* Actions */}
              {isAdmin && (onEdit || onDelete) && (
                <td className="text-center align-middle">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                    {onEdit && (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click
                          onEdit(programme);
                        }}
                      >
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click
                          onDelete(programme);
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
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
          show={true} // Add the required show prop
        />
      )}

    </div>
  );
};

export default ProgrammeList;
