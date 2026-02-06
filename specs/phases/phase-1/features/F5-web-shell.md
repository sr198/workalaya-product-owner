# F5: Web Shell

## Overview

Set up the `@workalaya/web` Next.js 15 application with App Router, Tailwind CSS, shadcn/ui component library, root layout, API client utility, and basic page shells. This provides the frontend skeleton that all future UI features build on.

## Dependencies

- **Requires:** F1 (Monorepo Setup), F2 (Shared Package)
- **Packages:** next@15, react, react-dom, tailwindcss, postcss, autoprefixer, @tanstack/react-query, class-variance-authority, clsx, tailwind-merge, lucide-react (for shadcn/ui icons)

## Acceptance Criteria

- [ ] `pnpm --filter @workalaya/web dev` starts Next.js on port 3000
- [ ] Root layout renders with basic HTML structure, Tailwind styles applied
- [ ] Landing page (`/`) renders with placeholder content
- [ ] shadcn/ui is initialized and `Button` component works
- [ ] API client utility is configured to call the backend at `http://localhost:3001`
- [ ] React Query provider is set up in the root layout
- [ ] `cn()` utility function is available for conditional class merging
- [ ] Package builds and typechecks cleanly
- [ ] Server Components are used by default; client components marked explicitly

## Files to Create

| File                                        | Purpose                                            |
| ------------------------------------------- | -------------------------------------------------- |
| `apps/web/src/app/layout.tsx`               | Root layout — HTML shell, providers, global styles |
| `apps/web/src/app/page.tsx`                 | Landing page (placeholder for now)                 |
| `apps/web/src/app/globals.css`              | Tailwind directives and CSS custom properties      |
| `apps/web/src/components/ui/button.tsx`     | shadcn/ui Button component                         |
| `apps/web/src/lib/utils.ts`                 | `cn()` utility (clsx + tailwind-merge)             |
| `apps/web/src/lib/api-client.ts`            | Typed API client for backend communication         |
| `apps/web/src/providers/query-provider.tsx` | React Query provider (client component)            |
| `apps/web/tailwind.config.ts`               | Tailwind configuration with shadcn/ui theme        |
| `apps/web/postcss.config.js`                | PostCSS configuration for Tailwind                 |
| `apps/web/next.config.ts`                   | Next.js configuration                              |
| `apps/web/.env.example`                     | Example environment variables                      |
| `apps/web/components.json`                  | shadcn/ui configuration                            |

## Files to Modify

| File                     | Change                                                  |
| ------------------------ | ------------------------------------------------------- |
| `apps/web/package.json`  | Add all dependencies, scripts (dev, build, start, lint) |
| `apps/web/tsconfig.json` | Configure for Next.js (jsx, paths, plugins)             |

## Implementation Notes

- **Next.js 15 App Router**: Use the `src/app/` directory structure
- **Root layout** (`layout.tsx`):
  - Server Component (no `"use client"`)
  - Imports `globals.css`
  - Wraps children with `QueryProvider` (the provider itself is a client component)
  - Sets metadata (title, description)
  - Uses Inter font from `next/font/google`
- **API client** (`lib/api-client.ts`):
  - Uses native `fetch` with a base URL from environment
  - Handles JSON serialization/deserialization
  - Methods: `get<T>(path)`, `post<T>(path, body)`, `put<T>(path, body)`, `delete(path)`
  - Automatically includes credentials/auth headers (auth added in F6)
  - Returns typed responses matching `ApiResponse<T>` from `@workalaya/shared`
- **React Query provider**: Client component that wraps `QueryClientProvider`, creates a stable `QueryClient` instance
- **shadcn/ui setup**: Initialize with `components.json` config pointing to `src/components/ui/`. Install only `Button` for now — more components added as needed in later features.
- **Environment variables**:
  - `NEXT_PUBLIC_API_URL` (default: http://localhost:3000/api) — for client-side API calls
  - API calls from Server Components can use internal URL
- **Tailwind config**: Include content paths for `src/` and shadcn/ui component paths. Use CSS custom properties for theming (shadcn/ui convention).
- Do NOT add auth pages or protected routes yet — that's F6.

## Verification

1. `pnpm --filter @workalaya/web build` compiles without errors
2. `pnpm --filter @workalaya/web dev` starts on port 3000
3. Navigate to `http://localhost:3000` — page renders with styled content
4. Tailwind classes apply correctly (verify with a colored element)
5. Browser console shows no errors
6. React Query devtools icon appears (if enabled in dev)
