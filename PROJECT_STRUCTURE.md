# 📁 Структура проекта Wishlist App

```
wishlist-app/
│
├── 📄 package.json                    # npm зависимости и скрипты
├── 📄 tsconfig.json                   # Конфигурация TypeScript
├── 📄 tsconfig.node.json             # TypeScript для Node.js
├── 📄 vite.config.ts                 # Конфигурация Vite
├── 📄 index.html                      # HTML точка входа
├── 📄 .gitignore                      # Git игнорирование
│
├── 📄 README.md                       # Полная документация
├── 📄 QUICKSTART.md                  # Быстрый старт
├── 📄 BUILD_INSTRUCTIONS.md          # Инструкции по сборке
├── 📄 DEV_NOTES.md                   # Заметки разработчика
├── 📄 ICONS.md                       # Генерация иконок
├── 📄 PROJECT_STRUCTURE.md           # Этот файл
├── 📄 check-requirements.sh          # Скрипт проверки требований
│
├── 📁 src/                           # Frontend исходники
│   ├── 📄 main.tsx                   # Точка входа React
│   ├── 📄 App.tsx                    # Главный компонент
│   ├── 📄 App.css                    # Стили главного компонента
│   ├── 📄 index.css                  # Глобальные стили
│   │
│   ├── 📁 components/                # React компоненты
│   │   ├── 📄 WishlistCard.tsx      # Карточка товара
│   │   ├── 📄 WishlistCard.css      # Стили карточки
│   │   ├── 📄 WishlistModal.tsx     # Модальное окно
│   │   ├── 📄 WishlistModal.css     # Стили модального окна
│   │   ├── 📄 FilterBar.tsx         # Панель фильтров
│   │   └── 📄 FilterBar.css         # Стили фильтров
│   │
│   ├── 📁 db/                        # База данных
│   │   └── 📄 database.ts           # Настройка Dexie (IndexedDB)
│   │
│   └── 📁 types/                     # TypeScript типы
│       └── 📄 wishlist.ts           # Типы данных
│
├── 📁 src-tauri/                     # Tauri (Rust) backend
│   ├── 📄 Cargo.toml                 # Зависимости Rust
│   ├── 📄 build.rs                   # Build скрипт Rust
│   ├── 📄 tauri.conf.json           # Конфигурация Tauri
│   │
│   ├── 📁 src/                       # Rust исходники
│   │   └── 📄 main.rs               # Главный файл Rust
│   │
│   └── 📁 icons/                     # Иконки приложения
│       ├── 🖼️ 32x32.png             # (генерируются через tauri icon)
│       ├── 🖼️ 128x128.png
│       ├── 🖼️ 128x128@2x.png
│       ├── 🖼️ icon.icns             # macOS иконка
│       └── 🖼️ icon.ico              # Windows иконка
│
├── 📁 node_modules/                  # npm пакеты (создаётся после npm install)
│
├── 📁 dist/                          # Собранный frontend (создаётся при сборке)
│
└── 📁 src-tauri/target/             # Собранный Rust (создаётся при сборке)
    └── 📁 release/
        └── 📁 bundle/
            └── 📁 macos/
                └── 🎁 Wishlist.app  # Готовое приложение!
```

## 🎯 Ключевые файлы

### Конфигурация
- `package.json` - Зависимости npm, скрипты для запуска
- `tsconfig.json` - Настройки TypeScript компилятора
- `vite.config.ts` - Настройки сборщика Vite
- `src-tauri/tauri.conf.json` - Настройки Tauri (размер окна, разрешения, иконки)

### Frontend (React + TypeScript)
- `src/main.tsx` - Рендерит React приложение в DOM
- `src/App.tsx` - Главный компонент с логикой и состоянием
- `src/components/` - Переиспользуемые UI компоненты
- `src/db/database.ts` - Настройка IndexedDB через Dexie
- `src/types/` - TypeScript интерфейсы и типы

