// FILEPATH: frontend/src/components/VenueList.tsx

import React, { useState, useEffect } from 'react';
import { Table, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Film, Heart, HeartFill } from 'react-bootstrap-icons';
import VenueSort from '../components/VenueSort';
import VenueSearch from '../components/VenueSearch';
import VenueDistance from '../components/VenueDistance';
import VenueCategory from '../components/VenueCategory';
import ToastStack, { ToastMessage } from './ToastStack';
import { Venue } from '../types/Venue';
import { useApi } from '../core/useApi';

const DEFAULT_CENTER = {
  latitude: 22.4133574,
  longitude: 114.2104115,
};

const HONG_KONG_BOUNDS = {
  north: 22.559,
  south: 22.153,
  west: 113.837,
  east: 114.41,
};

interface VenueListProps {
  venues: Venue[];
  defaultField?: string;
  order?: 'asc' | 'desc';
  onEdit?: any;
  onDelete?: any;
}


/**
 * Calculate the distance between two coordinates using Haversine formula
 * @param {{ latitude: number; longitude: number }} coord1 - First coordinate
 * @param {{ latitude: number; longitude: number }} coord2 - Second coordinate
 * @returns {number} Distance in kilometers
 */
const calculateDistance = (
  coord1: { latitude: number; longitude: number },
  coord2: { latitude: number; longitude: number }
): number => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371; // Earth's radius in km
  const dLat = toRad(coord2.latitude - coord1.latitude);
  const dLon = toRad(coord2.longitude - coord1.longitude);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(coord1.latitude)) *
    Math.cos(toRad(coord2.latitude)) *
    Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

/**
 * VenueList Component - Displays a list of venues with filtering and sorting options
 * @param {{ venues: Venue[]; onEdit?: Function; onDelete?: Function }} props - Component props
 * @returns {JSX.Element} VenueList Component
 */
