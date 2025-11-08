## AI Test Results Dashboard

Modern full-stack demo that showcases an AI-augmented testing platform. The system generates realistic mock runs, aggregates insights, and renders them through a polished Next.js dashboard with interactive charts, skeletons, and AI insight cards.

### Tech Stack
- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Recharts, lucide-react
- **Backend:** FastAPI, SQLAlchemy 2.0, Pydantic v2
- **Database:** PostgreSQL 15
- **Containerization:** Docker & Docker Compose

### Highlights
- Seeded suites plus 20–30 historical runs populated by a mock AI engine
- Rich dashboard with metric cards, trend lines, donut charts, and recent runs
- Detailed run view with expandable AI insight cards, stack traces, and filters
- Comprehensive test run listing with server-side filters, pagination, and search
- Responsive, dark-themed UI with gradients, glassmorphism, and smooth hover states

---

## Getting Started

### Prerequisites
- Docker 20+
- Docker Compose v2

### Environment Variables
Backend variables live in `backend/.env.example`:
```
DATABASE_URL=postgresql+psycopg2://postgres:postgres@postgres:5432/postgres
CORS_ORIGINS=http://localhost:3000
```

Frontend expects `NEXT_PUBLIC_API_URL` (set in `docker-compose.yml`).

### Run the full stack
```bash
docker-compose up --build
```
Services:
- `postgres` on `5432`
- `backend` on `8000` (FastAPI docs at `/docs`)
- `frontend` on `3000`

On first boot the backend creates tables, seeds suites, and generates historical data automatically.

---

## API Overview

| Endpoint | Description |
| --- | --- |
| `GET /api/test-runs` | Paginated runs with filtering by status, suite, date range, and search |
| `GET /api/test-runs/{id}` | Detailed run with all test cases and AI insights |
| `POST /api/test-runs` | Triggers a new mock run for a suite |
| `GET /api/test-suites` | Lists suites with latest run metadata |
| `GET /api/test-suites/{id}` | Suite detail plus recent history |
| `GET /api/dashboard/stats` | High-level metrics (pass rate, totals, averages) |
| `GET /api/dashboard/trends` | 7-day trend dataset for charts |

All responses follow the schemas in `backend/app/schemas.py`.

---

## Project Structure
```
backend/
  app/
    routers/ (FastAPI routers for runs, suites, dashboard)
    utils/mock_ai.py (AI-like generator & seeding helpers)
    models.py / schemas.py / crud.py
  requirements.txt
frontend/
  app/ (Next.js App Router pages)
  components/ (Metric cards, charts, tables, AI insight cards, etc.)
  lib/ (API client + shared types)
docker-compose.yml
README.md
```

---

## Development Notes
- Run `python3 -m compileall app` inside `backend/` to sanity-check syntax (already executed once).
- For local frontend work outside Docker, run `npm install` inside `frontend/`, then `npm run dev` with `NEXT_PUBLIC_API_URL=http://localhost:8000`.
- Placeholder screenshots can be added to `README.md` once UI captures are available.

Enjoy exploring the AI Test Results Dashboard!
