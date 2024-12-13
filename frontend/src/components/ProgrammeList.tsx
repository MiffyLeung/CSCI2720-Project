// frontend/src/components/ProgrammeList.tsx

import React from 'react';
import { Programme } from '../types/Programme'; // Use shared type

interface ProgrammeListProps {
  programmes: Programme[];
  onEdit: (programme: Programme) => void;
}

const ProgrammeList: React.FC<ProgrammeListProps> = ({ programmes, onEdit }) => {
  return (
    <table className="table table-striped">
      <thead className="table-dark">
        <tr>
          <th>Title</th>
          <th>Date Range</th>
          <th>Presenter</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {programmes.map((programme) => (
          <tr key={programme.event_id}>
            <td>{programme.title}</td>
            <td>{programme.dateline}</td>
            <td>{programme.presenter}</td>
            <td>
              <button className="btn btn-primary btn-sm" onClick={() => onEdit(programme)}>
                Edit
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProgrammeList;
