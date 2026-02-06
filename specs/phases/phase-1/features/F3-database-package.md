# F3: Database Package

## Overview

Set up `@workalaya/db` with Prisma ORM, define the initial database schema (User, Account, Session, and Project models), generate the Prisma client, and configure migration scripts.

## Dependencies

- **Requires:** F1 (Monorepo Setup), F2 (Shared Package — for type conventions)
- **Packages:** prisma, @prisma/client

## Acceptance Criteria

- [ ] Prisma schema defines User, Account, Session, and Project models
- [ ] `pnpm --filter @workalaya/db db:generate` generates the Prisma client
- [ ] `pnpm --filter @workalaya/db db:migrate` runs migrations against a PostgreSQL database
- [ ] `@workalaya/db` exports the PrismaClient instance and model types
- [ ] User model is compatible with NextAuth.js v5 requirements
- [ ] Package builds and typechecks cleanly

## Files to Create

| File                               | Purpose                                               |
| ---------------------------------- | ----------------------------------------------------- |
| `packages/db/prisma/schema.prisma` | Prisma schema with all models                         |
| `packages/db/src/client.ts`        | Singleton PrismaClient instance                       |
| `packages/db/src/index.ts`         | Barrel export (client + types)                        |
| `packages/db/.env.example`         | Example environment variables for database connection |

## Files to Modify

| File                       | Change                                                                     |
| -------------------------- | -------------------------------------------------------------------------- |
| `packages/db/package.json` | Add prisma/@prisma/client deps, add db:generate/db:migrate/db:push scripts |
| `.gitignore`               | Add `packages/db/prisma/migrations/` tracking rules, `.env` exclusions     |

## Implementation Notes

- **NextAuth.js v5 compatibility**: The User model must have `id`, `name`, `email`, `emailVerified`, `image` fields. Account and Session models follow NextAuth's adapter schema. Reference: https://authjs.dev/getting-started/adapters/prisma
- **Prisma schema models for Phase 1:**

  ```prisma
  model User {
    id            String    @id @default(cuid())
    name          String?
    email         String    @unique
    emailVerified DateTime?
    image         String?
    passwordHash  String?   // For credentials auth
    accounts      Account[]
    sessions      Session[]
    projects      Project[]
    createdAt     DateTime  @default(now())
    updatedAt     DateTime  @updatedAt
  }

  model Account {
    // Standard NextAuth Account model
  }

  model Session {
    // Standard NextAuth Session model
  }

  model Project {
    id          String   @id @default(cuid())
    name        String
    description String?
    userId      String
    user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
    createdAt   DateTime @default(now())
    updatedAt   DateTime @updatedAt
  }
  ```

- **Singleton client pattern**: Use a global variable to prevent multiple PrismaClient instances in dev (Next.js hot reload creates new instances).
- **DATABASE_URL** environment variable must be configured. Default for local dev: `postgresql://postgres:postgres@localhost:5432/workalaya?schema=public`
- Migrations should be committed to git. Add `packages/db/prisma/migrations/` to tracked files.

## Verification

1. `pnpm --filter @workalaya/db db:generate` completes without errors
2. `pnpm --filter @workalaya/db build` compiles without errors
3. With a running PostgreSQL instance: `pnpm --filter @workalaya/db db:push` creates all tables
4. Import `{ prisma }` from `@workalaya/db` — resolves correctly
5. `prisma.user.findMany()` returns empty array (no runtime errors)
