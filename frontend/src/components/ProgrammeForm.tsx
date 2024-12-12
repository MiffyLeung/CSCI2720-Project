// frontend/src/components/ProgrammeForm.tsx

import React, { useState } from 'react';
import { Programme, programmeFields, getDefaultProgramme } from '../types/Programme';

interface ProgrammeFormProps {
  initialData?: Programme;
  onSave: (data: Programme) => void;
  onCancel: () => void;
}

const ProgrammeForm: React.FC<ProgrammeFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Programme>(initialData || getDefaultProgramme());

  const handleInputChange = (field: keyof Programme, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const renderField = (fieldKey: keyof Programme) => {
    const fieldMeta = programmeFields[fieldKey];
    const value = formData[fieldKey];

    if (!fieldMeta) return null;

    switch (fieldMeta.type) {
      case 'text':
      case 'number':
        return (
          <div key={fieldKey}>
            <label>{fieldMeta.label}</label>
            <input
              type={fieldMeta.type}
              name={fieldKey}
              value={value as string}
              onChange={(e) => handleInputChange(fieldKey, e.target.value)}
              required
            />
          </div>
        );
      case 'textarea':
        return (
          <div key={fieldKey}>
            <label>{fieldMeta.label}</label>
            <textarea
              name={fieldKey}
              value={value as string}
              onChange={(e) => handleInputChange(fieldKey, e.target.value)}
              required
            />
          </div>
        );
      case 'select':
        return (
          <div key={fieldKey}>
            <label>{fieldMeta.label}</label>
            <select
              name={fieldKey}
              value={value as string}
              onChange={(e) => handleInputChange(fieldKey, e.target.value)}
              required
            >
              {fieldMeta.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );
      case 'multi-select':
        return (
          <div key={fieldKey}>
            <label>{fieldMeta.label}</label>
            <select
              multiple
              name={fieldKey}
              value={value as string[]}
              onChange={(e) =>
                handleInputChange(
                  fieldKey,
                  Array.from(e.target.selectedOptions, (opt) => opt.value)
                )
              }
              required
            >
              {fieldMeta.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );
      default:
        return null;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {Object.keys(programmeFields).map((fieldKey) =>
        renderField(fieldKey as keyof Programme)
      )}
      <div className="form-actions">
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProgrammeForm;
