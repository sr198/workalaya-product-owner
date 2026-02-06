# F6: Authentication

## Overview

Implement end-to-end authentication using NextAuth.js v5 with a credentials provider (email/password). Includes sign-up, log-in, log-out flows in the web app, session management, protected frontend routes, and JWT-based API authentication in the Fastify backend.

## Dependencies

- **Requires:** F3 (Database Package), F4 (API Shell), F5 (Web Shell)
- **Packages:** next-auth@5 (beta), @auth/prisma-adapter, bcryptjs, @types/bcryptjs, jose (JWT verification for Fastify)

## Acceptance Criteria

- [ ] User can sign up with email, password, and name via `/auth/signup` page
- [ ] User can log in with email and password via `/auth/login` page
- [ ] User can log out via a button in the UI
- [ ] After login, user is redirected to `/dashboard` (placeholder page)
- [ ] Unauthenticated users visiting `/dashboard` are redirected to `/auth/login`
- [ ] API routes (except `/api/health`) reject unauthenticated requests with 401
- [ ] Authenticated API requests include `request.userId` derived from the session token
- [ ] Passwords are hashed with bcrypt before storage
- [ ] Session uses JWT strategy (stateless, no server-side session store)
- [ ] Login form shows validation errors for invalid input
- [ ] Sign-up form shows error if email already exists

## Files to Create

| File                                               | Purpose                                                          |
| -------------------------------------------------- | ---------------------------------------------------------------- |
| `apps/web/src/lib/auth.ts`                         | NextAuth.js v5 configuration (providers, adapter, callbacks)     |
| `apps/web/src/app/api/auth/[...nextauth]/route.ts` | NextAuth.js API route handler                                    |
| `apps/web/src/app/auth/login/page.tsx`             | Login page with email/password form                              |
| `apps/web/src/app/auth/signup/page.tsx`            | Sign-up page with name/email/password form                       |
| `apps/web/src/app/auth/layout.tsx`                 | Auth pages layout (centered card)                                |
| `apps/web/src/app/dashboard/page.tsx`              | Protected dashboard placeholder page                             |
| `apps/web/src/app/dashboard/layout.tsx`            | Dashboard layout (with header showing user + logout)             |
| `apps/web/src/components/ui/input.tsx`             | shadcn/ui Input component                                        |
| `apps/web/src/components/ui/card.tsx`              | shadcn/ui Card component                                         |
| `apps/web/src/components/ui/label.tsx`             | shadcn/ui Label component                                        |
| `apps/web/src/components/layout/Header.tsx`        | App header with user info and logout button                      |
| `apps/web/src/middleware.ts`                       | Next.js middleware for route protection                          |
| `apps/api/src/plugins/auth.ts`                     | Fastify auth plugin — JWT verification, decorates request.userId |
| `apps/api/src/routes/auth/signup.ts`               | `POST /api/auth/signup` — creates user with hashed password      |

## Files to Modify

| File                                  | Change                                                     |
| ------------------------------------- | ---------------------------------------------------------- |
| `apps/web/package.json`               | Add next-auth, @auth/prisma-adapter, bcryptjs dependencies |
| `apps/web/src/app/layout.tsx`         | Add SessionProvider wrapper                                |
| `apps/web/src/lib/api-client.ts`      | Add auth token injection to requests                       |
| `apps/api/package.json`               | Add jose, bcryptjs dependencies                            |
| `apps/api/src/server.ts`              | Register auth plugin, register auth signup route           |
| `packages/shared/src/schemas/user.ts` | Ensure signUpSchema and loginSchema are complete           |
| `apps/web/.env.example`               | Add NEXTAUTH_SECRET, NEXTAUTH_URL                          |
| `apps/api/.env.example`               | Add JWT_SECRET                                             |

## Implementation Notes

### NextAuth.js v5 Configuration

- Use **Credentials provider** with email/password
- Use **Prisma adapter** from `@auth/prisma-adapter` for user storage
- JWT strategy (not database sessions) — simpler for API auth
- Callbacks:
  - `jwt`: Attach `userId` to the JWT token
  - `session`: Expose `userId` in the session object
- The `authorize` function in the credentials provider:
  1. Find user by email
  2. Compare password with bcrypt
  3. Return user object or null

### Sign-Up Flow

- Sign-up is a **custom API route** (`POST /api/auth/signup` on the Fastify backend), NOT a NextAuth provider
- Flow: form submit → call Fastify signup endpoint → hash password → create user → return success → redirect to login
- Validate input with `signUpSchema` from `@workalaya/shared`
- Check for existing email, return 409 CONFLICT if exists

### API Authentication (Fastify Side)

- The Fastify auth plugin:
  1. Extracts JWT from `Authorization: Bearer <token>` header
  2. Verifies the JWT using the shared secret (same `NEXTAUTH_SECRET`)
  3. Extracts `userId` from the token payload
  4. Decorates `request.userId` with the extracted ID
- Health check route is excluded from auth
- Use `jose` library for JWT verification (lightweight, no heavy deps)

### Route Protection (Frontend)

- Next.js middleware (`middleware.ts`) checks for session on protected routes
- Protected paths: `/dashboard`, `/projects` (and all sub-paths)
- Public paths: `/`, `/auth/*`, `/api/auth/*`
- Unauthenticated users → redirect to `/auth/login`

### Shared Secret

- `NEXTAUTH_SECRET` (web) and `JWT_SECRET` (api) must be the same value
- This allows the Fastify API to verify tokens issued by NextAuth

### UI Components

- Login/signup forms use shadcn/ui components (Input, Button, Card, Label)
- Forms validate with Zod schemas from `@workalaya/shared` (client-side validation)
- Server-side validation happens independently via the same schemas
- Error states shown inline on the form

## Verification

1. `pnpm build` — all packages compile without errors
2. Start both API and web: `pnpm dev`
3. Navigate to `/auth/signup` — form renders
4. Sign up with valid credentials — user created in database, redirected to login
5. Log in with the created credentials — redirected to `/dashboard`
6. Dashboard shows user name and logout button
7. Click logout — redirected to login page
8. Navigate to `/dashboard` while logged out — redirected to `/auth/login`
9. `curl http://localhost:3001/api/health` — returns 200 (no auth required)
10. `curl http://localhost:3001/api/projects` — returns 401 (auth required, no projects route yet but auth plugin rejects)
11. Sign up with existing email — returns 409 error
12. Login with wrong password — shows error message
