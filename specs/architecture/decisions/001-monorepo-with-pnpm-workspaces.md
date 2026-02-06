# ADR-001: Monorepo with pnpm Workspaces

**Status:** accepted
**Date:** 2026-02-06
**Phase:** 1 — Foundation

## Context

The project has multiple deployment targets (Next.js frontend, Fastify backend) and shared code (types, validation schemas, database client, AI provider adapter). We need a strategy for organizing and linking these packages.

## Options Considered

### Option A: Monorepo with pnpm workspaces

- Pros: Single repo, atomic commits across packages, pnpm is fast with strict dependency isolation, native workspace protocol for inter-package linking
- Cons: Slightly more complex initial setup, CI needs workspace awareness

### Option B: Separate repositories

- Pros: Independent deployment, clear boundaries
- Cons: Cross-repo changes require coordinated PRs, shared types drift, version management overhead

### Option C: Turborepo / Nx

- Pros: Build caching, task orchestration, dependency graph visualization
- Cons: Additional tooling complexity, pnpm workspaces already handle the core need, premature for current scale

## Decision

**Option A: pnpm workspaces.** The project is small enough that pnpm workspaces handle everything we need without additional build orchestration tooling. We can add Turborepo later if build times become a problem.

## Consequences

- All packages live in one repo under `apps/` and `packages/`
- Inter-package dependencies use `workspace:*` protocol
- A single `pnpm dev` command starts all apps
- Shared TypeScript config via `tsconfig.base.json` with path aliases
