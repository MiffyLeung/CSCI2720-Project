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
        <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
            <h3>{programme.title}</h3>
            <p><strong>Presenter:</strong> {programme.presenter}</p>
            <p><strong>Date:</strong> {programme.dateline}</p>
            <p><strong>Venue:</strong> {programme.venue?.name}</p>
            {programme.description && (
                <p><strong>Description:</strong> {programme.description}</p>
            )}
            <Link to={`/programmes/${programme.event_id}`}>
                <button
                    style={{
                        padding: '5px 10px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    View Full Details
                </button>
            </Link>
            {onClose && (
                <button
                    onClick={onClose}
                    style={{
                        padding: '5px 10px',
                        backgroundColor: '#dc3545',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        marginLeft: '10px',
                        cursor: 'pointer',
                    }}
                >
                    Close
                </button>
            )}
        </div>
    );
};

export default ProgrammeInfo;
