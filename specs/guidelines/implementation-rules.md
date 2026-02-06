# Implementation Rules

Rules for the implementation agent when building features from feature specs.

---

## Scope Rules

1. **Implement exactly what the feature spec says.** No more, no less.
2. **Do not add features, utilities, or abstractions** not described in the spec.
3. **Do not refactor existing code** unless the spec explicitly calls for it.
4. **Do not add comments or docstrings** unless the logic is non-obvious.
5. **Do not add error handling for impossible scenarios.** Trust internal code. Validate at system boundaries only.

---

## Before You Start

1. **Read the feature spec completely** before writing any code.
2. **Read all files listed** in the spec's "Files to create/modify" section.
3. **Read existing patterns** — look at how similar things are already built in the codebase.
4. **Check dependencies** — ensure prerequisite features are completed.

---

## While Implementing

1. **Follow existing patterns.** If the codebase already has a convention, match it.
2. **Use shared schemas.** Validation logic goes in `@workalaya/shared`, not duplicated locally.
3. **Use the service layer.** Routes don't contain business logic. Services don't know about HTTP.
4. **Types from Zod.** Derive TypeScript types from Zod schemas via `z.infer<>`. Don't manually duplicate type definitions.
5. **One thing at a time.** Complete and verify each file before moving to the next.

---

## After Implementing

1. **Run the verification steps** listed in the feature spec.
2. **Run `pnpm build`** — must compile without errors.
3. **Run `pnpm typecheck`** — must pass with no type errors.
4. **Run relevant tests** if the spec includes test requirements.
5. **Update `status.md`** for the current phase.

---

## Code Quality Rules

- **TypeScript strict mode.** No `any` types unless absolutely unavoidable (and commented why).
- **No unused imports or variables.**
- **No `console.log` in production code.** Use structured logging via Fastify's built-in logger.
- **Prefer named exports** over default exports (except Next.js pages).
- **Keep functions small.** If a function exceeds ~40 lines, consider splitting.
- **No premature abstraction.** Three similar lines of code > one premature helper.

---

## Dependency Rules

- **Do not install new dependencies** unless the feature spec lists them.
- **Prefer standard library** and existing dependencies over new packages.
- **All new dependencies must be justified** — if the spec doesn't mention it, ask first.

---

## Git Rules

- **Do not commit automatically.** Wait for explicit instruction.
- **Do not push to remote** unless explicitly asked.
- **Feature branch naming:** `phase-{n}/feature-{name}` (e.g., `phase-1/monorepo-setup`)
