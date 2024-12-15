// frontend/src/components/ProgrammeList.tsx

import React from 'react';
import { Table } from 'react-bootstrap'; // Import Bootstrap Table component
import { Programme } from '../types/Programme'; // Use shared type

interface ProgrammeListProps {
  programmes: Programme[];
  onEdit: (programme: Programme) => void;
}

const ProgrammeList: React.FC<ProgrammeListProps> = ({ programmes, onEdit }) => {
  return (
    <div>
      <Table striped bordered hover responsive> {/* Bootstrap table with responsive behavior */}
        <thead className="table-success text-white"> {/* Bootstrap success color */}
          <tr>
            <th>Title</th>
            <th style={{
              width: '160px',
              maxWidth: '160px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              Date Range
            </th>
            <th>Presenter</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {programmes.map((programme) => (
            <tr key={programme.event_id}>
              <td>{programme.title}</td>
              <td style={{
                width: '150px',
                maxWidth: '150px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {programme.dateline}
              </td>
              <td>{programme.presenter}</td>
              <td>
                <button className="btn btn-primary btn-sm" onClick={() => onEdit(programme)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ProgrammeList;
