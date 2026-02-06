import React, { useState, useEffect } from 'react';
import { WishlistItem } from '../types/wishlist';
import { convertFileSrc } from '@tauri-apps/api/tauri';
import { open } from '@tauri-apps/api/dialog';
import './WishlistModal.css';

interface WishlistModalProps {
  item?: WishlistItem | null;
  onSave: (item: Omit<WishlistItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({ item, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    price: 0,
    url: '',
    image: '',
    description: '',
    desiredDate: '',
    status: 'planned' as WishlistItem['status']
  });

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title,
        price: item.price,
        url: item.url || '',
        image: item.image || '',
        description: item.description || '',
        desiredDate: item.desiredDate || '',
        status: item.status
      });
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleImageSelect = async () => {
    try {
      const selected = await open({
        multiple: false,
        filters: [{
          name: 'Image',
          extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp']
        }]
      });

      if (selected && typeof selected === 'string') {
        const imagePath = convertFileSrc(selected);
        setFormData({ ...formData, image: imagePath });
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{item ? 'Редактировать товар' : 'Добавить товар'}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Название *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Введите название товара"
            />
          </div>

          <div className="form-group">
            <label>Цена (₽) *</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.price || ''}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              placeholder="0"
            />
          </div>

          <div className="form-group">
            <label>Ссылка на товар</label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://example.com/product"
            />
          </div>

          <div className="form-group">
            <label>Изображение</label>
            <div className="image-upload">
              {formData.image && (
                <div className="image-preview">
                  <img src={formData.image} alt="Preview" />
                  <button
                    type="button"
                    className="remove-image"
                    onClick={() => setFormData({ ...formData, image: '' })}
                  >
                    ✕
                  </button>
                </div>
              )}
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleImageSelect}
              >
                {formData.image ? '📷 Изменить изображение' : '📷 Выбрать изображение'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Описание</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Добавьте описание товара"
            />
          </div>

          <div className="form-group">
            <label>Желаемая дата покупки</label>
            <input
              type="date"
              value={formData.desiredDate}
              onChange={(e) => setFormData({ ...formData, desiredDate: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Статус</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as WishlistItem['status'] })}
            >
              <option value="planned">Планируется</option>
              <option value="purchased">Куплено</option>
              <option value="postponed">Отложено</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn btn-primary">
              {item ? 'Сохранить' : 'Добавить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
