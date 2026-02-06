# F4: API Shell

## Overview

Set up the `@workalaya/api` Fastify server with plugin architecture, CORS, structured logging, global error handler, database connection plugin, and a health check endpoint. This establishes the backend skeleton that all future API features build on.

## Dependencies

- **Requires:** F1 (Monorepo Setup), F2 (Shared Package), F3 (Database Package)
- **Packages:** fastify, @fastify/cors, @fastify/sensible, dotenv (or env loading via fastify-env)

## Acceptance Criteria

- [ ] `pnpm --filter @workalaya/api dev` starts the Fastify server on port 3001
- [ ] `GET /api/health` returns `{ "status": "ok" }` with 200
- [ ] CORS is configured to allow requests from the web app origin
- [ ] Structured JSON logging is enabled (Fastify's built-in pino logger)
- [ ] Global error handler maps typed errors to proper HTTP responses matching the ApiError format
- [ ] Database plugin connects Prisma client and makes it available via `fastify.prisma`
- [ ] Unhandled routes return 404 with proper error format
- [ ] Server gracefully shuts down on SIGTERM/SIGINT
- [ ] Package builds and typechecks cleanly

## Files to Create

| File                                    | Purpose                                                                             |
| --------------------------------------- | ----------------------------------------------------------------------------------- |
| `apps/api/src/server.ts`                | Fastify server creation, plugin registration, startup                               |
| `apps/api/src/plugins/cors.ts`          | CORS plugin configuration                                                           |
| `apps/api/src/plugins/database.ts`      | Prisma client plugin (decorates `fastify.prisma`)                                   |
| `apps/api/src/plugins/error-handler.ts` | Global error handler mapping typed errors → HTTP responses                          |
| `apps/api/src/routes/health.ts`         | Health check route (`GET /api/health`)                                              |
| `apps/api/src/lib/errors.ts`            | Typed error classes (NotFoundError, ValidationError, ForbiddenError, ConflictError) |
| `apps/api/src/lib/env.ts`               | Environment variable loading and validation                                         |
| `apps/api/.env.example`                 | Example environment variables                                                       |

## Files to Modify

| File                     | Change                                                   |
| ------------------------ | -------------------------------------------------------- |
| `apps/api/package.json`  | Add dependencies, scripts (dev, build, start)            |
| `apps/api/tsconfig.json` | Configure for Node.js execution (module, target, outDir) |

## Implementation Notes

- **Plugin registration order**: cors → database → error-handler → routes
- **Error handler pattern** (from `specs/architecture/patterns.md`):
  - Services throw typed errors: `NotFoundError`, `ValidationError`, `ForbiddenError`, `ConflictError`
  - Each error class has a `code` property matching the error codes from `@workalaya/shared`
  - The error handler plugin catches these and returns the standard `{ error: { code, message } }` shape
  - Unknown errors → 500 `INTERNAL_ERROR` (log full error, return generic message)
- **Database plugin**: Wraps `@workalaya/db`'s prisma client, decorates the Fastify instance, handles cleanup on shutdown
- **Env variables for Phase 1**:
  - `PORT` (default: 3001)
  - `HOST` (default: 0.0.0.0)
  - `DATABASE_URL` (required)
  - `CORS_ORIGIN` (default: http://localhost:3000)
  - `LOG_LEVEL` (default: info)
- **Dev script**: Use `tsx watch` for development (TypeScript execution with watch mode)
- **Build**: Compile to JavaScript with `tsc` for production
- Prefix all routes with `/api` — the health route is `GET /api/health`
- Do NOT add authentication middleware yet — that comes in F6

## Verification

1. `pnpm --filter @workalaya/api build` compiles without errors
2. `pnpm --filter @workalaya/api dev` starts server, logs "Server listening on port 3001"
3. `curl http://localhost:3001/api/health` returns `{"status":"ok"}` with 200
4. `curl http://localhost:3001/api/nonexistent` returns `{"error":{"code":"NOT_FOUND","message":"Route not found"}}` with 404
5. Verify CORS headers present in response for cross-origin requests
6. Check that logs are structured JSON format
