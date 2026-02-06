# AI Product Owner — Phased Delivery Roadmap

## Vision

Build an AI system that acts as a **primary Product Owner**: driving requirements discovery, structuring product artifacts, maintaining decision context, and evolving requirements over time.

This is **not** a project management tool with AI features. It is an AI agent with a product management interface.

---

## Phase Summary

| Phase | Epic                            | Goal                                                                   | Depends On |
| ----- | ------------------------------- | ---------------------------------------------------------------------- | ---------- |
| 1     | **Foundation**                  | Running monorepo, database, auth, basic API/web shells                 | —          |
| 2     | **Conversational Core**         | Multi-provider AI engine, stateful conversations, adaptive questioning | Phase 1    |
| 3     | **Discovery & Problem Space**   | Problem/outcome/solution capture, stakeholder modeling, assumptions    | Phase 2    |
| 4     | **Journey Modeling**            | AI-driven journey generation, visual flows, traceability               | Phase 3    |
| 5     | **Requirement Structuring**     | Journey-to-requirement conversion, categorization, traceability        | Phase 4    |
| 6     | **Decision Memory & Evolution** | Decision logs, versioning, change detection, conflict resolution       | Phase 5    |
| 7     | **Prioritization & Analysis**   | Multi-factor prioritization, tradeoff analysis, what-if scenarios      | Phase 5    |
| 8     | **Polish & Integration**        | Dashboard, export, end-to-end UX, cross-feature cohesion               | Phase 6, 7 |

---

## Phase Sequencing Rationale

- **Phase 1** is pure infrastructure — no product logic, just a working skeleton.
- **Phase 2** builds the conversational engine first because the PRD positions conversation as the _primary interface_. Everything else flows through it.
- **Phase 3** establishes the problem space _before_ jumping to solutions/requirements. This mirrors how a real PO works: understand the problem before defining what to build.
- **Phases 4–5** are the core artifact generation pipeline: journeys from problems, requirements from journeys.
- **Phase 6** adds institutional memory — the system remembers decisions and detects when new inputs conflict.
- **Phase 7** runs in parallel intent with Phase 6 — prioritization can start once requirements exist.
- **Phase 8** ties everything together into a cohesive product.

---

## Delivery Cadence

Each phase follows this cycle:

```
Epic Definition → Feature Specs → Implement (one feature at a time) → Verify → Ship
```

1. **Epic definition** (`epic.md`): Goals, success criteria, scope boundaries
2. **Feature specs** (`features/F{n}-*.md`): Atomic, self-contained implementation units
3. **Implementation**: One feature spec at a time, verified before moving on
4. **Status tracking** (`status.md`): Updated after each feature completes

---

## Status Key

| Status        | Meaning                                   |
| ------------- | ----------------------------------------- |
| `NOT_STARTED` | Phase not yet planned in detail           |
| `PLANNING`    | Epic defined, feature specs being written |
| `IN_PROGRESS` | Features actively being implemented       |
| `COMPLETE`    | All features implemented and verified     |

---

## Current State

| Phase                         | Status        |
| ----------------------------- | ------------- |
| 1 — Foundation                | `COMPLETE`    |
| 2 — Conversational Core       | `NOT_STARTED` |
| 3 — Discovery & Problem Space | `NOT_STARTED` |
| 4 — Journey Modeling          | `NOT_STARTED` |
| 5 — Requirement Structuring   | `NOT_STARTED` |
| 6 — Decision Memory           | `NOT_STARTED` |
| 7 — Prioritization & Analysis | `NOT_STARTED` |
| 8 — Polish & Integration      | `NOT_STARTED` |
