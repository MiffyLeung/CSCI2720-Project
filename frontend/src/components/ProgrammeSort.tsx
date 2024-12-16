// frontend/src/components/ProgrammeSort.tsx

import React from 'react';
import { Programme } from '../types/Programme';

/**
 * Props for ProgrammeSort component.
 * @interface ProgrammeSortProps
 * @property {Function} onSortChange - Callback to handle sort field and order changes.
 */
interface ProgrammeSortProps {
  onSortChange: (sortFunction: (a: Programme, b: Programme) => number) => void;
}

/**
 * ProgrammeSort component to handle sorting logic.
 * Provides dropdowns for sorting by field and order, and passes the sorting logic back to the parent.
 *
 * @component
 * @example
 * <ProgrammeSort onSortChange={(sortFunction) => handleSort(sortFunction)} />
 */
const ProgrammeSort: React.FC<ProgrammeSortProps> = ({ onSortChange }) => {
  /**
   * Returns the sorting function based on the selected field.
   *
   * @function getSortFunction
   * @param {string} field - The field to sort by.
   * @returns {(a: Programme, b: Programme) => number} - The sorting function.
   */
  const getSortFunction = (field: string) => {
    return (a: Programme, b: Programme): number => {
      let valueA: any;
      let valueB: any;

      if (field === 'likes') {
        // Sort by likes (descending)
        valueA = a.likes || 0;
        valueB = b.likes || 0;
      } else if (field === 'comments') {
        // Sort by comment count (descending)
        valueA = a.comments?.length || 0;
        valueB = b.comments?.length || 0;
      } else if (field === 'submitdate') {
        // Sort by submitdate (UNIX timestamp descending)
        valueA = a.submitdate || 0;
        valueB = b.submitdate || 0;
      } else {
        // Sort by generic field
        valueA = a[field as keyof Programme];
        valueB = b[field as keyof Programme];
      }

      // Handle undefined values
      if (valueA == null) valueA = '';
      if (valueB == null) valueB = '';

      // For "Title (ASC)", reverse the order for ascending sorting
      if (field === 'title_asc') {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      }

      // Default: descending order
      return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
    };
  };

  /**
   * Handles changes in the selected sort field.
   *
   * @function handleSortFieldChange
   * @param {React.ChangeEvent<HTMLSelectElement>} e - The change event.
   */
  const handleSortFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortField = e.target.value;
    onSortChange(getSortFunction(sortField));
  };

  return (
    <div className="mb-1 d-flex gap-3">
      <div>
        <label htmlFor="sort-field" className="form-label mb-0">Sort By:</label>
        <select
          id="sort-field"
          className="form-select"
          onChange={handleSortFieldChange}
        >
          <option value="title_asc">Title (ASC)</option>
          <option value="title">Title (DESC)</option>
          <option value="submitdate">Date</option>
          <option value="likes">Likes</option>
          <option value="comments">Comments</option>
        </select>
      </div>
    </div>
  );
};

export default ProgrammeSort;
