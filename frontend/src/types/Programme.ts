// frontend/src/types/Programme.ts

import { Venue } from './Venue';
import { Comment } from './Comment';
import { Language } from './Language';

export interface Programme {
  event_id: string;
  title: string;
  venue: Venue;
  presenter: string;
  type?: string;
  languages: Language[];
  dateline: string;
  duration: string;
  price: string;
  description?: string;
  remarks?: string;
  enquiry?: string;
  eventUrl?: string;
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
  languages: { label: 'Languages', type: 'multi-select', options: ['English', 'Chinese', 'Japanese'] },
  dateline: { label: 'Dateline', type: 'text', required: true },
  duration: { label: 'Duration', type: 'text', required: true },
  price: { label: 'Price', type: 'text', required: true },
  description: { label: 'Description', type: 'textarea' },
  remarks: { label: 'Remarks', type: 'textarea' },
  enquiry: { label: 'Enquiry', type: 'text' },
  eventUrl: { label: 'Event URL', type: 'text' },
  likes: { label: 'Likes', type: 'number' },
  comments: { label: 'Comments', type: 'textarea' },
};

export const getDefaultProgramme = (): Programme => ({
  event_id: '',
  title: '',
  venue: { id: '', name: '', latitude: 0, longitude: 0 },
  presenter: '',
  type: '',
  languages: [],
  dateline: '',
  duration: '',
  price: '',
  description: '',
  remarks: '',
  enquiry: '',
  eventUrl: '',
  likes: 0,
  comments: [],
});
