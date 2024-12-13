// frontend/src/components/ProgrammeInfo.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Programme } from '../types/Programme';

interface ProgrammeInfoProps {
  programme: Programme;
  onClose?: () => void; // Optional: For modals or additional interactions
}

const ProgrammeInfo: React.FC<ProgrammeInfoProps> = ({ programme, onClose }) => {
  return (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title">{programme.title}</h3>
        <p className="card-text">
          <strong>Presenter:</strong> {programme.presenter}
        </p>
        <p className="card-text">
          <strong>Date:</strong> {programme.dateline}
        </p>
        <p className="card-text">
          <strong>Venue:</strong> {programme.venue?.name || 'Not specified'}
        </p>
        {programme.description && (
          <p className="card-text">
            <strong>Description:</strong> {programme.description}
          </p>
        )}
        <Link to={`/programmes/${programme.event_id}`}>
          <button className="btn btn-primary">View Full Details</button>
        </Link>
        {onClose && (
          <button className="btn btn-danger ms-2" onClick={onClose}>
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default ProgrammeInfo;
