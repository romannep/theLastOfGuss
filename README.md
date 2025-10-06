# The Last of Guss

Игра-кликер с бэкенд и фронтэнд частями.

## Структура проекта

- **Backend**: NestJS + TypeScript + Sequelize + PostgreSQL
- **Frontend**: React + TypeScript + Vite (будет добавлен позже)

## Установка и запуск

### Требования
- Node.js 18+
- PostgreSQL 12+

### Настройка базы данных

1. Создайте базу данных PostgreSQL:
```sql
CREATE DATABASE the_last_of_guss;
```

2. Скопируйте файл конфигурации:
```bash
cp env.example .env
```

3. Отредактируйте `.env` файл с вашими настройками базы данных:
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=the_last_of_guss
```

### Установка зависимостей

```bash
npm install
```

### Запуск в режиме разработки

```bash
npm run start:dev
```

### Сборка и запуск в продакшене

```bash
npm run build
npm run start:prod
```

## Инициализация базы данных

При первом запуске сервер автоматически:
1. Проверит существование таблицы `users`
2. Если таблица отсутствует, создаст все необходимые таблицы:
   - `users` (login, password_hash, role)
   - `rounds` (uuid, start_datetime, end_datetime, status, score)
   - `scores` (user, round, score)
3. Создаст начальных пользователей:
   - roma / roma (user)
   - alisa / alisa (user)
   - admin / admin (admin)

## API

Сервер запускается на порту 3000 (по умолчанию).

## Время разработки
- 1 час: Анализ задачи, проектирование решения, создание проекта