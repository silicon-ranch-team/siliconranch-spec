---
spec: refactor
stage: design
generated: 2026-07-29
---

# Design: <Refactor Title>

## Overview
<High-level approach: restructure modules, rename symbols, extract functions, etc.>

## Architecture / Approach
- Identify current code smell or structural issue.
- Define the target structure.
- Refactor incrementally with tests running green.

## File Changes
- `src/<module-to-refactor>`
- `tests/<updated-tests>`

## Implementation TODOs
- [ ] TODO-1: Add or strengthen characterization tests.
- [ ] TODO-2: Apply first refactor step.
- [ ] TODO-3: Run tests and fix any regressions.
- [ ] TODO-4: Repeat until target structure is reached.

## Testing Strategy
- Run existing tests after every step.
- Add characterization tests if behavior is not well covered.

## Risks & Mitigations
- Risk: accidental behavior change → Mitigation: small steps + tests after each.
- Risk: large diff is hard to review → Mitigation: split into multiple specs if needed.

## Refinement Notes
