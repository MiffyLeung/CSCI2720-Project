// frontend/src/components/VenueList.tsx

import React from 'react';
import { Table, Form } from 'react-bootstrap';
import { useApi } from '../core/useApi'; // Adjust the path as needed
import { Venue } from '../types/Venue'; // Adjust the path as needed

interface VenueListProps {
    venues: Venue[]; // Array of venues to display
    onEdit?: (venue?: Venue) => void; // Optional callback for editing a venue
}

const VenueList: React.FC<VenueListProps> = ({ venues, onEdit }) => {
    const apiRequest = useApi();

    const handleBookmarkToggle = async (venueId: string, isChecked: boolean) => {
        try {
            await apiRequest(`/venue/${venueId}/bookmark`, {
                method: 'PUT',
                body: JSON.stringify({ state: isChecked ? 'on' : 'off' }),
            });
            console.log(`Bookmark for venue ${venueId} updated to: ${isChecked ? 'on' : 'off'}`);
        } catch (error) {
            console.error('Error updating bookmark:', error);
        }
    };

    return (
        <Table striped bordered hover responsive>
            <thead>
                <tr className="table-success"> {/* Apply Bootstrap success color */}
                    <th>#</th>
                    <th>Location</th>
                    <th>Latitude</th>
                    <th>Longitude</th>
                    <th>Programmes on Air</th>
                    <th>Add to My Favourite</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {venues.map((venue, index) => (
                    <tr key={venue.id}>
                        <td>{index + 1}</td>
                        <td>
                            <a href={`/venue/${venue.id}`}>{venue.name}</a>
                        </td>
                        <td>{venue.latitude}</td>
                        <td>{venue.longitude}</td>
                        <td>{venue.programmes?.length || 0}</td>
                        <td>
                            <Form.Check
                                type="checkbox"
                                label=""
                                onChange={(e) => handleBookmarkToggle(venue.id, e.target.checked)}
                            />
                        </td>
                        <td>
                            {onEdit && (
                                <button
                                    className="btn btn-success btn-sm"
                                    onClick={() => onEdit(venue)}
                                >
                                    Edit
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default VenueList;
