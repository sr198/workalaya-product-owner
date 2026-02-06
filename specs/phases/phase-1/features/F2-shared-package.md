# F2: Shared Package

## Overview

Establish the `@workalaya/shared` package as the single source of truth for domain types, Zod validation schemas, constants, and error definitions shared between frontend and backend.

## Dependencies

- **Requires:** F1 (Monorepo Setup)
- **Packages:** zod

## Acceptance Criteria

- [ ] `@workalaya/shared` exports Zod schemas and inferred TypeScript types
- [ ] Types represent domain concepts, not database models
- [ ] Error code constants are defined and exported
- [ ] Pagination types are defined for consistent API responses
- [ ] Package builds and typechecks cleanly
- [ ] Other packages can import from `@workalaya/shared`

## Files to Create

| File                                           | Purpose                                                      |
| ---------------------------------------------- | ------------------------------------------------------------ |
| `packages/shared/src/schemas/user.ts`          | User-related Zod schemas (signUp, login inputs)              |
| `packages/shared/src/schemas/project.ts`       | Project schemas (create, update — minimal stubs for Phase 1) |
| `packages/shared/src/schemas/index.ts`         | Barrel export for all schemas                                |
| `packages/shared/src/types/common.ts`          | Shared types: PaginatedResponse, ApiError, ApiResponse       |
| `packages/shared/src/types/user.ts`            | User domain types (inferred from Zod schemas)                |
| `packages/shared/src/types/project.ts`         | Project domain types (inferred from Zod schemas)             |
| `packages/shared/src/types/index.ts`           | Barrel export for all types                                  |
| `packages/shared/src/constants/error-codes.ts` | Error code constants (VALIDATION_ERROR, NOT_FOUND, etc.)     |
| `packages/shared/src/constants/index.ts`       | Barrel export for constants                                  |
| `packages/shared/src/index.ts`                 | Root barrel export for the entire package                    |

## Files to Modify

| File                           | Change                                  |
| ------------------------------ | --------------------------------------- |
| `packages/shared/package.json` | Add `zod` dependency, configure exports |

## Implementation Notes

- **Zod schemas are canonical.** TypeScript types are derived via `z.infer<typeof schema>`, never manually duplicated.
- Schemas to define for Phase 1:
  - `signUpSchema`: `{ email: string (email), password: string (min 8), name: string (min 1) }`
  - `loginSchema`: `{ email: string (email), password: string }`
  - `projectCreateSchema`: `{ name: string (min 1, max 200), description: string (optional) }` — stub for future use
  - `projectUpdateSchema`: partial of projectCreate
- Common types to define:
  - `ApiResponse<T>`: `{ data: T }`
  - `PaginatedResponse<T>`: `{ data: T[], pagination: { cursor: string | null, hasMore: boolean } }`
  - `ApiError`: `{ error: { code: string, message: string } }`
- Error codes: `VALIDATION_ERROR`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `INTERNAL_ERROR`
- Keep schemas minimal — only what Phase 1 needs. Future phases add more schemas.

## Verification

1. `pnpm --filter @workalaya/shared build` compiles without errors
2. `pnpm --filter @workalaya/shared typecheck` passes
3. Import `{ signUpSchema, ApiResponse, ERROR_CODES }` from `@workalaya/shared` in a test file — resolves correctly
4. `signUpSchema.parse({ email: "a@b.com", password: "12345678", name: "Test" })` succeeds
5. `signUpSchema.parse({ email: "invalid" })` throws ZodError
