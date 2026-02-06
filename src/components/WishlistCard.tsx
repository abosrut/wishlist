import React from 'react';
import { WishlistItem } from '../types/wishlist';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import './WishlistCard.css';

interface WishlistCardProps {
  item: WishlistItem;
  onEdit: (item: WishlistItem) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: WishlistItem['status']) => void;
}

export const WishlistCard: React.FC<WishlistCardProps> = ({ 
  item, 
  onEdit, 
  onDelete, 
  onStatusChange 
}) => {
  const statusLabels = {
    planned: 'Планируется',
    purchased: 'Куплено',
    postponed: 'Отложено'
  };

  const statusColors = {
    planned: 'var(--primary)',
    purchased: 'var(--success)',
    postponed: 'var(--warning)'
  };

  return (
    <div className="wishlist-card glass">
      {item.image && (
        <div className="card-image">
          <img src={item.image} alt={item.title} />
        </div>
      )}
      
      <div className="card-content">
        <div className="card-header">
          <h3 className="card-title">{item.title}</h3>
          <div 
            className="status-badge" 
            style={{ backgroundColor: statusColors[item.status] }}
          >
            {statusLabels[item.status]}
          </div>
        </div>

        <div className="card-price">
          {item.price.toLocaleString('ru-RU')} ₽
        </div>

        {item.description && (
          <p className="card-description">{item.description}</p>
        )}

        {item.desiredDate && (
          <div className="card-date">
            📅 {format(new Date(item.desiredDate), 'dd MMMM yyyy', { locale: ru })}
          </div>
        )}

        {item.url && (
          <a 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="card-link"
          >
            🔗 Ссылка на товар
          </a>
        )}

        <div className="card-actions">
          <select 
            className="status-select"
            value={item.status}
            onChange={(e) => onStatusChange(item.id, e.target.value as WishlistItem['status'])}
          >
            <option value="planned">Планируется</option>
            <option value="purchased">Куплено</option>
            <option value="postponed">Отложено</option>
          </select>

          <button 
            className="btn btn-secondary"
            onClick={() => onEdit(item)}
          >
            ✏️ Изменить
          </button>

          <button 
            className="btn btn-danger"
            onClick={() => onDelete(item.id)}
          >
            🗑️ Удалить
          </button>
        </div>
      </div>
    </div>
  );
};
