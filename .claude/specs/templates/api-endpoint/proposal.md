---
spec: api-endpoint
stage: proposal
generated: 2026-07-29
---

# Proposal: <Endpoint Title>

## Summary
<One-paragraph description of the endpoint and why it is needed.>

## Functional Requirements
1. FR1: Endpoint exposes <METHOD> <PATH> — Acceptance: returns <status> for valid requests.
2. FR2: Input validation — Acceptance: rejects malformed requests with <status>.
3. FR3: Response format — Acceptance: returns consistent JSON shape.

## Non-Functional Requirements
1. NFR1: Latency under <X ms> at p95.
2. NFR2: Tests cover happy path and error cases.

## Constraints & Assumptions
- Authentication handled by existing middleware.
- No database schema changes required.

## Open Questions
- Should we support pagination?
- Should this be versioned in the API path?

## Refinement Notes
