# Book Store (Library Management System)

This repository contains:

- `backend`: NestJS + PostgreSQL + Redis API
- `frontend`: React + Vite web app

## Prerequisites

Install the following before setup:

- Node.js 20+ (LTS recommended)
- npm 10+
- PostgreSQL 14+ (or compatible)
- Redis 7+ (or compatible)

## Project Structure

- `backend` - REST API, business logic, queue jobs
- `frontend` - client application

## 1) Backend Setup

### Install dependencies

```bash
cd backend
npm install
```

### Environment variables

Create or update `backend/.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=library_db
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
PORT=3000
```

### Environment variable reference

- `DB_HOST`: PostgreSQL host
- `DB_PORT`: PostgreSQL port
- `DB_USERNAME`: PostgreSQL username
- `DB_PASSWORD`: PostgreSQL password
- `DB_NAME`: PostgreSQL database name
- `REDIS_HOST`: Redis host
- `REDIS_PORT`: Redis port
- `PORT`: Backend API port (default `3000`)

### Start backend

```bash
# development
npm run start:dev

# production build + run
npm run build
npm run start:prod
```

Backend runs at `http://localhost:3000` by default.

## 2) Frontend Setup

### Install dependencies

```bash
cd frontend
npm install
```

### Environment variables

Create `frontend/.env` (optional):

```env
VITE_API_URL=http://localhost:3000
```

If `VITE_API_URL` is not set, the frontend already falls back to `http://localhost:3000`.

### Start frontend

```bash
npm run dev
```

Frontend runs on the Vite URL shown in terminal (usually `http://localhost:5173`).

## 3) Run Full Project Locally

Use two terminals:

1. Terminal 1:
   ```bash
   cd backend
   npm run start:dev
   ```
2. Terminal 2:
   ```bash
   cd frontend
   npm run dev
   ```

Then open the frontend URL in your browser.

## Database and Redis Notes

- Ensure PostgreSQL is running and `DB_NAME` exists.
- Ensure Redis is running before starting backend.
- This backend uses TypeORM with `synchronize: true`, which is convenient for local development but should be used carefully in production.

## Useful Commands

### Backend

```bash
cd backend
npm run lint
npm run test
npm run test:e2e
npm run test:cov
```

### Frontend

```bash
cd frontend
npm run build
npm run preview
```

## Troubleshooting

- **Backend fails to start**: verify `.env` values, PostgreSQL connection, and Redis availability.
- **Frontend cannot call API**: confirm `VITE_API_URL` points to backend and backend CORS is enabled.
- **Port conflicts**: change `PORT` for backend or Vite dev port settings if needed.
