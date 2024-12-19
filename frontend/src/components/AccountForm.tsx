import React, { useState } from 'react';
import { Form, Button, ButtonGroup, ToggleButton } from 'react-bootstrap';
import { Account, accountFields, getDefaultAccount } from '../types/Account';

interface AccountFormProps {
  initialData?: Account;
  onSave: (data: Account) => void;
  onCancel: () => void;
}

const AccountForm: React.FC<AccountFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Account>(initialData || getDefaultAccount());

  const handleInputChange = (field: keyof Account, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      {Object.keys(accountFields).map((fieldKey) => {
        const field = fieldKey as keyof Account;
        const fieldMeta = accountFields[field];
        return (
          <Form.Group key={field} className="mb-3">
            <Form.Label className='me-2'>{fieldMeta.label}</Form.Label>
            {fieldMeta.type === 'select' ? (
              <ButtonGroup>
                {fieldMeta.options?.map((option) => (
                  <ToggleButton
                    key={option}
                    id={`${field}-${option}`}
                    type="radio"
                    variant={formData[field] === option ? 'success' : 'outline-success'}
                    name={field}
                    value={option}
                    checked={formData[field] === option}
                    onChange={() => handleInputChange(field, option)}
                  >
                    {option}
                  </ToggleButton>
                ))}
              </ButtonGroup>
            ) : (
              <Form.Control
                type={fieldMeta.type}
                name={field}
                value={formData[field]}
                onChange={(e) => handleInputChange(field, e.target.value)}
                placeholder={fieldMeta.placeholder}
                required={fieldMeta.required}
              />
            )}
          </Form.Group>
        );
      })}
      <div className="d-flex justify-content-end gap-2">
        <Button type="submit" variant="success">
          Save
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </Form>
  );
};

export default AccountForm;
