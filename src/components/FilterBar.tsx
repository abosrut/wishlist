import React from 'react';
import { FilterOptions, SortField, SortOrder } from '../types/wishlist';
import './FilterBar.css';

interface FilterBarProps {
  filters: FilterOptions;
  sortField: SortField;
  sortOrder: SortOrder;
  onFilterChange: (filters: FilterOptions) => void;
  onSortChange: (field: SortField, order: SortOrder) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  sortField,
  sortOrder,
  onFilterChange,
  onSortChange
}) => {
  const handleStatusToggle = (status: 'planned' | 'purchased' | 'postponed') => {
    const currentStatuses = filters.status || [];
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter(s => s !== status)
      : [...currentStatuses, status];
    
    onFilterChange({ ...filters, status: newStatuses.length ? newStatuses : undefined });
  };

  return (
    <div className="filter-bar glass">
      <div className="filter-section">
        <label>Статус:</label>
        <div className="status-filters">
          <button
            className={`status-chip ${!filters.status || filters.status.includes('planned') ? 'active' : ''}`}
            onClick={() => handleStatusToggle('planned')}
          >
            Планируется
          </button>
          <button
            className={`status-chip ${!filters.status || filters.status.includes('purchased') ? 'active' : ''}`}
            onClick={() => handleStatusToggle('purchased')}
          >
            Куплено
          </button>
          <button
            className={`status-chip ${!filters.status || filters.status.includes('postponed') ? 'active' : ''}`}
            onClick={() => handleStatusToggle('postponed')}
          >
            Отложено
          </button>
        </div>
      </div>

      <div className="filter-section">
        <label>Цена:</label>
        <div className="price-filters">
          <input
            type="number"
            placeholder="От"
            value={filters.minPrice || ''}
            onChange={(e) => onFilterChange({ 
              ...filters, 
              minPrice: e.target.value ? parseFloat(e.target.value) : undefined 
            })}
          />
          <span>—</span>
          <input
            type="number"
            placeholder="До"
            value={filters.maxPrice || ''}
            onChange={(e) => onFilterChange({ 
              ...filters, 
              maxPrice: e.target.value ? parseFloat(e.target.value) : undefined 
            })}
          />
        </div>
      </div>

      <div className="filter-section">
        <label>Сортировка:</label>
        <div className="sort-controls">
          <select
            value={sortField}
            onChange={(e) => onSortChange(e.target.value as SortField, sortOrder)}
          >
            <option value="createdAt">По дате добавления</option>
            <option value="title">По названию</option>
            <option value="price">По цене</option>
            <option value="desiredDate">По дате покупки</option>
          </select>
          <button
            className="sort-order-btn"
            onClick={() => onSortChange(sortField, sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? '⬆️' : '⬇️'}
          </button>
        </div>
      </div>
    </div>
  );
};
