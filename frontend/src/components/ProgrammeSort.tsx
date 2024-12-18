// frontend/src/components/ProgrammeSort.tsx

import React from 'react';
import { Programme } from '../types/Programme';

/**
 * Props for ProgrammeSort component.
 * @interface ProgrammeSortProps
 * @property {Function} onSortChange - Callback to handle sort field change.
 * @property {string} defaultField - The default selected field for sorting.
 */
interface ProgrammeSortProps {
  /**
   * Callback function triggered when sort field changes.
   * @param {(a: Programme, b: Programme) => number} sortFunction - The sorting function.
   */
  onSortChange: (sortFunction: (a: Programme, b: Programme) => number) => void;
  /**
   * Default selected field for sorting.
   */
  defaultField: string;
}

/**
 * ProgrammeSort component to handle sorting logic.
 * Renders a dropdown to select sorting field.
 *
 * @component
 */
const ProgrammeSort: React.FC<ProgrammeSortProps> = ({ onSortChange, defaultField }) => {
  /**
   * Returns the sorting function based on the selected field.
   * @param {string} field - The field to sort by.
   * @returns {(a: Programme, b: Programme) => number} - The sorting function.
   */
  const getSortFunction = (field: string) => {
    return (a: Programme, b: Programme): number => {
      let valueA: any;
      let valueB: any;

      if (field === 'likes') {
        valueA = a.likes || 0;
        valueB = b.likes || 0;
      } else if (field === 'submitdate') {
        valueA = a.submitdate || 0;
        valueB = b.submitdate || 0;
      } else if (field === 'title_asc') {
        // Ascending order for Title
        valueA = a.title.toLowerCase();
        valueB = b.title.toLowerCase();
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      } else if (field === 'title') {
        // Descending order for Title
        valueA = a.title.toLowerCase();
        valueB = b.title.toLowerCase();
        return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
      } else {
        valueA = a[field as keyof Programme];
        valueB = b[field as keyof Programme];
      }

      if (valueA == null) valueA = '';
      if (valueB == null) valueB = '';

      return valueB - valueA; // Default: descending order
    };
  };

  /**
   * Handles changes in the selected sort field.
   * @param {React.ChangeEvent<HTMLSelectElement>} e - The change event.
   */
  const handleSortFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortField = e.target.value;
    onSortChange(getSortFunction(sortField));
  };

  return (
    <div className="mb-1 d-flex gap-3">
      <div>
        <label htmlFor="sort-field" className="form-label fw-bold">Sort By:</label>
        <select
          id="sort-field"
          className="form-select"
          onChange={handleSortFieldChange}
          defaultValue={defaultField} // Set default field
        >
          <option value="title_asc">Title (ASC)</option>
          <option value="title">Title (DESC)</option>
          <option value="submitdate">Date</option>
          <option value="likes">Likes</option>
        </select>
      </div>
    </div>
  );
};

export default ProgrammeSort;
