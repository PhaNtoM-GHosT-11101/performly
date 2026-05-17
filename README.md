# Performly

Performly is a multi-company B2B SaaS for goal setting, manager approval, locked performance reviews, quarterly check-ins, audit governance, Google authentication, and Razorpay billing.

## Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: FastAPI, Pydantic v2, SQLAlchemy, Alembic
- Database: PostgreSQL
- Local development: Docker Compose
- Email: Resend
- Payments: Razorpay
- Deployment target: Vercel frontend, Render backend/database

## Structure

```text
backend/   FastAPI API, database models, migrations, tests
frontend/  Next.js application
```

## Local Setup

Copy `.env.example` to `.env` and update values as needed.

Start PostgreSQL:

```bash
docker compose up -d postgres
```

Install and run the backend:

```bash
cd backend
python -m pip install -e ".[dev]"
uvicorn app.main:app --reload
```

Run database migrations and seed default plans:

```bash
cd backend
alembic upgrade head
python -m app.cli seed-plans
```

Run backend checks:

```bash
cd backend
python -m pytest
python -m ruff check .
```

Install and run the frontend:

```bash
cd frontend
npm install
npm run dev
```

Build the frontend:

```bash
cd frontend
npm run build
```

## Phase 1 Status

Completed:

- Monorepo structure
- PostgreSQL Docker Compose service
- FastAPI app factory and `/api/v1/health` endpoint
- Pydantic settings loader
- SQLAlchemy async session setup
- Alembic migration scaffold
- Initial tenant, user, billing, goal, and audit models
- Next.js TypeScript frontend shell
- Enterprise-minimal Performly landing page
- Login placeholder page
- Backend pytest and Ruff checks
- Frontend production build verification

## Phase 2 Status

Completed:

- Signed 30-day session token helper
- HttpOnly cookie plus bearer-token compatible auth foundation
- Current-principal dependency with active membership validation
- Role guard dependency
- Local-only mock company login endpoint
- `/api/v1/auth/me` endpoint
- `/api/v1/auth/logout` endpoint
- Company onboarding service that creates the first Admin/HR membership
- Automatic Starter trial subscription creation for new companies
- Default Starter, Growth, and Enterprise plan seeding service
- Admin-only invite creation endpoint
- 7-day invite expiry and hashed invite-token storage
- Phase 2 security and billing tests

## Phase 3 Status

Completed:

- Initial Alembic migration for the current PostgreSQL schema
- Stable lowercase PostgreSQL enum values for API/database consistency
- Bootstrap CLI command for default Starter, Growth, and Enterprise plans

Database bootstrap command:

```bash
cd backend
alembic upgrade head
python -m app.cli seed-plans
```

## Phase 4 Status

Completed:

- Frontend API client with credentialed requests
- Bearer-token fallback stored in local storage for local development
- Mock company login and onboarding form
- Role preview selection for Admin/HR, Manager, and Employee
- Dashboard page connected to `/api/v1/auth/me`
- Authenticated session summary on dashboard
- Role-specific dashboard preview cards
- Logout flow connected to `/api/v1/auth/logout`
- Public navigation link to dashboard

Local frontend flow:

```bash
cd backend
uvicorn app.main:app --reload
```

```bash
cd frontend
npm run dev
```

Open `http://localhost:3000/login`, create a mock workspace, then continue to `/dashboard`.
