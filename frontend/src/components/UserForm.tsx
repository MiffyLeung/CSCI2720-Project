// frontend/src/components/UserForm.tsx

import React, { useState } from 'react';
import { User, userFields, getDefaultUser } from '../types/User'; // Use shared type and defaults

interface UserFormProps {
  initialData?: User;
  onSave: (data: User) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<User>(initialData || getDefaultUser());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      {Object.keys(userFields).map((fieldKey) => {
        const field = fieldKey as keyof User;
        const fieldMeta = userFields[field];
        return (
          <div key={field}>
            <label>{fieldMeta.label}</label>
            {fieldMeta.type === 'select' ? (
              <select
                name={field}
                value={formData[field]}
                onChange={handleInputChange}
                required={fieldMeta.required}
              >
                <option value="">Select {fieldMeta.label}</option>
                {fieldMeta.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={fieldMeta.type}
                name={field}
                value={formData[field]}
                onChange={handleInputChange}
                required={fieldMeta.required}
              />
            )}
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

export default UserForm;
