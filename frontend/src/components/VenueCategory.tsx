// frontend/src/components/VenueCategory.tsx

import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

interface VenueCategoryProps {
  /**
   * Callback function triggered when a category is selected.
   * @param {string} category - The selected category.
   */
  onCategoryChange: (category: string) => void;
}

/**
 * VenueCategory component provides a dropdown for filtering venues by category.
 * Categories include Library, Auditorium, Hall, Room, Arena, Studio, Theatre, and Gallery.
 *
 * @component
 * @param {VenueCategoryProps} props - Props containing the callback for category selection.
 * @returns {React.ReactElement} A React-Bootstrap dropdown component for selecting categories.
 */
const VenueCategory: React.FC<VenueCategoryProps> = ({ onCategoryChange }) => {
  const categories = [
    'All Categories',
    'Library',
    'Auditorium',
    'Hall',
    'Room',
    'Arena',
    'Studio',
    'Theatre',
    'Gallery',
  ];

  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');

  /**
   * Handles changes to the category dropdown.
   * Updates the local state and triggers the callback function.
   * @param {React.ChangeEvent<HTMLSelectElement>} e - Event triggered when a category is selected.
   */
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);
    onCategoryChange(newCategory);
  };

  return (
    <div className="col-6 col-md-4 col-lg-3 col-xl-2 mb-3">
      <Form.Group controlId="venueCategory">
        <Form.Label className="fw-bold">Filter by Categories</Form.Label>
        <Form.Select value={selectedCategory} onChange={handleCategoryChange}>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
    </div>
  );
};

export default VenueCategory;
