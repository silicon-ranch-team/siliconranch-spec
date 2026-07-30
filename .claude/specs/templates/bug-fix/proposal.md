---
spec: bug-fix
stage: proposal
generated: 2026-07-29
---

# Proposal: <Bug Title>

## Summary
<One-paragraph description of the bug and its impact.>

## Functional Requirements
1. FR1: Reproduce the bug reliably — Acceptance: failing test or reproduction steps documented.
2. FR2: Fix the root cause — Acceptance: bug no longer reproduces.
3. FR3: Add regression test — Acceptance: test fails before fix, passes after.

## Non-Functional Requirements
1. NFR1: Fix does not degrade performance.
2. NFR2: Fix does not introduce new warnings or errors.

## Constraints & Assumptions
- Target branch is the development branch unless this is a hotfix.
- Existing behavior should only change to fix the bug.

## Open Questions
- Is this a hotfix that should target production?
- Are there edge cases not covered by the reproduction steps?

## Refinement Notes
