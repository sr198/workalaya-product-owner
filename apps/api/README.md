# @workalaya/api

Fastify API server for Workalaya.

## Prerequisites

- Node.js >= 20
- pnpm 9.x
- PostgreSQL running locally (default port 5432)

## Setup

### 1. Create the database

```bash
createdb workalaya
# or via psql:
# psql -c "CREATE DATABASE workalaya;"
```

### 2. Configure environment variables

Both the db package (for Prisma CLI) and the API need `DATABASE_URL`.

```bash
# packages/db/.env
cp packages/db/.env.example packages/db/.env
# Edit DATABASE_URL if your credentials differ from postgres:postgres

# apps/api/.env
cp apps/api/.env.example apps/api/.env
# Edit DATABASE_URL to match the same connection string
```

Default connection string: `postgresql://postgres:postgres@localhost:5432/workalaya?schema=public`

### 3. Run database migrations

```bash
# From project root
pnpm --filter @workalaya/db db:push
```

This creates all tables (User, Account, Session, VerificationToken, Project) from the Prisma schema.

### 4. Build dependency packages

```bash
pnpm --filter @workalaya/shared build
pnpm --filter @workalaya/db build
```

### 5. Start the API

```bash
# Development (with watch mode)
pnpm --filter @workalaya/api dev

# Production
pnpm --filter @workalaya/api build
pnpm --filter @workalaya/api start
```

The server starts on `http://localhost:3001` by default.

## Verification

```bash
# Health check
curl http://localhost:3001/api/health
# => {"status":"ok"}

# 404 handling
curl http://localhost:3001/api/nonexistent
# => {"error":{"code":"NOT_FOUND","message":"Route not found"}}

# CORS headers
curl -I -H "Origin: http://localhost:3000" http://localhost:3001/api/health
# Look for access-control-allow-origin header
```

## Environment Variables

| Variable      | Default                | Required | Description                |
| ------------- | ---------------------- | -------- | -------------------------- |
| `PORT`        | `3001`                 | No       | Server port                |
| `HOST`        | `0.0.0.0`             | No       | Server host                |
| `DATABASE_URL` | —                     | Yes      | PostgreSQL connection URL  |
| `CORS_ORIGIN` | `http://localhost:3000` | No      | Allowed CORS origin        |
| `LOG_LEVEL`   | `info`                 | No       | Pino log level             |
