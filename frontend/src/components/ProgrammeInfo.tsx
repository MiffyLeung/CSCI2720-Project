// frontend/src/components/ProgrammeInfo.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Programme } from '../types/Programme';
import LikeButton from './LikeButton';
import Modal from './Modal'; // Reusing the Modal component
import './ProgrammeInfo.css'; // Import separate CSS file

interface ProgrammeInfoProps {
  programme: Programme;
  show: boolean;
  onClose: () => void;
}

const ProgrammeInfo: React.FC<ProgrammeInfoProps> = ({ programme, show, onClose }) => {
  return (
    <Modal
      title={programme.title}
      show={show}
      onClose={onClose}
      showFooter={false} // Hide footer buttons
    >
      <div className="programme-info">
        <p>
          <strong>Presenter:</strong> {programme.presenter}
        </p>
        <p>
          <strong>Date:</strong> {programme.dateline}
        </p>
        <p>
          <strong>Venue:</strong>{' '}
          {programme.venue ? (
            <span className="text-warning">{programme.venue.name}</span>
          ) : (
            <span className="text-muted">Not specified</span>
          )}
        </p>
        {programme.description && (
          <p className="programme-info-description">
            <strong>Description:</strong> {programme.description}
          </p>
        )}
        <div className="programme-info-actions">
          <Link to={`/programme/${programme.event_id}`}>
            <button className="btn btn-${isDarkMode ? 'secondary' : 'success'}">View Full Details</button>
          </Link>
          <LikeButton programmeId={programme.event_id} initialLikes={programme.likes} />
        </div>
      </div>
    </Modal>
  );
};

export default ProgrammeInfo;
