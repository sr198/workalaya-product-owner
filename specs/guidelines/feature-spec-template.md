# Feature Spec Template

Use this template when writing feature specs in `specs/phases/phase-{n}/features/`.

---

```markdown
# F{n}: {Feature Name}

## Overview

{1-2 sentence description of what this feature delivers.}

## Dependencies

- **Requires:** {List feature IDs that must be complete before this one}
- **Packages:** {npm packages to install, if any}

## Acceptance Criteria

- [ ] {Specific, verifiable criterion}
- [ ] {Another criterion}

## Files to Create

| File              | Purpose               |
| ----------------- | --------------------- |
| `path/to/file.ts` | {What this file does} |

## Files to Modify

| File                  | Change                 |
| --------------------- | ---------------------- |
| `path/to/existing.ts` | {What changes and why} |

## Implementation Notes

{Any specific patterns, constraints, or gotchas the implementation agent needs to know.}

## Verification

1. {Step to verify the feature works}
2. {Another verification step}
```

---

## Guidelines for Writing Specs

1. **Atomic**: One feature = one coherent unit of work. Not too big (multi-day), not too small (a single line change).
2. **Self-contained**: The spec has everything needed to implement. No need to read other specs mid-implementation.
3. **Explicit files**: List every file to create or modify. No guessing.
4. **Testable criteria**: Each acceptance criterion is verifiable with a concrete action.
5. **No ambiguity**: If something could be interpreted two ways, clarify it.
