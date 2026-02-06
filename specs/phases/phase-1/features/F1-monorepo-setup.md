# F1: Monorepo & Tooling Setup

## Overview

Set up the pnpm workspace monorepo with all five package skeletons, shared TypeScript configuration, ESLint, Prettier, and development scripts. This is the foundation everything else builds on.

## Dependencies

- **Requires:** None (first feature)
- **Packages:** typescript, eslint, prettier, @typescript-eslint/parser, @typescript-eslint/eslint-plugin, eslint-config-prettier, turbo (build orchestration)

## Acceptance Criteria

- [ ] `pnpm install` resolves all workspace references without errors
- [ ] `pnpm build` compiles all packages (empty shells) without errors
- [ ] `pnpm typecheck` passes with zero errors
- [ ] `pnpm lint` runs ESLint across all packages
- [ ] `pnpm format` runs Prettier across all packages
- [ ] Each package has a `package.json` with correct name, main/types exports
- [ ] TypeScript strict mode is enabled in the base config
- [ ] Workspace packages can import from each other using `@workalaya/*` names

## Files to Create

| File                                 | Purpose                                                 |
| ------------------------------------ | ------------------------------------------------------- |
| `pnpm-workspace.yaml`                | Defines workspace package locations                     |
| `package.json`                       | Root package.json with workspace scripts                |
| `turbo.json`                         | Turborepo pipeline configuration                        |
| `tsconfig.base.json`                 | Shared TypeScript config (strict mode, common settings) |
| `.eslintrc.json`                     | Root ESLint configuration                               |
| `.prettierrc`                        | Prettier configuration                                  |
| `.prettierignore`                    | Files to exclude from formatting                        |
| `.gitignore`                         | Standard ignores for Node/TypeScript/Prisma             |
| `.nvmrc`                             | Node version pinning                                    |
| `apps/web/package.json`              | Next.js app package (shell — no source yet)             |
| `apps/web/tsconfig.json`             | Extends base TypeScript config                          |
| `apps/api/package.json`              | Fastify app package (shell — no source yet)             |
| `apps/api/tsconfig.json`             | Extends base TypeScript config                          |
| `packages/shared/package.json`       | Shared types/schemas package                            |
| `packages/shared/tsconfig.json`      | Extends base TypeScript config                          |
| `packages/shared/src/index.ts`       | Barrel export (empty for now)                           |
| `packages/db/package.json`           | Database package                                        |
| `packages/db/tsconfig.json`          | Extends base TypeScript config                          |
| `packages/db/src/index.ts`           | Barrel export (empty for now)                           |
| `packages/ai-provider/package.json`  | AI provider package                                     |
| `packages/ai-provider/tsconfig.json` | Extends base TypeScript config                          |
| `packages/ai-provider/src/index.ts`  | Barrel export (empty for now)                           |

## Files to Modify

None — this is a greenfield setup.

## Implementation Notes

- Use `"workspace:*"` protocol for internal dependency references in package.json files
- TypeScript `baseUrl` and `paths` are NOT needed — pnpm workspaces handle resolution
- Set `"type": "module"` in root package.json for ESM
- Use Turborepo for build orchestration — define `build`, `typecheck`, `lint` pipelines
- Node version: pin to 20.x LTS in `.nvmrc`
- The web and api packages get minimal package.json only — their source files come in F4/F5
- Each library package (`shared`, `db`, `ai-provider`) needs `"main"` and `"types"` pointing to compiled output, or use TypeScript project references
- Prefer `tsup` or direct `tsc` for building library packages

## Verification

1. `pnpm install` completes without errors
2. `pnpm build` compiles all packages
3. `pnpm typecheck` reports zero errors
4. `pnpm lint` runs successfully
5. Verify `apps/web/node_modules/@workalaya/shared` symlinks correctly
6. Verify `apps/api/node_modules/@workalaya/shared` symlinks correctly
