// frontend/src/components/ProgrammeCreateForm.tsx

import React from 'react';
import ProgrammeFormBase from './ProgrammeFormBase';
import { Programme } from '../types/Programme';

interface ProgrammeCreateFormProps {
  onSave: (data: Programme) => void; 
  onCancel: () => void; 
}

/**
 * ProgrammeCreateForm handles creating a new programme.
 */
const ProgrammeCreateForm: React.FC<ProgrammeCreateFormProps> = ({ onSave, onCancel }) => {
  return (
    <ProgrammeFormBase onSave={onSave} onCancel={onCancel} />
  );
};

export default ProgrammeCreateForm;
