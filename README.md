# Concert Ticket Reservation

A full-stack web application for managing free concert ticket reservations. Built with **Next.js** (frontend) and **NestJS** (backend).

## Architecture Overview

```
Browser (:3000)  -->  Next.js (App Router)  -->  NestJS REST API (:3001)  -->  PostgreSQL (:5432)
```

### Project Structure

```
├── frontend/          # Next.js 14+ with App Router & Tailwind CSS
├── backend/           # NestJS with TypeORM
├── docker-compose.yml # PostgreSQL + services
└── README.md
```

### Database Schema

- **users** — Admin and User roles (mock auth via role switching)
- **concerts** — Concert info (name, description, total_seats)
- **reservations** — Active reservations (UNIQUE per user+concert, deleted on cancel)
- **reservation_logs** — History log of all reserve/cancel actions

Two-table design for reservations: `reservations` tracks active state, `reservation_logs` tracks full history. This allows users to reserve → cancel → re-reserve without constraint conflicts.

### Key Design Decisions

- **Pessimistic locking** on concert row during reservation to prevent overselling
- **UNIQUE constraint** (user_id, concert_id) on reservations table enforces 1 seat per user
- **Role switching** via sidebar links (no auth system — mock users seeded)
- **Custom CSS + Tailwind** — custom CSS for cards, sidebar, stats, dialogs, animations; Tailwind for utility classes
- **Responsive** — hamburger sidebar on mobile, stacked layout for stats/cards

## Setup & Run Locally

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- PostgreSQL (via Docker or local)

### 1. Start PostgreSQL

```bash
docker compose up db -d
```

### 2. Backend

```bash
cd backend
npm install
npm run migration:run    # Create database tables
npm run seed             # Seed admin + user accounts
npm run start:dev        # Start on http://localhost:3001
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev              # Start on http://localhost:3000
```

### Using Docker Compose (all services)

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api

## Libraries & Their Role

### Backend

| Package | Role |
|---------|------|
| `@nestjs/core` | Application framework |
| `@nestjs/typeorm` + `typeorm` | ORM & database migrations |
| `pg` | PostgreSQL driver |
| `class-validator` + `class-transformer` | DTO validation (server-side) |
| `@nestjs/config` | Environment variable management |

### Frontend

| Package | Role |
|---------|------|
| `next` | React framework with App Router (SSR/SSG) |
| `tailwindcss` | Utility-first CSS framework |
| `react` / `react-dom` | UI library |

## Running Unit Tests

```bash
cd backend
npm test            # Run all tests
npm run test:cov    # Run with coverage report
```

Tests cover:
- **ConcertsController** — CRUD endpoints (create, list, delete, stats)
- **ConcertsService** — Business logic, edge cases
- **ReservationsController** — Reserve, cancel, history endpoints
- **ReservationsService** — Transaction logic, seat validation, conflict detection, cancel flow

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/concerts | List all concerts with reserved count |
| POST | /api/concerts | Create concert (admin) |
| DELETE | /api/concerts/:id | Delete concert (admin) |
| GET | /api/concerts/stats | Dashboard statistics |
| POST | /api/reservations | Reserve a seat |
| DELETE | /api/reservations/:id | Cancel reservation |
| GET | /api/reservations/user/:id | User's active reservations |
| GET | /api/reservation-logs | All reservation history (admin) |
| GET | /api/reservation-logs/user/:id | User's reservation history |

## Bonus: Optimization & Concurrency

### How to optimize for intensive data and high traffic?

1. **Database indexing** — Add indexes on frequently queried columns (concert_id, user_id)
2. **Pagination** — Implement cursor-based pagination for concert lists and history
3. **Caching** — Use Redis to cache concert list and stats (invalidate on write)
4. **CDN** — Serve static assets via CDN, use Next.js ISR for semi-static pages
5. **Connection pooling** — Use PgBouncer for database connection management
6. **Horizontal scaling** — Stateless API servers behind a load balancer

### How to handle concurrent reservations?

1. **Pessimistic locking** (current implementation) — Lock the concert row during reservation transaction to serialize access
2. **Database-level constraints** — UNIQUE constraint prevents duplicate reservations even if application logic fails
3. **Optimistic locking** (alternative) — Use version column, retry on conflict. Better throughput but more complex
4. **Queue-based** (for extreme scale) — Put reservation requests in a message queue (e.g., Bull/Redis), process sequentially per concert. Ensures fairness and prevents overselling under massive concurrent load
