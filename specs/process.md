# Development Process & Context Protocol

How this project is planned, implemented, and tracked.

---

## Principles

1. **Phase-first delivery.** Work progresses one phase at a time. Each phase is an epic.
2. **Feature-atomic implementation.** Each feature is the smallest coherent unit of work. One agent, one feature.
3. **Context is scoped, not shared.** Each agent receives exactly the context it needs. Extra context is noise that degrades quality.
4. **Specs are the source of truth.** If it's not in the feature spec, it doesn't get built. If it's not in status.md, it's not tracked.
5. **Human gates between planning and implementation.** No code is written until feature specs are reviewed and approved.

---

## Workflow

### Step 1: Phase Planning

**Trigger:** Human says "Let's work on Phase N"

**Context loaded:**
| Document | Purpose |
|----------|---------|
| `specs/prd.v1.md` | High-level product intent |
| `specs/phases/overview.md` | Phase sequencing and dependencies |
| `specs/architecture/tech-stack.md` | Stack constraints |
| `specs/architecture/patterns.md` | Design patterns to follow |
| Previous phase's `status.md` | What already exists |
| Previous phase's `epic.md` | What was built and why |

**Output produced:**
| Artifact | Location |
|----------|----------|
| Epic definition | `specs/phases/phase-{n}/epic.md` |
| Feature specs | `specs/phases/phase-{n}/features/F{n}-*.md` |
| Quick start guide | `specs/phases/phase-{n}/quick-start.md` |
| Status initialized | `specs/phases/phase-{n}/status.md` updated with feature list |

**Process:**

1. Read all context documents listed above
2. Draft `epic.md` — goals, scope boundaries, success criteria, non-goals
3. Break epic into atomic features, ordered by dependency
4. Write each feature spec using `specs/guidelines/feature-spec-template.md`
5. Update `status.md` with the feature list
6. Present to human for review
7. Iterate until approved

---

### Step 2: Feature Implementation

**Trigger:** Human says "Implement F{n}" or "Next feature"

**Context sent to implementation agent:**

| Document                                   | Always  | Condition                |
| ------------------------------------------ | ------- | ------------------------ |
| The feature spec (`F{n}-*.md`)             | Yes     | —                        |
| `specs/guidelines/implementation-rules.md` | Yes     | —                        |
| `specs/guidelines/api-conventions.md`      | Only if | Feature touches backend  |
| `specs/guidelines/frontend-conventions.md` | Only if | Feature touches frontend |
| Source files listed in feature spec        | Yes     | Agent reads these first  |

**Context NOT sent to implementation agent:**

- PRD
- Phase overview or epic.md
- Other feature specs
- Architecture decision records
- Any file not listed in the feature spec

**Process:**

1. Read feature spec completely
2. Check dependencies — are prerequisite features marked complete?
3. Assemble context bundle (spec + rules + relevant convention doc)
4. Spawn implementation agent with the context bundle
5. Agent implements, following the spec exactly
6. Agent runs verification steps listed in the spec
7. Agent reports: what was created, what was modified, verification results
8. Update `status.md` — mark feature complete or note issues

---

### Step 3: Parallel Implementation

**Trigger:** Multiple features have no dependency on each other

**Rules:**

- Check the feature dependency graph in `status.md`
- Only parallelize features with no `Requires` overlap
- Each agent gets its own isolated context bundle
- If two features modify the same file, they CANNOT run in parallel
- After parallel completion, verify no conflicts between outputs

**Example:**

```
F3 depends on F1, F2
F4 depends on F1
F5 depends on F1

→ F1 first (sequential)
→ F2, F4, F5 in parallel (all only depend on completed F1)
→ F3 last (depends on F2)
```

---

### Step 4: Feature Review

**Trigger:** Implementation agent reports completion

**Process:**

1. Read the feature spec's acceptance criteria
2. Check verification results from the agent
3. Run `pnpm build` and `pnpm typecheck` if not already done
4. Spot-check the implemented code against conventions
5. Update `specs/phases/phase-{n}/quick-start.md` with any new setup steps or verification commands
6. Decision: **Approve** (mark complete) or **Revise** (note issues, re-run)

---

### Step 5: Phase Completion

**Trigger:** All features in a phase marked complete in `status.md`

**Process:**

1. Update `status.md` — set phase status to `COMPLETE`
2. Update `specs/phases/overview.md` — mark phase complete
3. Update `CLAUDE.md` — update "Current State" section
4. Run full verification for the phase (listed in `epic.md`)
5. Human decides: move to next phase or revisit

---

## Context Bundle Reference

### For Phase Planning Sessions

```
Read:
  - specs/prd.v1.md
  - specs/phases/overview.md
  - specs/architecture/tech-stack.md
  - specs/architecture/patterns.md
  - specs/phases/phase-{prev}/status.md  (if not Phase 1)
  - specs/phases/phase-{prev}/epic.md    (if not Phase 1)
```

### For Backend Feature Implementation

```
Agent receives:
  - specs/phases/phase-{n}/features/F{x}-{name}.md    # THE feature spec
  - specs/guidelines/implementation-rules.md            # How to implement
  - specs/guidelines/api-conventions.md                 # Backend standards
  + Files listed in feature spec's "Files to Create" and "Files to Modify"
```

### For Frontend Feature Implementation

```
Agent receives:
  - specs/phases/phase-{n}/features/F{x}-{name}.md    # THE feature spec
  - specs/guidelines/implementation-rules.md            # How to implement
  - specs/guidelines/frontend-conventions.md            # Frontend standards
  + Files listed in feature spec's "Files to Create" and "Files to Modify"
```

### For Full-Stack Feature Implementation

```
Agent receives:
  - specs/phases/phase-{n}/features/F{x}-{name}.md    # THE feature spec
  - specs/guidelines/implementation-rules.md            # How to implement
  - specs/guidelines/api-conventions.md                 # Backend standards
  - specs/guidelines/frontend-conventions.md            # Frontend standards
  + Files listed in feature spec's "Files to Create" and "Files to Modify"
```

---

## Status Tracking

All tracking lives in `specs/phases/phase-{n}/status.md`.

### Feature Statuses

| Status        | Meaning                                    |
| ------------- | ------------------------------------------ |
| `PENDING`     | Spec written, not yet implemented          |
| `IN_PROGRESS` | Agent currently implementing               |
| `REVIEW`      | Implemented, awaiting human review         |
| `COMPLETE`    | Reviewed and approved                      |
| `BLOCKED`     | Cannot proceed — dependency or issue noted |

### Phase Statuses

| Status        | Meaning                              |
| ------------- | ------------------------------------ |
| `NOT_STARTED` | Phase not yet planned                |
| `PLANNING`    | Epic and feature specs being written |
| `IN_PROGRESS` | Features being implemented           |
| `COMPLETE`    | All features done and verified       |

---

## Rules for Writing Feature Specs

See `specs/guidelines/feature-spec-template.md` for the template.

Key rules:

1. **List every file** to create or modify. No implicit changes.
2. **List every dependency** — both feature dependencies and npm packages.
3. **Acceptance criteria must be verifiable** — a concrete action, not a vague statement.
4. **Include implementation notes** for non-obvious patterns or constraints.
5. **Scope to one concern.** If a feature touches both API and UI for a single endpoint, that's fine. If it touches three unrelated endpoints, split it.
6. **Files listed = agent's codebase scope.** The agent reads ONLY these files plus the convention docs. If it needs to understand something else, list it.
