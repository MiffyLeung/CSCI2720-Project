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
          <div key={fieldKey} className="mb-3">
            <label className="form-label">{fieldMeta.label}</label>
            <input
              type={fieldMeta.type}
              className="form-control"
              name={fieldKey}
              value={value as string | number}
              onChange={(e) => handleInputChange(fieldKey, e.target.value)}
              required={fieldMeta.required}
            />
          </div>
        );
      case 'textarea':
        return (
          <div key={fieldKey} className="mb-3">
            <label className="form-label">{fieldMeta.label}</label>
            <textarea
              className="form-control"
              name={fieldKey}
              value={value as string}
              onChange={(e) => handleInputChange(fieldKey, e.target.value)}
              required={fieldMeta.required}
            />
          </div>
        );
      case 'select':
        return (
          <div key={fieldKey} className="mb-3">
            <label className="form-label">{fieldMeta.label}</label>
            <select
              className="form-select"
              name={fieldKey}
              value={value as string}
              onChange={(e) => handleInputChange(fieldKey, e.target.value)}
              required={fieldMeta.required}
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
          <div key={fieldKey} className="mb-3">
            <label className="form-label">{fieldMeta.label}</label>
            <select
              className="form-select"
              multiple
              name={fieldKey}
              value={value as string[]}
              onChange={(e) =>
                handleInputChange(
                  fieldKey,
                  Array.from(e.target.selectedOptions, (opt) => opt.value)
                )
              }
              required={fieldMeta.required}
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
    <form onSubmit={handleSubmit} className="needs-validation">
      {Object.keys(programmeFields).map((fieldKey) =>
        renderField(fieldKey as keyof Programme)
      )}
      <div className="d-flex justify-content-end gap-2">
        <button type="submit" className="btn btn-primary">
          Save
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProgrammeForm;
