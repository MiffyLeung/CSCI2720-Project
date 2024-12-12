// frontend/src/types/Venue.ts

export interface Venue {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

export interface VenueField {
  label: string; // Field label for the form
  type: 'text' | 'number'; // Input type
  required?: boolean; // Is the field required
}

export const venueFields: Record<keyof Venue, VenueField> = {
  id: { label: 'ID', type: 'text', required: true },
  name: { label: 'Name', type: 'text', required: true },
  latitude: { label: 'Latitude', type: 'number' },
  longitude: { label: 'Longitude', type: 'number' },
};

export const getDefaultVenue = (): Venue => ({
  id: '',
  name: '',
  latitude: 0,
  longitude: 0,
});

export interface VenueMapProps {
  venues: Venue[];
}
