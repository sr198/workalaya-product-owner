# Phase 1: Foundation

## Goal

Establish a running monorepo with all package skeletons, database infrastructure, authentication, and working API/web application shells. At the end of this phase, a developer can clone the repo, run `pnpm install && pnpm dev`, and see a working authenticated web application backed by a Fastify API and PostgreSQL database.

## Success Criteria

- [ ] Monorepo builds and typechecks cleanly (`pnpm build && pnpm typecheck` — zero errors)
- [ ] `pnpm dev` starts both the Next.js web app and Fastify API concurrently
- [ ] PostgreSQL database connects, migrations run, schema matches Prisma models
- [ ] User can sign up, log in, and log out via the web UI
- [ ] Authenticated API requests include user identity; unauthenticated requests are rejected
- [ ] Health check endpoint (`GET /api/health`) returns 200
- [ ] All five packages resolve cross-references correctly
- [ ] AI provider package exports the interface and factory (no working providers yet)

## Scope

### In Scope

- pnpm workspace monorepo with TypeScript strict mode
- Package skeletons: `@workalaya/web`, `@workalaya/api`, `@workalaya/shared`, `@workalaya/db`, `@workalaya/ai-provider`
- ESLint + Prettier configuration
- Prisma schema with User, Account, Session models (NextAuth-compatible)
- Fastify server with plugin architecture, error handler, CORS, logging
- Next.js 15 App Router with Tailwind CSS + shadcn/ui
- NextAuth.js v5 with credentials provider (email/password)
- Protected routes and API authentication
- Development scripts (`dev`, `build`, `typecheck`, `lint`)
- Docker Compose for local dev services (PostgreSQL, Adminer)

### Out of Scope (Not This Phase)

- AI conversation logic (Phase 2)
- Project CRUD (Phase 2+)
- OAuth providers (can be added later, credentials-only for now)
- E2E tests (Playwright setup deferred to later phases)
- CI/CD pipeline
- Production Docker / deployment configuration
- Dark mode theming

## Features

| ID  | Feature                  | Depends On |
| --- | ------------------------ | ---------- |
| F0  | Dev Infrastructure       | —          |
| F1  | Monorepo & Tooling Setup | —          |
| F2  | Shared Package           | F1         |
| F3  | Database Package         | F0, F1, F2 |
| F4  | API Shell                | F1, F2, F3 |
| F5  | Web Shell                | F1, F2     |
| F6  | Authentication           | F3, F4, F5 |
| F7  | AI Provider Shell        | F1, F2     |

### Parallelization Opportunities

```
F0 ──────────────────┐
F1 → F2 → ┬─ F3 ──→ F4 ──→ F6
           ├─ F5 ──────────↗
           └─ F7 (independent)
```

F0 can run independently. After F2 completes, F3, F5, and F7 can run in parallel. F4 depends on F3. F6 depends on F3, F4, and F5.

## Phase Verification

After all features are complete:

1. `pnpm dev:infra` — PostgreSQL and Adminer start
2. `pnpm install` — clean install from scratch
3. `pnpm build` — all packages compile
4. `pnpm typecheck` — zero type errors
5. `pnpm lint` — zero lint errors
6. `pnpm dev` — API and web both start
7. Database migration runs successfully
8. Sign up → log in → access protected page → log out flow works
9. `GET /api/health` returns `{ "status": "ok" }`
10. Unauthenticated `GET /api/projects` returns 401
