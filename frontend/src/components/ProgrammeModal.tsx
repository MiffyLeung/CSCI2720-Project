// frontend/src/components/ProgrammeModal.tsx

import React from 'react';
import { Programme } from '../types/Programme';
import ProgrammeEditForm from './ProgrammeEditForm';
import ProgrammeCreateForm from './ProgrammeCreateForm';

/**
 * Props for ProgrammeModal component.
 * @interface ProgrammeModalProps
 * @property {boolean} isOpen - Whether the modal is open.
 * @property {Programme | undefined} programme - The programme being edited (undefined for creating).
 * @property {Function} onSave - Callback to save the programme.
 * @property {Function} onClose - Callback to close the modal.
 */
interface ProgrammeModalProps {
  isOpen: boolean;
  programme?: Programme;
  onSave: (data: Programme) => void;
  onClose: () => void;
}

/**
 * ProgrammeModal component to display the create/edit form in a modal.
 *
 * @component
 */
const ProgrammeModal: React.FC<ProgrammeModalProps> = ({ isOpen, programme, onSave, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {programme ? 'Edit Programme' : 'Add Programme'}
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {programme ? (
              <ProgrammeEditForm
                initialData={programme}
                onSave={onSave}
                onCancel={onClose}
              />
            ) : (
              <ProgrammeCreateForm
                onSave={onSave}
                onCancel={onClose}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgrammeModal;
