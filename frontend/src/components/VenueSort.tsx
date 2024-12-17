// frontend/src/components/VenueSort.tsx

import React, { useState, useEffect } from 'react';

interface VenueSortProps {
  onSortChange: (sortField: string, sortOrder: string) => void;
  defaultField?: string;
  defaultOrder?: string;
}

const VenueSort: React.FC<VenueSortProps> = ({
  onSortChange,
  defaultField = 'favourite',
  defaultOrder = 'desc',
}) => {
  const [sortField, setSortField] = useState<string>(defaultField);
  const [sortOrder, setSortOrder] = useState<string>(defaultOrder);

  useEffect(() => {
    onSortChange(sortField, sortOrder);
  }, [sortField, sortOrder, onSortChange]);

  const handleSortFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortField = e.target.value;
    setSortField(newSortField);
    onSortChange(newSortField, sortOrder);
  };

  const handleSortOrderToggle = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);
    onSortChange(sortField, newSortOrder);
  };

  return (
    <div className="col col-md-4 col-lg-3 col-xl-2 flex-column mb-3">
      <div className="d-flex">
        <label htmlFor="sort-field" className="form-label me-3 fw-bold">
          Sort By:
        </label>
        <div className="form-check form-switch ms-auto">
          <input
            className="form-check-input bg-success border-success"
            type="checkbox"
            id="sort-order"
            checked={sortOrder === 'desc'}
            onChange={handleSortOrderToggle}
          />
          <label htmlFor="sort-order" className="form-check-label">
            {sortField === 'favourite'
              ? sortOrder === 'desc'
                ? 'Yes'
                : 'No'
              : sortOrder === 'asc'
              ? 'Asc'
              : 'Desc'}
          </label>
        </div>
      </div>
      <div>
        <select
          id="sort-field"
          className="form-select"
          value={sortField}
          onChange={handleSortFieldChange}
          style={{ maxWidth: '200px' }}
        >
          <option value="name">Name</option>
          <option value="favourite">Favourite</option>
          <option value="programmes">Programmes</option>
          <option value="distance">Distance</option>
        </select>
      </div>
    </div>
  );
};

export default VenueSort;
