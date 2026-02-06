# Phase 1 — Quick Start

How to get everything running from a clean clone. Updated as features are completed.

**Completed features:** F0, F1, F2, F3, F4, F5, F6, F7

---

## 1. Prerequisites

- Node.js >= 20
- pnpm 9.x
- Docker & Docker Compose

## 2. Environment Setup

```bash
cp .env.example .env
cp apps/web/.env.example apps/web/.env
```

The root `.env` is used by the API (via `dotenv-cli`). The web app loads from `apps/web/.env` (Next.js built-in).

**Important:** `NEXTAUTH_SECRET` (in `apps/web/.env`) and `JWT_SECRET` (in root `.env`) must be the same value.

## 3. Install and Start Infrastructure (F0)

```bash
pnpm install
pnpm dev:infra
```

This starts PostgreSQL (port 5432) and Adminer (port 8080).

Verify: `http://localhost:8080` — log in with server `postgres`, user `postgres`, password `postgres`, database `workalaya`.

## 4. Build (F1, F2, F3)

```bash
pnpm --filter @workalaya/db db:push    # push Prisma schema to database
pnpm build                              # build all packages
```

Verify:
- `pnpm typecheck` — zero errors
- `pnpm lint` — zero errors

## 5. Start the API (F4)

```bash
pnpm --filter @workalaya/api dev
```

Verify (in another terminal):
```bash
# Health check — should return {"status":"ok"}
curl http://localhost:3001/api/health

# 404 handling — should return {"error":{"code":"NOT_FOUND","message":"Route not found"}}
curl http://localhost:3001/api/nonexistent

# CORS headers — look for access-control-allow-origin
curl -I -H "Origin: http://localhost:3000" http://localhost:3001/api/health
```

## 6. Start the Web App (F5)

```bash
pnpm --filter @workalaya/web dev
```

Verify:
- Navigate to http://localhost:3000
- Page displays "Workalaya" heading and styled buttons
- No console errors in browser
- Tailwind styles applied correctly

## 7. Authentication (F6)

With both API and web app running:

1. Navigate to http://localhost:3000/auth/signup — sign up with name, email, password
2. Redirected to login page — log in with the same credentials
3. Redirected to `/dashboard` — shows user name and logout button
4. Click logout — redirected to login page
5. Navigate to http://localhost:3000/dashboard while logged out — redirected to `/auth/login`

API auth verification:
```bash
# Health check — no auth required
curl http://localhost:3001/api/health

# Any other route — returns 401 without token
curl http://localhost:3001/api/projects

# Signup with existing email — returns 409
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"existing@example.com","password":"password123"}'
```

## 8. Stop Everything

```bash
# Stop web app: Ctrl+C in the dev terminal
# Stop API: Ctrl+C in the dev terminal

# Stop infrastructure
pnpm dev:infra:down
```

---

## Services Overview

| Service    | URL                      | Credentials              |
| ---------- | ------------------------ | ------------------------ |
| Web App    | http://localhost:3000     | —                        |
| API        | http://localhost:3001     | —                        |
| PostgreSQL | localhost:5432           | postgres / postgres      |
| Adminer    | http://localhost:8080     | (use PostgreSQL creds)   |
