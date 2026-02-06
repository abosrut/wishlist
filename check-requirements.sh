#!/bin/bash

echo "🔍 Проверка требований для Wishlist App..."
echo ""

# Проверка Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "✅ Node.js установлен: $NODE_VERSION"
    
    # Проверка версии (нужно v18+)
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$MAJOR_VERSION" -ge 18 ]; then
        echo "   Версия подходит (требуется v18+)"
    else
        echo "   ⚠️  Версия слишком старая. Требуется v18 или выше"
        echo "   Скачайте с https://nodejs.org"
    fi
else
    echo "❌ Node.js не установлен"
    echo "   Установите с https://nodejs.org или через Homebrew:"
    echo "   brew install node"
fi

echo ""

# Проверка npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo "✅ npm установлен: v$NPM_VERSION"
else
    echo "❌ npm не установлен (должен идти вместе с Node.js)"
fi

echo ""

# Проверка Rust
if command -v rustc &> /dev/null; then
    RUST_VERSION=$(rustc --version)
    echo "✅ Rust установлен: $RUST_VERSION"
else
    echo "❌ Rust не установлен"
    echo "   Установите через rustup:"
    echo "   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
fi

echo ""

# Проверка cargo
if command -v cargo &> /dev/null; then
    CARGO_VERSION=$(cargo --version)
    echo "✅ Cargo установлен: $CARGO_VERSION"
else
    echo "❌ Cargo не установлен (должен идти вместе с Rust)"
fi

echo ""

# Проверка Xcode Command Line Tools (только для macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    if xcode-select -p &> /dev/null; then
        XCODE_PATH=$(xcode-select -p)
        echo "✅ Xcode Command Line Tools установлены"
        echo "   Путь: $XCODE_PATH"
    else
        echo "❌ Xcode Command Line Tools не установлены"
        echo "   Установите командой: xcode-select --install"
    fi
else
    echo "ℹ️  Не macOS - пропускаем проверку Xcode"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Подсчёт выполненных требований
REQUIREMENTS_MET=0
TOTAL_REQUIREMENTS=3

command -v node &> /dev/null && ((REQUIREMENTS_MET++))
command -v rustc &> /dev/null && ((REQUIREMENTS_MET++))
if [[ "$OSTYPE" == "darwin"* ]]; then
    TOTAL_REQUIREMENTS=4
    xcode-select -p &> /dev/null && ((REQUIREMENTS_MET++))
fi

if [ $REQUIREMENTS_MET -eq $TOTAL_REQUIREMENTS ]; then
    echo "🎉 Все требования выполнены! Можно начинать."
    echo ""
    echo "Следующие шаги:"
    echo "1. npm install"
    echo "2. npm run tauri:dev"
else
    echo "⚠️  Выполнено $REQUIREMENTS_MET из $TOTAL_REQUIREMENTS требований"
    echo ""
    echo "Установите недостающие компоненты и запустите скрипт снова."
fi

echo ""
