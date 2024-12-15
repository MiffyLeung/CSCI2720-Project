// frontend/src/components/ProgrammeEditForm.tsx

import React from 'react';
import { Programme } from '../types/Programme';
import ProgrammeFormBase from './ProgrammeFormBase';

interface ProgrammeEditFormProps {
  initialData: Programme; 
  onSave: (data: Programme) => void; 
  onCancel: () => void; 
}

/**
 * ProgrammeEditForm handles editing an existing programme.
 */
const ProgrammeEditForm: React.FC<ProgrammeEditFormProps> = ({ initialData, onSave, onCancel }) => {
  return (
    <ProgrammeFormBase initialData={initialData} onSave={onSave} onCancel={onCancel} />
  );
};

export default ProgrammeEditForm;
