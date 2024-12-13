// frontend/src/components/AccountForm.tsx

import React, { useState } from 'react';
import { Account, accountFields, getDefaultAccount } from '../types/Account';

interface AccountFormProps {
  initialData?: Account;
  onSave: (data: Account) => void;
  onCancel: () => void;
}

const AccountForm: React.FC<AccountFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Account>(initialData || getDefaultAccount());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="needs-validation">
      {Object.keys(accountFields).map((fieldKey) => {
        const field = fieldKey as keyof Account;
        const fieldMeta = accountFields[field];
        return (
          <div key={field} className="mb-3">
            <label className="form-label">{fieldMeta.label}</label>
            {fieldMeta.type === 'select' ? (
              <select
                name={field}
                className="form-select"
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
                className="form-control"
                name={field}
                value={formData[field]}
                onChange={handleInputChange}
                required={fieldMeta.required}
              />
            )}
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

export default AccountForm;
