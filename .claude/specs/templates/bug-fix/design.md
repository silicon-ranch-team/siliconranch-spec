---
spec: bug-fix
stage: design
generated: 2026-07-29
---

# Design: <Bug Title>

## Overview
<High-level approach: identify root cause, minimal fix, regression test.>

## Architecture / Approach
- Reproduce in a test first.
- Locate the faulty code path.
- Apply the smallest change that fixes the issue.
- Add assertions that would have caught the bug.

## File Changes
- `src/<module-with-bug>`
- `tests/<regression-test>`

## Implementation TODOs
- [ ] TODO-1: Add failing regression test.
- [ ] TODO-2: Identify root cause.
- [ ] TODO-3: Apply minimal fix.
- [ ] TODO-4: Verify all tests pass.

## Testing Strategy
- **Regression test** reproduces the reported failure before the fix is applied.
- **Full suite** still passes after the fix.
- The regression test is written first as part of Task-1, then updated if needed during Task-3.

## Risks & Mitigations
- Risk: fix breaks unrelated behavior → Mitigation: minimal change + full suite.
- Risk: root cause misunderstood → Mitigation: confirm reproduction before fixing.

## Refinement Notes
