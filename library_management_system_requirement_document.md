# 📚 Library Management System - Requirement Document

## 1. Overview

This document defines the requirements for building a **Library Management System** with:

- Backend: Node.js + TypeORM + PostgreSQL
- Frontend: React 19 + Ant Design + Tailwind CSS

The system manages books and supports asynchronous notifications when a wishlisted book becomes available.

---

## 2. System Goals

- Manage book inventory with CRUD operations
- Enable efficient search and filtering
- Maintain wishlist for users
- Trigger async notifications on availability changes
- Provide simple UI for testing APIs

---

## 3. High-Level Architecture

```
Frontend (React)
        ↓
Backend API (Node.js)
        ↓
PostgreSQL Database
        ↓
Async Worker (Queue/Event-based)
```

---

## 4. Backend Requirements

### 4.1 Tech Stack

- Node.js (NestJS preferred or Express)
- TypeORM
- PostgreSQL
- Redis (optional for queue)
- BullMQ / RabbitMQ (recommended for async jobs)

---

## 5. Database Design

### 5.1 Books Table

| Field | Type | Constraints |
|------|------|------------|
| id | UUID | PK |
| title | TEXT | NOT NULL |
| author | TEXT | NOT NULL |
| isbn | VARCHAR | UNIQUE, NOT NULL |
| publishedYear | INT | VALID YEAR |
| availabilityStatus | ENUM | AVAILABLE / BORROWED |
| deleted | BOOLEAN | DEFAULT FALSE |
| createdAt | TIMESTAMP | |
| updatedAt | TIMESTAMP | |

---

### 5.2 Users Table

| Field | Type |
|------|------|
| id | UUID |
| name | TEXT |

---

### 5.3 Wishlist Table

| Field | Type |
|------|------|
| id | UUID |
| userId | FK |
| bookId | FK |
| createdAt | TIMESTAMP |

---

### 5.4 Notification Log Table

| Field | Type |
|------|------|
| id | UUID |
| userId | UUID |
| bookId | UUID |
| message | TEXT |
| createdAt | TIMESTAMP |

---

## 6. API Requirements

### 6.1 Create Book

POST /api/books

Request:
```
{
  "title": "string",
  "author": "string",
  "isbn": "string",
  "publishedYear": 2020
}
```

Validation:
- ISBN must be unique
- publishedYear must be valid

---

### 6.2 Get Books (Pagination + Filter)

GET /api/books?page=1&limit=10&author=abc&year=2020

Response:
```
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```

---

### 6.3 Search Books

GET /api/books/search?q=harry

- Partial match on title and author

---

### 6.4 Update Book

PUT /api/books/:id

Key behavior:
- If status changes from BORROWED → AVAILABLE
- Trigger async notification job

---

### 6.5 Delete Book (Soft Delete)

DELETE /api/books/:id

- Mark deleted = true

---

## 7. Wishlist APIs

### Add to Wishlist
POST /api/wishlist

### Get Wishlist by User
GET /api/wishlist/:userId

---

## 8. Asynchronous Notification Requirement

### Trigger Condition

When:
- Book status changes from BORROWED → AVAILABLE

### Flow

1. Publish event/job
2. Worker processes job
3. Fetch all wishlist users
4. Log notification

### Example Log

"Notification prepared for user_id: Book [Title] is now available"

---

## 9. Error Handling

- 400: Validation errors
- 404: Resource not found
- 409: Duplicate ISBN
- 500: Server errors

---

## 10. Indexing & Performance

- Index on ISBN (unique)
- Index on author
- Use trigram index for search

---

## 11. Frontend Requirements (React)

### 11.1 Pages

1. Book List Page
2. Add/Edit Book Form
3. Wishlist Page

---

### 11.2 Book List Features

- Table (Ant Design)
- Pagination
- Filters (author, year)
- Search bar
- Status toggle (Borrowed / Available)

---

### 11.3 Add/Edit Form

- Fields: title, author, isbn, year
- Validation

---

### 11.4 Wishlist UI

- Add book to wishlist
- View wishlist per user

---

### 11.5 Tech Details

- React 19
- Ant Design Table, Form, Input
- Tailwind for layout
- Axios for API calls

---

## 12. Non-Functional Requirements

- API response time < 200ms
- Async processing should not block API
- Scalable for large dataset

---

## 13. Suggested Folder Structure

### Backend

```
src/
 ├── modules/
 │    ├── books/
 │    ├── wishlist/
 │    ├── users/
 │    └── notifications/
 ├── common/
 ├── config/
 └── main.ts
```

### Frontend

```
src/
 ├── pages/
 ├── components/
 ├── services/
 ├── hooks/
 └── App.tsx
```

---

## 14. Future Enhancements

- Authentication (JWT)
- Email/SMS notifications
- Role-based access
- Book borrowing history

---

## 15. Acceptance Criteria

- All CRUD APIs working
- Search and pagination implemented
- No duplicate ISBN allowed
- Soft delete implemented
- Async notification working correctly
- UI able to test all APIs

---

## 16. Notes for Cursor AI

- Generate TypeORM entities from schema
- Use service-repository pattern
- Use DTO validation (class-validator)
- Use queue for async jobs
- Keep code modular and testable

---

✅ End of Document

