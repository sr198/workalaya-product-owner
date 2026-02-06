# Workalaya AI Product Owner

## What This Is

AI-powered Product Owner system — drives requirements discovery, structures product artifacts, maintains decision context.

**PRD:** `specs/prd.v1.md`
**Process:** `specs/process.md`

---

## How We Work

This project follows a **phased, feature-atomic** development process. See `specs/process.md` for full details.

### Interaction Modes

**1. Phase Planning** — "Let's work on Phase N"

- Read: PRD + `specs/phases/overview.md` + `specs/architecture/` + previous phase status
- Output: `epic.md` + feature specs in `features/`
- Human reviews and approves before any implementation

**2. Feature Implementation** — "Implement F{n}"

- Spawn agent with **only**: feature spec + `specs/guidelines/implementation-rules.md` + one relevant convention doc
- Agent reads only files listed in the feature spec
- Agent implements, verifies, reports back
- Update `status.md` after completion

**3. Feature Review** — After implementation completes

- Check acceptance criteria from feature spec
- Run verification steps
- Mark complete or iterate

**4. Status Check** — "What's next?"

- Read current phase `status.md`
- Suggest next feature or next phase

### Context Rules

- **Implementation agents get exactly what they need.** No PRD, no other feature specs, no architecture history.
- **The feature spec is the context contract.** It lists every file to read and every file to create.
- **Independent features can run in parallel.** Each agent gets its own isolated context.
- **Never send full codebase context to an agent.** Scope is defined by the feature spec.

---

## Current State

**Active Phase:** Phase 1 complete — ready to plan Phase 2
**Roadmap:** `specs/phases/overview.md`

---

## Project Structure

```
specs/                          # All planning and tracking artifacts
├── prd.v1.md                  # Product requirements document
├── process.md                 # Development process and context protocol
├── phases/                    # Phased delivery
│   ├── overview.md            # Roadmap and sequencing
│   └── phase-{n}-{name}/     # Per-phase directory
│       ├── epic.md            # Epic definition and scope
│       ├── features/          # Feature specs (F1, F2, ...)
│       └── status.md          # Feature tracking
├── architecture/              # Technical decisions
│   ├── tech-stack.md          # Stack choices
│   ├── patterns.md            # Design patterns
│   └── decisions/             # Architecture Decision Records
└── guidelines/                # Implementation standards
    ├── implementation-rules.md
    ├── api-conventions.md
    ├── frontend-conventions.md
    └── feature-spec-template.md
```

---

## Tech Stack

Next.js 15 + Fastify + PostgreSQL/Prisma + Multi-provider AI (Claude/OpenAI/Ollama)

Full details: `specs/architecture/tech-stack.md`
