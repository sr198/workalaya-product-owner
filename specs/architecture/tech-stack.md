# Tech Stack Decisions

## Confirmed Stack

| Layer         | Technology                                      | Rationale                                                            |
| ------------- | ----------------------------------------------- | -------------------------------------------------------------------- |
| **Monorepo**  | pnpm workspaces                                 | Fast installs, strict dependency isolation, native workspace support |
| **Frontend**  | Next.js 15 (App Router) + TypeScript            | SSR/SSG flexibility, file-based routing, React Server Components     |
| **Backend**   | Fastify + TypeScript                            | High performance, plugin architecture, schema-based validation       |
| **Database**  | PostgreSQL + Prisma                             | Relational integrity for traceability, Prisma for type-safe queries  |
| **Auth**      | NextAuth.js v5                                  | Proven auth solution for Next.js, multiple provider support          |
| **AI**        | Multi-provider adapter (Claude, OpenAI, Ollama) | No vendor lock-in, local dev via Ollama                              |
| **Real-time** | WebSockets (fastify-websocket) + SSE fallback   | Streaming AI responses, real-time collaboration                      |
| **Styling**   | Tailwind CSS + shadcn/ui                        | Utility-first, accessible component primitives                       |

## Package Structure

| Package                  | Path                    | Purpose                              |
| ------------------------ | ----------------------- | ------------------------------------ |
| `@workalaya/web`         | `apps/web/`             | Next.js frontend application         |
| `@workalaya/api`         | `apps/api/`             | Fastify backend API                  |
| `@workalaya/shared`      | `packages/shared/`      | Shared types, Zod schemas, constants |
| `@workalaya/db`          | `packages/db/`          | Prisma schema, client, migrations    |
| `@workalaya/ai-provider` | `packages/ai-provider/` | AI provider adapter layer            |

## Key Constraints

- TypeScript strict mode everywhere
- All validation via Zod schemas shared between frontend and backend
- AI provider is abstracted — no direct SDK usage outside `@workalaya/ai-provider`
- Database access only through `@workalaya/db` — no raw SQL in application code
