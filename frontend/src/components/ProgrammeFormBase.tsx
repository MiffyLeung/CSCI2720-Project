// frontend/src/components/ProgrammeFormBase.tsx

import React, { useState } from 'react';
import { Programme, getDefaultProgramme } from '../types/Programme';

/**
 * Props for ProgrammeFormBase.
 */
interface ProgrammeFormBaseProps {
  initialData?: Programme; // Optional initial data for editing
  onSave: (data: Programme) => void; // Function to handle saving form data
  onCancel: () => void; // Function to cancel form editing
}

/**
 * A reusable form base component for creating or editing programmes.
 *
 * @param {ProgrammeFormBaseProps} props Component props
 * @returns React Component
 */
const ProgrammeFormBase: React.FC<ProgrammeFormBaseProps> = ({
  initialData,
  onSave,
  onCancel,
}) => {
  // Ensure formData is initialized correctly with all required Programme fields
  const [formData, setFormData] = useState<Programme>(
    initialData || getDefaultProgramme()
  );

  /**
   * Handles form input changes and updates state.
   * @param e React input change event
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Handle nested field (e.g., venue name)
    if (name.startsWith('venue.')) {
      const venueField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        venue: { ...prev.venue, [venueField]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  /**
   * Handles form submission and passes data to onSave callback.
   * @param e React form submission event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Event ID */}
      <div className="mb-3">
        <label className="form-label">Event ID</label>
        <input
          type="text"
          className="form-control"
          name="event_id"
          value={formData.event_id}
          onChange={handleChange}
          required
        />
      </div>

      {/* Title */}
      <div className="mb-3">
        <label className="form-label">Title</label>
        <input
          type="text"
          className="form-control"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      {/* Venue Name */}
      <div className="mb-3">
        <label className="form-label">Venue Name</label>
        <input
          type="text"
          className="form-control"
          name="venue.name"
          value={formData.venue.name}
          onChange={handleChange}
          required
        />
      </div>

      {/* Presenter */}
      <div className="mb-3">
        <label className="form-label">Presenter</label>
        <input
          type="text"
          className="form-control"
          name="presenter"
          value={formData.presenter}
          onChange={handleChange}
          required
        />
      </div>

      {/* Dateline */}
      <div className="mb-3">
        <label className="form-label">Dateline</label>
        <input
          type="text"
          className="form-control"
          name="dateline"
          value={formData.dateline}
          onChange={handleChange}
          required
        />
      </div>

      {/* Duration */}
      <div className="mb-3">
        <label className="form-label">Duration</label>
        <input
          type="text"
          className="form-control"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          required
        />
      </div>

      {/* Price */}
      <div className="mb-3">
        <label className="form-label">Price</label>
        <input
          type="text"
          className="form-control"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
        />
      </div>

      {/* Description */}
      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      {/* Save and Cancel Buttons */}
      <div className="d-flex justify-content-end">
        <button type="button" className="btn btn-secondary me-2" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </div>
    </form>
  );
};

export default ProgrammeFormBase;
