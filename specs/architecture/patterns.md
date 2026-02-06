# Design Patterns & Conventions

## Architecture Patterns

### Backend (Fastify)

**Plugin-based architecture**

- Every cross-cutting concern (auth, db, websocket) is a Fastify plugin
- Routes are registered as plugins with a shared prefix
- Services contain business logic; routes handle HTTP concerns only

**Route → Service → DB layering**

```
Route (HTTP/WS)  →  Service (business logic)  →  Prisma (data access)
     ↓                      ↓
  Validation (Zod)    AI Provider (when needed)
```

- Routes: Parse input, validate with Zod, call service, return response
- Services: Business logic, orchestration, no HTTP concepts
- DB: Prisma client only, accessed via service layer

**Error handling**

- Services throw typed errors (e.g., `NotFoundError`, `ValidationError`)
- A global error handler in Fastify maps these to HTTP status codes
- No try/catch in routes unless handling a specific recovery case

### Frontend (Next.js)

**App Router conventions**

- Server Components by default; `"use client"` only when needed
- Data fetching in Server Components or via React Query in client components
- Route groups for layout organization

**Component hierarchy**

```
app/            → Pages (routing, layout, data fetching)
components/ui/  → Primitives (shadcn/ui, no business logic)
components/*/   → Feature components (domain-specific)
hooks/          → Custom hooks (data fetching, state)
lib/            → Utilities (API client, auth, helpers)
providers/      → Context providers (session, theme, etc.)
```

**State management**

- Server state: React Query (TanStack Query)
- UI state: React useState/useReducer, kept local
- No global state library unless complexity demands it

### Shared Package

**Types mirror the domain, not the database**

- Shared types represent domain concepts
- Prisma types stay in `@workalaya/db`
- Mapping between Prisma models and domain types happens in the service layer

**Zod schemas are the source of truth for validation**

- Define once in `@workalaya/shared`
- Used in backend route validation AND frontend form validation
- TypeScript types derived from Zod schemas via `z.infer<>`

### AI Provider

**Adapter pattern**

- Common `AIProvider` interface for all providers
- Factory function selects provider based on configuration
- Streaming via `AsyncIterable<AIStreamEvent>`

**Prompt templates are versioned and testable**

- Each prompt is a function that takes structured input → returns messages array
- Prompts live in `packages/ai-provider/src/prompts/`
- Prompts include system context about the PO role

---

## Naming Conventions

| Context                | Convention                | Example                          |
| ---------------------- | ------------------------- | -------------------------------- |
| Files (components)     | PascalCase                | `RequirementCard.tsx`            |
| Files (utilities)      | kebab-case                | `api-client.ts`                  |
| Files (routes/Fastify) | kebab-case                | `projects/index.ts`              |
| Types/Interfaces       | PascalCase                | `ProjectCreateInput`             |
| Zod schemas            | camelCase + Schema suffix | `projectCreateSchema`            |
| API routes             | kebab-case, plural nouns  | `/api/projects/:id/requirements` |
| Database tables        | PascalCase (Prisma)       | `model UserJourney`              |
| Environment vars       | SCREAMING_SNAKE           | `DATABASE_URL`                   |

---

## API Conventions

See `guidelines/api-conventions.md` for full details.

**Summary:**

- RESTful resource naming
- Consistent error response shape
- Pagination via cursor-based approach
- All mutations validate input with Zod before processing
- AI generation endpoints use POST with `/generate` suffix

---

## Testing Strategy

- Unit tests: Services and utilities (vitest)
- Integration tests: API routes with test database (vitest + supertest)
- E2E tests: Critical user flows (Playwright) — added in later phases
- AI prompts: Snapshot tests for prompt generation functions
