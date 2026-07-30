---
name: srsp-propose
description: Finalize proposal, design, and tasks for the active Silicon Ranch spec.
tags:
  - srsp
  - primary
  - propose
---

# /srsp-propose — Propose the Solution

Finalize the proposal, technical design, and task plan for the active spec.

## Prerequisite

- Read `.claude/specs/active-spec.txt`.
- Read `.claude/specs/<spec-name>/spec.md`.
- Read `.claude/specs/<spec-name>/proposal.md` if it exists.
- Read `.claude/specs/<spec-name>/design.md` if it exists.
- Read `.claude/specs/<spec-name>/tasks.md` if it exists.

## Steps

1. **Confirm active spec.**
   - Read `.claude/specs/active-spec.txt`.
   - Read the active spec's frontmatter to get `stage`.
   - Display: "Active spec: `<name>` (`<stage>`). Continue with this spec or switch?"
   - Offer: `Continue` or `Cancel`.
   - To switch active spec, tell the user to run `/srsp-switch` and stop.
   - If stage is `submitted`, recommend `/srsp-explore` first and stop.
   - If stage is `exploring` or `proposal-draft` or later, proceed.

2. **Set stage to `proposal-draft` when generation begins.**
   - Update `spec.md` with `stage: proposal-draft` and `updated: <ISO timestamp>`.
   - This makes `/srsp-propose` the formal approval gate, not `/srsp-explore`.

3. **Generate or refine `proposal.md`.**
   - Include summary, functional requirements, acceptance criteria, non-functional requirements, constraints, assumptions, and open questions.
   - Requirements must be testable or verifiable.

4. **Generate or refine `design.md`.**
   - Include overview, architecture, file changes, API/interface definitions, implementation TODOs, testing strategy, risks, and mitigations.
   - Every functional requirement should trace to at least one TODO.

5. **Generate or refine `tasks.md`.**
   - Convert design TODOs into an ordered, checkable task plan.
   - Include implementation tasks, verification tasks, and review/release tasks.

6. **Present a concise summary.**
   - Top 3–5 requirements.
   - High-level design approach.
   - Number of tasks and any dependencies.
   - Any remaining open questions.

7. **Run the formal approval/refinement loop:**

   This is the formal approval gate. Ask the user:
   - `Accept` — update `spec.md` stage to `proposal-approved`, record decision, recommend `/srsp-apply`.
   - `Refine proposal` — ask what is missing/wrong, append notes to `proposal.md`, regenerate, present again.
   - `Refine design` — ask what is missing/wrong, append notes to `design.md`, regenerate, present again.
   - `Refine tasks` — ask what to change, update `tasks.md`, present again.
   - `Skip` — record reason, set stage to `proposal-skipped`, recommend `/srsp-apply`.
   - `Cancel` — set `status: cancelled`, record reason, stop.

8. **Update `spec.md` metadata after every decision.**
   - `stage: <new stage>`
   - `proposed: <ISO timestamp>` on accept/skip
   - `updated: <ISO timestamp>`
   - Append entry to `## Decision Log` using the format from `docs/state-machine.md`:
     - On accept: `<timestamp> [proposal-approved] proposal approved: ready for /srsp-apply`
     - On refine: `<timestamp> [proposal-draft] proposal refined: <what changed>`
     - On skip: `<timestamp> [proposal-approved] proposal skipped: <reason>`
     - On cancel: `<timestamp> [cancelled] proposal cancelled: <reason>`

## Artifact Templates

### `proposal.md`

```markdown
---
spec: <spec-name>
stage: proposal
generated: <ISO date>
---

# Proposal: <Spec Title>

## Summary
...

## Functional Requirements
1. FR1: ... — Acceptance: ...
2. FR2: ...

## Non-Functional Requirements
1. NFR1: ...

## Constraints & Assumptions
- ...

## Open Questions
- ...

## Refinement Notes
```

### `design.md`

```markdown
---
spec: <spec-name>
stage: design
generated: <ISO date>
---

# Design: <Spec Title>

## Overview
...

## Architecture / Approach
...

## File Changes
...

## API / Interface Definitions
...

## Implementation TODOs
- [ ] TODO-1: ...
- [ ] TODO-2: ...

## Testing Strategy
...

## Risks & Mitigations
...

## Refinement Notes
```

### `tasks.md`

```markdown
---
spec: <spec-name>
stage: tasks
generated: <ISO date>
---

# Tasks: <Spec Title>

## Implementation Tasks
- [ ] Task-1: ... ← TODO-1
- [ ] Task-2: ... ← TODO-2

## Verification Tasks
- [ ] Verify-1: ...

## Review / Release Tasks
- [ ] Engineer review and approval
- [ ] Engineer commits approved changes
- [ ] Engineer creates pull request (optional)
```

## Rules

- This skill is the formal approval gate for the spec, not `/srsp-explore`.
- Acceptable entry stages are `exploring`, `proposal-draft`, or later.
- Do not write implementation code at this stage.
- Design TODOs must be concrete enough to become tasks.
- Every stage decision must be recorded in `spec.md`.
- Commit and PR are not created here; they happen in `/srsp-apply` only after engineer approval.
- Stage transitions and Decision Log format must follow `docs/state-machine.md`.
