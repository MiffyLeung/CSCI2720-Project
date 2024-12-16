// frontend/src/types/Programme.ts

import { Venue } from './Venue';
import { Comment } from './Comment';

export interface Programme {
  event_id: string;
  title: string;
  venue: Venue;
  presenter: string;
  type?: string;
  dateline: string;
  duration: string;
  price: string;
  description?: string;
  remarks?: string;
  enquiry?: string;
  eventUrl?: string;
  submitdate?: number; // Newly added field
  likes: number;
  comments: Comment[];
}

export interface ProgrammeField {
  label: string;
  type: 'text' | 'textarea' | 'select' | 'multi-select' | 'number';
  options?: string[];
  required?: boolean;
}

export const programmeFields: Record<keyof Programme, ProgrammeField> = {
  event_id: { label: 'Event ID', type: 'text', required: true },
  title: { label: 'Title', type: 'text', required: true },
  venue: { label: 'Venue', type: 'text', required: true },
  presenter: { label: 'Presenter', type: 'text', required: true },
  type: { label: 'Type', type: 'text' },
  dateline: { label: 'Dateline', type: 'text', required: true },
  duration: { label: 'Duration', type: 'text', required: true },
  price: { label: 'Price', type: 'text', required: true },
  description: { label: 'Description', type: 'textarea' },
  remarks: { label: 'Remarks', type: 'textarea' },
  enquiry: { label: 'Enquiry', type: 'text' },
  eventUrl: { label: 'Event URL', type: 'text' },
  submitdate: { label: 'Submit Date', type: 'number' }, // Newly added field
  likes: { label: 'Likes', type: 'number' },
  comments: { label: 'Comments', type: 'textarea' },
};

export const getDefaultProgramme = (): Programme => ({
  event_id: '',
  title: '',
  venue: { venue_id: '', name: '', latitude: 0, longitude: 0, programmes:[], isFavourite: false },
  presenter: '',
  type: '',
  dateline: '',
  duration: '',
  price: '',
  description: '',
  remarks: '',
  enquiry: '',
  eventUrl: '',
  submitdate: 0, // Default value for submitdate
  likes: 0,
  comments: [],
});