const VenueList: React.FC<VenueListProps> = ({
  venues,
  defaultField = 'favourite',
  order = 'asc',
  onEdit,
  onDelete,
}) => {
  const apiRequest = useApi();
  const navigate = useNavigate(); // To navigate to venue detail
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [distanceFilter, setDistanceFilter] = useState<number | null>(null);
  const [sortField, setSortField] = useState<string>(defaultField);
  const [sortOrder, setSortOrder] = useState<string>(order);
  const [userLocation, setUserLocation] = useState(DEFAULT_CENTER);
  const [toastMessages, setToastMessages] = useState<ToastMessage[]>([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation(
          latitude >= HONG_KONG_BOUNDS.south && latitude <= HONG_KONG_BOUNDS.north &&
            longitude >= HONG_KONG_BOUNDS.west && longitude <= HONG_KONG_BOUNDS.east
            ? position.coords
            : DEFAULT_CENTER
        );
      },
      () => setUserLocation(DEFAULT_CENTER)
    );
  }, []);

  useEffect(() => {
    let result = [...venues];

    if (searchQuery) {
      result = result.filter((venue) =>
        venue.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory && selectedCategory !== 'All Categories') {
      result = result.filter((venue) =>
        venue.name.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    if (distanceFilter) {
      result = result.filter((venue) => {
        if (!venue.latitude || !venue.longitude) return true; // Keep null coordinates
        const distance = calculateDistance(
          { latitude: venue.latitude, longitude: venue.longitude },
          userLocation
        );
        return distance <= distanceFilter;
      });
    }

    // Sort venues
    if (sortField) {
      result.sort((a, b) => {
        let comparison = 0;

        switch (sortField) {
          case 'distance': {
            const distanceA = calculateDistance(
              { latitude: a.latitude, longitude: a.longitude },
              userLocation
            );
            const distanceB = calculateDistance(
              { latitude: b.latitude, longitude: b.longitude },
              userLocation
            );
            comparison = distanceA - distanceB;
            break;
          }
          case 'programmes': {
            const progA = a.programmes?.length || 0;
            const progB = b.programmes?.length || 0;
            comparison = progA - progB;
            break;
          }
          case 'favourite': {
            comparison = Number(a.isFavourite) - Number(b.isFavourite);
            break;
          }
          default: {
            const valueA = a[sortField]?.toString().toLowerCase() || '';
            const valueB = b[sortField]?.toString().toLowerCase() || '';
            comparison = valueA.localeCompare(valueB);
            break;
          }
        }

        return sortOrder === 'asc' ? comparison : -comparison;
      });
    }

    setFilteredVenues(result);
  }, [venues, searchQuery, selectedCategory, distanceFilter, sortField, sortOrder, userLocation]);

  /**
   * Add a toast message to display
   * @param {string} text - Message to display
   */
  const addToast = (text: string) => {
    const newToast = { id: Date.now(), text };
    setToastMessages((prev) => [...prev, newToast]);
  };

  /**
   * Remove a toast message by ID
   * @param {number} id - ID of the toast to remove
   */
  const removeToast = (id: number) => {
    setToastMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  /**
   * Handle toggling of bookmarks for venues
   * @param {string} venueId - ID of the venue to toggle bookmark
   */
  const handleBookmarkToggle = async (venueId: string) => {
    try {
      const venue = filteredVenues.find((v) => v.venue_id === venueId);
      if (!venue) return;

      const updatedState = !venue.isFavourite;
      const method = updatedState ? 'POST' : 'DELETE';

      await apiRequest(`/venue/${venueId}/bookmark`, { method });

      setFilteredVenues((prev) =>
        prev.map((v) =>
          v.venue_id === venueId ? { ...v, isFavourite: updatedState } : v
        )
      );
      setToastMessages((prev) => [
        ...prev,
        { id: Date.now(), text: `Bookmark ${updatedState ? 'added' : 'removed'}` },
      ]);
    } catch {
      setToastMessages((prev) => [...prev, { id: Date.now(), text: 'Failed to update bookmark' }]);
    }
  };

  return (
    <div>
      <div className="d-flex row">
        <VenueSearch onSearch={setSearchQuery} />
        <VenueCategory onCategoryChange={setSelectedCategory} />
        <VenueDistance onFilter={setDistanceFilter} />
        <VenueSort onSortChange={(field, order) => {
          setSortField(field);
          setSortOrder(order);
        }} />
      </div>

      <Table striped bordered hover responsive>
        <thead className="table-success">
          <tr>
            <th>ID</th>
            <th>Venue</th>
            <th>Coordinates</th>
            <th>Programmes</th>
            <th>Favourite</th>
            {(onEdit || onDelete) && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredVenues.map((venue) => (
            <tr
              key={venue.venue_id}
              className="align-middle"
              style={{ transition: 'transform 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.01)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
              onClick={() => navigate(`/venue/${venue.venue_id}`)} // Navigate to venue detail
              role="button"
            >
              <td>{venue.venue_id}</td>
              <td>
                <Link to={`/venue/${venue.venue_id}`} className="text-decoration-none">
                  {venue.name}
                </Link>
              </td>
              <td>{`(${venue.latitude}, ${venue.longitude})`}</td>
              <td className="text-center text-primary h4">
                {venue.programmes?.length || 0}
                <Film className="ms-2" />
              </td>
              <td
                className="text-center h3 text-danger"
                role="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBookmarkToggle(venue.venue_id);
                }}
                style={{ cursor: 'pointer' }}
              >
                {venue.isFavourite ? (
                  <HeartFill />
                ) : (
                  <Heart />
                )}
              </td>
              {(onEdit || onDelete) && (
                <td>
                  {onEdit && (
                    <Button size="sm" variant="success" onClick={() => onEdit(venue)}>
                      Modify
                    </Button>
                  )}
                  {onDelete && (
                    <Button size="sm" variant="danger" onClick={() => onDelete(venue)}>
                      Delete
                    </Button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>

      <ToastStack messages={toastMessages} onRemove={(id) => setToastMessages((prev) => prev.filter((msg) => msg.id !== id))} />
    </div>
  );
};

export default VenueList;
