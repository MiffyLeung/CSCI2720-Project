import React, { useEffect, useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import './ToastStack.css';

export interface ToastMessage {
  id: number;
  text: string;
}

interface ToastStackProps {
  messages: ToastMessage[];
  onRemove: (id: number) => void; // Callback to remove toast
}

const ToastStack: React.FC<ToastStackProps> = ({ messages, onRemove }) => {
  const [visibleToasts, setVisibleToasts] = useState<ToastMessage[]>([]);
  const [removingToasts, setRemovingToasts] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Add new messages to the stack
    setVisibleToasts((prev) => [
      ...prev,
      ...messages.filter((msg) => !prev.some((toast) => toast.id === msg.id)),
    ]);
  }, [messages]);

  const handleClose = (id: number) => {
    setRemovingToasts((prev) => new Set(prev).add(id)); // Add to removing set
    setTimeout(() => {
      setVisibleToasts((prev) => prev.filter((toast) => toast.id !== id)); // Remove locally
      onRemove(id); // Notify parent
      setRemovingToasts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }, 500); // Delay matches the slide-out animation duration
  };

  return (
    <ToastContainer position="top-start" className="p-3" style={{ maxWidth: '400px' }}>
      {visibleToasts.map((toast) => (
        <Toast
          key={toast.id}
          autohide
          delay={5000}
          onClose={() => handleClose(toast.id)}
          className={`toast ${removingToasts.has(toast.id) ? 'toast-slide-out' : 'toast-slide-in'}`}
          style={{ marginBottom: '10px' }}
        >
          <Toast.Body className="d-flex justify-content-between align-items-center">
            <span>{toast.text}</span>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => handleClose(toast.id)}
            />
          </Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  );
};

export default ToastStack;
