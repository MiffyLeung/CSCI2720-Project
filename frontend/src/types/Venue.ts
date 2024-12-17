// frontend/src/types/Venue.ts
import { Request, Response } from 'express';

/**
 * Venue interface matching the backend schema.
 */
export interface Venue {
  [key: string]: any;
  venue_id: string; // Unique identifier for the venue
  name: string; // Name of the venue
  latitude: number; // Latitude of the venue
  longitude: number; // Longitude of the venue
  programmes?: string[]; // Relative Programme IDs
  isFavourite: boolean;  // Bookmarked
}

/**
 * Interface for backend venue data structure.
 */
export interface BackendVenue {
  venue_id: string;
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  programmes?: string[];
  isFavourite?: boolean; 
}

/**
 * Structure for venue form fields.
 */
export interface VenueField {
  label?: string; // Field label for the form
  type?: 'text' | 'number'; // Input type
  required?: boolean; // Is the field required
}

/**
 * Metadata mapping for form fields.
 */
export const venueFields: Record<keyof Omit<Venue, 'programmes' | 'isFavourite'>, VenueField> & Partial<Record<'programmes' | 'isFavourite', VenueField>> = {
  venue_id: { label: 'ID', type: 'text', required: true },
  name: { label: 'Name', type: 'text', required: true },
  latitude: { label: 'Latitude', type: 'number' },
  longitude: { label: 'Longitude', type: 'number' },
};

/**
 * Deletes a venue by ID and returns an appropriate response.
 * @param req - Express request object.
 * @param res - Express response object.
 * @returns Response object with status and JSON data.
 */
export const deleteVenueById = (req: Request, res: Response): Response => {
  const deletedVenue = null; // Placeholder: Replace with actual deletion logic
  if (!deletedVenue) {
    const error = new Error('Venue not found');
    return res.status(404).json({
      code: 'VENUE_NOT_FOUND',
      message: 'Venue not found',
      debug: error.message, // Debug information
    });
  }
  return res.status(200).json({
    code: 'DELETE_VENUE_SUCCESS',
    message: 'Venue successfully deleted',
  });
};

/**
 * Transforms backend venue data to match the frontend Venue model.
 * @param backendVenue - Venue data received from the backend.
 * @returns Transformed Venue object.
 */
export const transformVenueFromBackend = (backendVenue: BackendVenue): Venue => ({
  venue_id: backendVenue.venue_id,
  name: backendVenue.name,
  latitude: backendVenue.coordinates?.latitude || 0,
  longitude: backendVenue.coordinates?.longitude || 0,
  programmes: backendVenue.programmes || [],
  isFavourite: false
});

/**
 * Converts a list of venues from the backend to the frontend model.
 * @param backendVenues - Array of venues from the backend.
 * @returns Array of transformed Venue objects.
 */
export const transformVenuesListFromBackend = (backendVenues: BackendVenue[]): Venue[] => {
  return backendVenues.map(transformVenueFromBackend);
};

/**
 * Provides a default Venue object.
 * @returns Default Venue object.
 */
export const getDefaultVenue = (): Venue => ({
  venue_id: '',
  name: '',
  latitude: 0,
  longitude: 0,
  programmes: [],
  isFavourite: false
});

/**
 * Props for components handling a list of venues.
 */
export interface VenueMapProps {
  venues: Venue[]; // Array of Venue objects
}

/**
 * Generates debug information from an error object.
 * @param error - Error object or message.
 * @returns Debug information as a string.
 */
export const generateDebugInfo = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};
