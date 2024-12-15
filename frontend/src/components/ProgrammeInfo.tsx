// frontend/src/components/ProgrammeInfo.tsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Programme } from '../types/Programme';
import LikeButton from './LikeButton';

interface ProgrammeInfoProps {
  programme: Programme;
  onClose: () => void; // Close modal callback
}

const ProgrammeInfo: React.FC<ProgrammeInfoProps> = ({ programme, onClose }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Initialize theme from localStorage
    return localStorage.getItem('theme') === 'dark';
  });

  /**
   * Watches for localStorage changes to apply theme dynamically.
   */
  useEffect(() => {
    const handleThemeChange = () => {
      setIsDarkMode(localStorage.getItem('theme') === 'dark');
    };

    window.addEventListener('storage', handleThemeChange);
    return () => window.removeEventListener('storage', handleThemeChange);
  }, []);

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className={`modal-content ${isDarkMode ? 'bg-dark text-white' : 'bg-light text-dark'}`}>
          <div
            style={{
              position: 'absolute',
              background: '#a0d99ae6',
              margin: '-0.5rem',
              zIndex: '999',
              borderRadius: '50%',
              padding: '0.4rem',
              height: '2.25rem',
              right: '0'
            }}
          >
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>

          {/* Modal Body */}
          <div className="modal-body">
            <div className="card-body">
              <h3 className="card-title mb-3" style={{ wordBreak: 'break-word' }}>
                {programme.title}
              </h3>
              <hr />
              <p>
                <strong>Presenter:</strong> {programme.presenter}
              </p>
              <p>
                <strong>Date:</strong> {programme.dateline}
              </p>
              <p>
                <strong>Venue:</strong>{' '}
                {programme.venue?.name ? (
                  <span className="text-success">{programme.venue.name}</span>
                ) : (
                  <span className="text-muted">Not specified</span>
                )}
              </p>
              {programme.description && (
          <p
            className="card-text mb-3"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 8,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
                  <strong>Description:</strong> {programme.description}
          </p>
              )}
              <div className="d-flex justify-content-start mt-3">
                <Link to={`/programme/${programme.event_id}`}>
                  <button className={`btn btn-${isDarkMode ? 'secondary' : 'primary'}`}>
                    View Full Details
                  </button>
                </Link>
                <LikeButton programmeId={programme.event_id} initialLikes={programme.likes} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgrammeInfo;
