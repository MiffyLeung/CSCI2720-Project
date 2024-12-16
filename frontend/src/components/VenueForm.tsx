// frontend/src/components/VenueForm.tsx

import React, { useState } from 'react';
import { Venue, venueFields, getDefaultVenue } from '../types/Venue';

interface VenueFormProps {
  initialData?: Venue;
  onSave: (data: Venue) => void;
  onCancel: () => void;
}

const VenueForm: React.FC<VenueFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Venue>(initialData || getDefaultVenue());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'latitude' || name === 'longitude' ? +value : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="needs-validation">
      {Object.keys(venueFields).map((fieldKey) => {
        const field = fieldKey as keyof Venue;
        const fieldMeta = venueFields[field];
        return (
          <div key={field} className="mb-3">
            <label htmlFor={field} className="form-label">
              {fieldMeta.label}
            </label>
            <input
              id={field}
              type={fieldMeta.type}
              name={field}
              className="form-control"
              value={formData[field] || ''}
              onChange={handleInputChange}
              required={fieldMeta.required}
            />
          </div>
        );
      })}
      <div className="d-flex justify-content-end gap-2">
        <button type="submit" className="btn btn-success">
          Save
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default VenueForm;
