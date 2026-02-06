# F0: Dev Infrastructure

## Overview

Docker Compose setup for local development services. Starts with PostgreSQL and Adminer. Additional services (Redis, MinIO, etc.) will be added in later phases as features require them.

## Dependencies

- **Requires:** None (foundational — all other features depend on this)

## Acceptance Criteria

- [ ] `docker compose up -d` starts PostgreSQL and Adminer
- [ ] PostgreSQL is accessible on `localhost:5432` with default credentials
- [ ] Adminer is accessible on `http://localhost:8080`
- [ ] Database `workalaya` is auto-created on first run
- [ ] Data persists across container restarts via named volume
- [ ] `pnpm dev:infra` is a convenience alias for starting services
- [ ] `pnpm dev:infra:down` stops services
- [ ] Connection strings in `.env.example` files match docker-compose defaults

## Files to Create

| File                  | Purpose                                        |
| --------------------- | ---------------------------------------------- |
| `docker-compose.yml`  | Service definitions for PostgreSQL and Adminer  |
| `.env.example`        | Root-level env with shared defaults for compose |

## Files to Modify

| File                         | Change                                          |
| ---------------------------- | ----------------------------------------------- |
| `package.json`               | Add `dev:infra` and `dev:infra:down` scripts    |
| `packages/db/.env.example`   | Align DATABASE_URL with docker-compose defaults  |
| `apps/api/.env.example`      | Align DATABASE_URL with docker-compose defaults  |

## Implementation Notes

- Use `postgres:16-alpine` image for small footprint
- Default credentials: `postgres:postgres`
- Database name: `workalaya`
- Use `POSTGRES_DB` env var to auto-create the database
- Named volume `workalaya-pgdata` for persistence
- Adminer on port 8080, no authentication needed for local dev
- Root `.env.example` holds compose variables; individual package `.env` files reference the same DATABASE_URL

## Verification

1. `docker compose up -d` — both containers start healthy
2. `psql postgresql://postgres:postgres@localhost:5432/workalaya` connects successfully
3. `http://localhost:8080` opens Adminer, can browse the `workalaya` database
4. `docker compose down && docker compose up -d` — data persists
5. `pnpm dev:infra` starts services, `pnpm dev:infra:down` stops them
