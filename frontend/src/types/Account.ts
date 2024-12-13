// frontend/src/types/Account.ts

export interface Account {
  id: string;
  username: string;
  role: string;
}

export interface AccountField {
  label: string; // Field label for display
  type: 'text' | 'select'; // Input type
  required?: boolean; // Indicates if the field is mandatory
  options?: string[]; // Options for select fields
}

export const accountFields: Record<keyof Account, AccountField> = {
  id: { label: 'ID', type: 'text', required: true },
  username: { label: 'Username', type: 'text', required: true },
  role: { label: 'Role', type: 'select', required: true, options: ['admin', 'user'] },
};

export const getDefaultAccount = (): Account => ({
  id: '',
  username: '',
  role: '',
});
