// frontend/src/types/User.ts

export interface User {
  id: string;
  username: string;
  role: string;
}

export interface UserField {
  label: string; // Field label for display
  type: 'text' | 'select'; // Input type
  required?: boolean; // Indicates if the field is mandatory
  options?: string[]; // Options for select fields
}

export const userFields: Record<keyof User, UserField> = {
  id: { label: 'ID', type: 'text', required: true },
  username: { label: 'Username', type: 'text', required: true },
  role: { label: 'Role', type: 'select', required: true, options: ['admin', 'user'] },
};

export const getDefaultUser = (): User => ({
  id: '',
  username: '',
  role: '',
});