### Backend (Rust)
- `src-tauri/src/main.rs` - Минимальный Rust код для Tauri
- `src-tauri/Cargo.toml` - Зависимости Rust

### Стили
- `src/index.css` - Глобальные стили, CSS переменные, glassmorphism
- `src/App.css` - Стили для главного компонента
- `src/components/*.css` - Стили для каждого компонента

## 📊 Потоки данных

```
User Action
    ↓
React Component
    ↓
State Update (App.tsx)
    ↓
Dexie/IndexedDB Operation
    ↓
useLiveQuery Hook
    ↓
Re-render Components
    ↓
Updated UI
```

## 🔄 Жизненный цикл компонента

```
App.tsx (main)
    ↓
    ├─→ FilterBar (фильтры и сортировка)
    │
    ├─→ WishlistGrid (сетка карточек)
    │   └─→ WishlistCard × N (каждый товар)
    │
    └─→ WishlistModal (добавление/редактирование)
```

## 💾 Схема базы данных

```
IndexedDB: WishlistDB
    └── Table: items
        ├── id (string, primary key)
        ├── title (string, indexed)
        ├── price (number, indexed)
        ├── url (string, optional)
        ├── image (string, optional)
        ├── description (string, optional)
        ├── desiredDate (string, indexed, optional)
        ├── status (string: 'planned' | 'purchased' | 'postponed', indexed)
        ├── createdAt (string, indexed)
        └── updatedAt (string)
```

## 🎨 CSS Архитектура

```
Global Styles (index.css)
    ├── CSS Variables (цвета, размеры)
    ├── Сброс стилей (reset)
    ├── Body стили (фон, шрифт)
    ├── Glassmorphism класс (.glass)
    └── Скроллбар стили

Component Styles
    ├── App.css (layout, header, grid)
    ├── WishlistCard.css (карточка товара)
    ├── WishlistModal.css (модальное окно)
    └── FilterBar.css (фильтры)
```

## 🔧 Процесс сборки

### Development Mode
```
npm run tauri:dev
    ↓
Vite запускает dev server (localhost:1420)
    ↓
Tauri компилирует Rust код
    ↓
Открывается окно приложения
    ↓
Hot reload для изменений в коде
```

### Production Build
```
npm run tauri:build
    ↓
Vite собирает оптимизированный frontend → dist/
    ↓
Tauri компилирует Rust в release режиме
    ↓
Создаётся .app бандл с frontend внутри
    ↓
Готовое приложение в src-tauri/target/release/bundle/macos/
```

## 📦 Размеры

- Исходники: ~50 KB
- node_modules: ~200 MB
- Собранный frontend (dist): ~500 KB
- Собранное приложение (.app): ~5-10 MB
- База данных (зависит от данных): ~1-100 MB

## 🚀 Точки расширения

### Добавить новый компонент
```
src/components/
    ├── NewComponent.tsx
    └── NewComponent.css
```

### Добавить новый тип данных
```
src/types/
    └── newType.ts
```

### Добавить новую таблицу в БД
```typescript
// src/db/database.ts
this.version(2).stores({
  items: '...',
  newTable: 'id, field1, field2'
});
```

### Добавить Rust команду
```rust
// src-tauri/src/main.rs
#[tauri::command]
fn my_command() -> String {
    "Hello from Rust!".into()
}
```

## 📱 Поддержка платформ

- ✅ macOS (основная платформа)
- 🔄 Windows (требует адаптация иконок)
- 🔄 Linux (требует адаптация иконок)

## 🔐 Безопасность

- ✅ Локальное хранилище (IndexedDB)
- ✅ Нет серверных запросов
- ✅ Sandboxed файловая система
- ✅ Разрешения только для нужных операций
- ✅ Нет аутентификации (не требуется)

---

Эта структура обеспечивает:
- 📦 Модульность (легко добавлять фичи)
- 🎨 Разделение concerns (UI, логика, данные)
- 🔧 Простоту поддержки
- 🚀 Быструю разработку
- ✨ Чистый код
