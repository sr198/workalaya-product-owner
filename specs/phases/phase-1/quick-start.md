# Phase 1 — Quick Start

How to get everything running from a clean clone. Updated as features are completed.

**Completed features:** F0, F1, F2, F3, F4

---

## 1. Prerequisites

- Node.js >= 20
- pnpm 9.x
- Docker & Docker Compose

## 2. Environment Setup

```bash
cp .env.example .env
```

The root `.env` is the single source of truth. All dev scripts load from it via `dotenv-cli`.

## 3. Start Infrastructure (F0)

```bash
pnpm dev:infra
```

This starts PostgreSQL (port 5432) and Adminer (port 8080).

Verify: `http://localhost:8080` — log in with server `postgres`, user `postgres`, password `postgres`, database `workalaya`.

## 4. Install & Build (F1, F2, F3)

```bash
pnpm install
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

## 6. Stop Everything

```bash
# Stop API: Ctrl+C in the dev terminal

# Stop infrastructure
pnpm dev:infra:down
```

---

## Services Overview

| Service    | URL                      | Credentials              |
| ---------- | ------------------------ | ------------------------ |
| API        | http://localhost:3001     | —                        |
| PostgreSQL | localhost:5432           | postgres / postgres      |
| Adminer    | http://localhost:8080     | (use PostgreSQL creds)   |
