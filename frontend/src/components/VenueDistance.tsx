// frontend/src/components/VenueDistance.tsx

import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import './VenueDistance.css';

interface VenueDistanceProps {
  /**
   * Callback function triggered when the distance filter changes.
   * @param {number} distance - The selected distance value in kilometers.
   */
  onFilter: (distance: number) => void;
}

/**
 * VenueDistance component provides a distance filter using a slider.
 * The selected distance value is displayed above the slider on the right side.
 *
 * @component
 * @param {VenueDistanceProps} props - Props containing the distance filter callback.
 * @returns {React.ReactElement} A React-Bootstrap slider component for filtering venues by distance.
 */
const VenueDistance: React.FC<VenueDistanceProps> = ({ onFilter }) => {
  const [distance, setDistance] = useState<number>(50); // Default distance is 10km

  /**
   * Handles changes to the slider value.
   * Updates the local state and triggers the filter callback.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Event triggered when the slider value changes.
   */
  const handleDistanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDistance = Number(e.target.value);
    setDistance(newDistance);
    onFilter(newDistance);
  };

  return (
    <div className="col-6 col-md-4 col-lg-3 col-xl-2 d-flex flex-column">
      <div>
        <span className="fw-bold">Filter by Distance</span>
      </div>
      <Form.Range
        className="form-range custom-range"
        min={1}
        max={50}
        step={1}
        value={distance}
        onChange={handleDistanceChange}
      />
      <span className="ms-auto fw-bold">
        {distance} km
      </span>
    </div>
  );
};

export default VenueDistance;
