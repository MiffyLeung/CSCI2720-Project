import React from 'react';
import './Modal.css'; // Custom styles for modal

interface ModalProps {
  title: string;
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
  onSave?: () => void; // Optional Save callback
  showFooter?: boolean; // Add this prop to toggle footer buttons
}

/**
 * A reusable modal component with support for dark mode.
 * @param {ModalProps} props - The modal configuration.
 * @returns {React.ReactElement} A styled modal.
 */
const Modal: React.FC<ModalProps> = ({
  title,
  show,
  onClose,
  children,
  onSave,
  showFooter = true, // Default: Show footer
}) => {
  if (!show) return null;

  /**
   * Handle click on the modal background.
   * Close the modal only if the click is outside the modal content.
   */
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose(); // Trigger onClose when clicking the background
    }
  };

  return (
    <div
      className="modal fade show d-flex justify-content-center align-items-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={handleBackgroundClick} // Attach the event handler
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body">{children}</div>

          {/* Conditional Footer */}
          {showFooter && (
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              {onSave && (
                <button className="btn btn-success" onClick={onSave}>
                  Save
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
