import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { WishlistItem } from '../types/wishlist';

interface WishlistModalProps {
  item: WishlistItem | null;
  onSave: (data: Omit<WishlistItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({ item, onSave, onClose }) => {
  const [formData, setFormData] = useState<Omit<WishlistItem, 'id' | 'createdAt' | 'updatedAt'>>({
    title: '', price: 0, url: '', image: '', description: '', desiredDate: '', status: 'planned'
  });

  useEffect(() => {
    if (item) setFormData({ title: item.title, price: item.price, url: item.url || '', image: item.image || '', description: item.description || '', desiredDate: item.desiredDate || '', status: item.status });
  }, [item]);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setFormData({ ...formData, image: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.div className="modal-overlay" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <h2>{item ? 'Редактировать' : 'Добавить'} товар</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Название</label>
            <input className="input" type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Цена</label>
            <input className="input" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })} required />
          </div>
          <div className="form-group">
            <label>Ссылка</label>
            <input className="input" type="url" value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Изображение</label>
            <input type="file" accept="image/*" onChange={handleImage} />
            {formData.image && <img src={formData.image} alt="preview" style={{ width: '100%', marginTop: '1rem', borderRadius: '12px' }} />}
          </div>
          <div className="form-group">
            <label>Описание</label>
            <textarea className="textarea" rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Желаемая дата</label>
            <input className="input" type="date" value={formData.desiredDate} onChange={(e) => setFormData({ ...formData, desiredDate: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Статус</label>
            <select className="select" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}>
              <option value="planned">Планируется</option>
              <option value="purchased">Куплено</option>
              <option value="postponed">Отложено</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Сохранить</button>
            <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>Отмена</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};