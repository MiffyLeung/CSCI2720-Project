// frontend/src/components/VenueList.tsx

import React, { useState } from 'react';
import { Table, Form, Modal, Button } from 'react-bootstrap';
import { Venue } from '../types/Venue';
import VenueInfo from './VenueInfo'; // Adjust the path to match your project structure
import { useApi } from '../core/useApi';

interface VenueListProps {
  /**
   * List of venues to display in the table.
   */
  venues: Venue[];
  /**
   * Optional handler for editing a venue.
   */
  onEdit?: (venue?: Venue) => void;
  /**
   * Optional handler for deleting a venue.
   */
  onDelete?: (venue?: Venue) => void;
  /**
   * Optional handler for filtering venues based on distance from the user.
   */
  onFilter?: (distance: number) => void;
  /**
   * Optional handler for searching venues by text.
   */
  onSearch?: (query: string) => void;
  /**
   * Optional handler for sorting venues.
   */
  onSort?: (sortBy: 'favourite' | 'events' | 'distance') => void;
  /**
   * Default sorting field.
   */
  defaultSort?: 'favourite' | 'events' | 'distance';
}

/**
 * VenueList displays a list of venues in a table format.
 * - Supports displaying venue details, editing, deleting, filtering, searching, and sorting functionalities.
 * - Clicking on a row opens a modal with detailed venue information.
 * - Handles adding/removing favourite venues with immediate backend updates.
 *
 * @component
 * @param {VenueListProps} props - Props containing venue data and action handlers.
 * @returns {React.ReactElement} A table displaying the list of venues.
 */
const VenueList: React.FC<VenueListProps> = ({
  venues,
  onEdit,
  onDelete,
  onFilter,
  onSearch,
  onSort,
  defaultSort = 'favourite',
}) => {
  const apiRequest = useApi();
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  /**
   * Handles toggling the bookmark state of a venue.
   * Sends the update to the backend and handles any errors.
   * @param {string} venueId - The ID of the venue to toggle.
   * @param {boolean} isChecked - The new bookmark state.
   */
  const handleBookmarkToggle = async (venueId: string, isChecked: boolean) => {
    try {
      await apiRequest(`/venue/${venueId}/bookmark`, {
        method: 'PUT',
        body: JSON.stringify({ state: isChecked ? 'on' : 'off' }),
      });
      console.log(`Bookmark for venue ${venueId} updated to: ${isChecked ? 'on' : 'off'}`);
    } catch (error: any) {
      console.error('Error updating bookmark:', error);
      setWarningMessage('Failed to update bookmark. Please try again later.');
    }
  };

  /**
   * Opens the venue info modal for the selected venue.
   * @param {Venue} venue - The selected venue.
   */
  const handleRowClick = (venue: Venue) => {
    setSelectedVenue(venue);
  };

  return (
    <div>
      {/* Optional Warning Message */}
      {warningMessage && (
        <Modal show onHide={() => setWarningMessage(null)}>
          <Modal.Header closeButton>
            <Modal.Title>Warning</Modal.Title>
          </Modal.Header>
          <Modal.Body>{warningMessage}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setWarningMessage(null)}>
              OK
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr className="table-success">
            <th>ID</th>
            <th>Venue</th>
            <th>Coordinates</th>
            <th>Programmes</th>
            <th>Favourite</th>
            {(onEdit || onDelete) && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {venues.map((venue, index) => (
            <tr
              key={venue.venue_id}
              onClick={() => handleRowClick(venue)} // Row click handler
              style={{ cursor: 'pointer' }}
            >
              <td>{venue.venue_id}</td>
              <td>
                <a
                  href={`/venue/${venue.venue_id}`}
                  onClick={(e) => e.stopPropagation()} // Prevent row click
                >
                  {venue.name}
                </a>
              </td>
              <td>
                {venue.latitude && venue.longitude
                  ? `(${venue.latitude}, ${venue.longitude})`
                  : ''}
              </td>
              <td>{venue.programmes?.length || 0}</td>
              <td>
                <Form.Check
                  type="checkbox"
                  label=""
                  defaultChecked={venue.isFavourite}
                  onChange={(e) => {
                    e.stopPropagation(); // Prevent row click
                    handleBookmarkToggle(venue.venue_id, e.target.checked);
                  }}
                />
              </td>
              {(onEdit || onDelete) && (
                <td>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                    {onEdit && (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click
                          onEdit(venue);
                        }}
                      >
                        Modify
                      </button>
                    )}
                    {onDelete && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click
                          onDelete(venue);
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>

      {/* VenueInfo Modal */}
      {selectedVenue && (
        <VenueInfo
          venue={selectedVenue}
          onClose={() => setSelectedVenue(null)}
        />
      )}
    </div>
  );
};

export default VenueList;
