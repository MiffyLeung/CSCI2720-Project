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
    <form onSubmit={handleSubmit} className="venue-form">
      {Object.keys(venueFields).map((fieldKey) => {
        const field = fieldKey as keyof Venue;
        const fieldMeta = venueFields[field];
        return (
          <div key={field}>
            <label>{fieldMeta.label}</label>
            <input
              type={fieldMeta.type}
              name={field}
              value={formData[field] || ''}
              onChange={handleInputChange}
              required={fieldMeta.required}
            />
          </div>
        );
      })}
      <div className="form-actions">
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default VenueForm;
