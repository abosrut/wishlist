import React, { useState, useEffect, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db/database';
import { WishlistItem, FilterOptions, SortField, SortOrder } from './types/wishlist';
import { WishlistCard } from './components/WishlistCard';
import { WishlistModal } from './components/WishlistModal';
import { FilterBar } from './components/FilterBar';
import './App.css';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WishlistItem | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Автоматическое определение системной темы
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setTheme(e.matches ? 'dark' : 'light');
      document.body.className = e.matches ? 'dark' : 'light';
    };

    handleChange(mediaQuery);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Загрузка всех товаров из базы данных
  const allItems = useLiveQuery(() => db.items.toArray()) || [];

  // Фильтрация и сортировка
  const filteredAndSortedItems = useMemo(() => {
    let result = [...allItems];

    // Фильтрация по статусу
    if (filters.status && filters.status.length > 0) {
      result = result.filter(item => filters.status!.includes(item.status));
    }

    // Фильтрация по цене
    if (filters.minPrice !== undefined) {
      result = result.filter(item => item.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      result = result.filter(item => item.price <= filters.maxPrice!);
    }

    // Фильтрация по дате
    if (filters.dateFrom) {
      result = result.filter(item => 
        item.desiredDate && item.desiredDate >= filters.dateFrom!
      );
    }
    if (filters.dateTo) {
      result = result.filter(item => 
        item.desiredDate && item.desiredDate <= filters.dateTo!
      );
    }

    // Сортировка
    result.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === 'title') {
        aVal = (aVal || '').toLowerCase();
        bVal = (bVal || '').toLowerCase();
      } else if (sortField === 'price') {
        aVal = aVal || 0;
        bVal = bVal || 0;
      } else {
        aVal = aVal || '';
        bVal = bVal || '';
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [allItems, filters, sortField, sortOrder]);

  const handleSaveItem = async (itemData: Omit<WishlistItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();

    if (editingItem) {
      await db.items.update(editingItem.id, {
        ...itemData,
        updatedAt: now
      });
    } else {
      await db.items.add({
        ...itemData,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now
      });
    }

    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleEditItem = (item: WishlistItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteItem = async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот товар?')) {
      await db.items.delete(id);
    }
  };

  const handleStatusChange = async (id: string, status: WishlistItem['status']) => {
    await db.items.update(id, { status, updatedAt: new Date().toISOString() });
  };

  const totalPrice = filteredAndSortedItems
    .filter(item => item.status === 'planned')
    .reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="app">
      <header className="header glass">
        <div className="header-content">
          <h1>🎯 Мой Wishlist</h1>
          <div className="header-stats">
            <div className="stat">
              <span className="stat-label">Товаров:</span>
              <span className="stat-value">{filteredAndSortedItems.length}</span>
            </div>
            <div className="stat">
              <span className="stat-label">На сумму:</span>
              <span className="stat-value">{totalPrice.toLocaleString('ru-RU')} ₽</span>
            </div>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingItem(null);
              setIsModalOpen(true);
            }}
          >
            ➕ Добавить товар
          </button>
        </div>
      </header>

      <main className="main-content">
        <FilterBar
          filters={filters}
          sortField={sortField}
          sortOrder={sortOrder}
          onFilterChange={setFilters}
          onSortChange={(field, order) => {
            setSortField(field);
            setSortOrder(order);
          }}
        />

        {filteredAndSortedItems.length === 0 ? (
          <div className="empty-state glass">
            <div className="empty-icon">🛍️</div>
            <h2>Список желаний пуст</h2>
            <p>Добавьте первый товар, чтобы начать!</p>
          </div>
        ) : (
          <div className="wishlist-grid">
            {filteredAndSortedItems.map(item => (
              <WishlistCard
                key={item.id}
                item={item}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </main>

      {isModalOpen && (
        <WishlistModal
          item={editingItem}
          onSave={handleSaveItem}
          onClose={() => {
            setIsModalOpen(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
}

export default App;
