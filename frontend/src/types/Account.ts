// frontend/src/types/Account.ts

export interface Account {
  _id: string;
  __v: number;
  username: string;
  password: string;
  role: string;
  favourites: string[];
}

export interface AccountField {
  label?: string; // Field label for display
  type: 'text' | 'select' | 'hidden'; // Input type
  placeholder?: string; // Placeholder text
  required?: boolean; // Indicates if the field is mandatory
  options?: string[]; // Options for select fields
}

export const accountFields: Record<keyof Account, AccountField> = {
  username: { label: 'Username', type: 'text', required: true },
  password: { label: 'New Password', type: 'text', placeholder: 'Keep it blank if no changes are needed.', required: false },
  role: { label: 'Role', type: 'select', required: true, options: ['admin', 'user', 'banned'] },
  _id: { type: 'hidden' },
  __v: { type: 'hidden' },
  favourites: { type: 'hidden' }
};

export const getDefaultAccount = (): Account => ({
  username: '',
  password: '',
  role: 'user',
  _id: "",
  __v: 0,
  favourites: []
});
