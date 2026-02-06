# 📝 Заметки для разработчика

## Архитектура приложения

### Frontend (React + TypeScript)
- **App.tsx**: Главный компонент с бизнес-логикой
- **WishlistCard**: Отображение отдельного товара
- **WishlistModal**: Форма добавления/редактирования
- **FilterBar**: Панель фильтров и сортировки

### База данных (IndexedDB)
- **Dexie**: Обёртка над IndexedDB для удобной работы
- **Схема**: Одна таблица `items` с индексами
- **Реактивность**: useLiveQuery для автообновления UI

### Backend (Tauri)
- Минимальная настройка
- Разрешения для файловой системы (загрузка изображений)
- Разрешения для диалогов (выбор файлов)

## Важные паттерны

### Управление состоянием
```typescript
// Все состояние в App.tsx
const [items, setItems] = useState([]);
const [filters, setFilters] = useState({});
const [sortField, setSortField] = useState('createdAt');
```

### Работа с базой данных
```typescript
// Добавление
await db.items.add({ ...data, id: crypto.randomUUID() });

// Обновление
await db.items.update(id, data);

// Удаление
await db.items.delete(id);

// Чтение (реактивное)
const items = useLiveQuery(() => db.items.toArray());
```

### Загрузка изображений
```typescript
import { convertFileSrc } from '@tauri-apps/api/tauri';
import { open } from '@tauri-apps/api/dialog';

const selected = await open({
  filters: [{ name: 'Image', extensions: ['png', 'jpg'] }]
});

const imagePath = convertFileSrc(selected);
```

## Типизация

```typescript
// Основной тип данных
interface WishlistItem {
  id: string;
  title: string;
  price: number;
  url?: string;
  image?: string;
  description?: string;
  desiredDate?: string;
  status: 'planned' | 'purchased' | 'postponed';
  createdAt: string;
  updatedAt: string;
}
```

## Стилизация

### CSS переменные
```css
--primary: #ff6b35;           /* Основной цвет */
--primary-light: #ff8555;     /* Светлый вариант */
--glass-light: rgba(255, 255, 255, 0.7);  /* Стекло светлая тема */
--glass-dark: rgba(30, 30, 46, 0.7);      /* Стекло тёмная тема */
```

### Glassmorphism эффект
```css
.glass {
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  background-color: var(--glass-light);
  border: 1px solid var(--border-light);
  border-radius: 20px;
}
```

## Автоматическая тема

```typescript
useEffect(() => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handleChange = (e) => {
    setTheme(e.matches ? 'dark' : 'light');
    document.body.className = e.matches ? 'dark' : 'light';
  };

  handleChange(mediaQuery);
  mediaQuery.addEventListener('change', handleChange);
  
  return () => mediaQuery.removeEventListener('change', handleChange);
}, []);
```

## Советы по производительности

1. **useMemo для фильтрации**: Избегаем пересчётов при каждом рендере
```typescript
const filtered = useMemo(() => {
  return items.filter(/* фильтры */).sort(/* сортировка */);
}, [items, filters, sortField, sortOrder]);
```

2. **Оптимизация изображений**: Храним пути, а не base64
3. **Дебаунсинг поиска**: Используйте при добавлении поиска
4. **Виртуализация списка**: Для больших списков (>100 items)

## Расширение функционала

### Добавление категорий
```typescript
interface Category {
  id: string;
  name: string;
  color: string;
}

// Добавить в WishlistItem
categoryId?: string;
```

### Экспорт данных
```typescript
const exportData = async () => {
  const items = await db.items.toArray();
  const json = JSON.stringify(items, null, 2);
  // Использовать Tauri save dialog
};
```

### Уведомления о датах
```typescript
// Проверять desiredDate раз в день
setInterval(() => {
  const today = new Date();
  items.forEach(item => {
    if (item.desiredDate === today.toISOString().split('T')[0]) {
      // Показать уведомление
    }
  });
}, 86400000); // 24 часа
```

## Дебаг

### Просмотр IndexedDB
1. Открыть DevTools (Cmd+Option+I)
2. Application → IndexedDB → WishlistDB → items

### Логирование Tauri
```rust
// В main.rs
println!("Debug: {:?}", some_value);
```

### Проверка темы
```javascript
console.log(window.matchMedia('(prefers-color-scheme: dark)').matches);
```

## Частые ошибки

### Ошибка: "Failed to convert image"
- Проверьте формат файла
- Убедитесь, что путь правильный
- Используйте `convertFileSrc()`

### Ошибка: "Database access denied"
- Проверьте разрешения в tauri.conf.json
- Убедитесь, что Dexie инициализирован

### Тема не переключается
- Проверьте className на body
- Убедитесь, что CSS переменные определены

## Полезные команды

```bash
# Очистка кеша
rm -rf node_modules dist src-tauri/target
npm install

# Проверка типов
npx tsc --noEmit

# Линтинг
npm run lint

# Проверка сборки без упаковки
npm run build

# Логи Tauri
RUST_LOG=debug npm run tauri:dev
```

## Ресурсы

- [Tauri Docs](https://tauri.app/v1/guides/)
- [React Docs](https://react.dev/)
- [Dexie Docs](https://dexie.org/)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
