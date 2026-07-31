---
name: srsp-propose
description: Finalize proposal, design, and tasks for the active Silicon Ranch spec.
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
   - Requirements must be testable or verifiable. Every functional requirement must be possible to exercise with a unit, integration, or UI test.

4. **Generate or refine `design.md`.**
   - Include overview, architecture, file changes, API/interface definitions, implementation TODOs, testing strategy, risks, and mitigations.
   - **The `## Testing Strategy` section is required.** It must specify test layers (unit, integration, UI), frameworks, and which requirements each layer validates. If it is missing or empty, warn the engineer and do not allow approval.
   - Every functional requirement should trace to at least one TODO.

5. **Generate or refine `tasks.md`.**
   - Convert design TODOs into an ordered, checkable task plan.
   - Include implementation tasks, verification tasks, and review/release tasks.
   - **Verification tasks are required.** Each functional requirement must have at least one verification task (unit test, integration test, UI test, or manual verification with recorded evidence). If verification tasks are missing, warn the engineer and do not allow approval.

6. **Cross-check artifact consistency before presenting.**
   - Compare `proposal.md` requirements to `design.md` TODOs and `tasks.md` tasks.
   - If any requirement lacks a TODO or any TODO lacks a task, warn the engineer explicitly.
   - Verify `design.md` contains a non-empty `## Testing Strategy` section.
   - Verify `tasks.md` contains at least one verification task for every functional requirement.
   - If the testing strategy or verification tasks are missing, warn the engineer explicitly and do not allow approval until fixed.
   - Recommend `/srsp-sync` after acceptance if drift was detected.

7. **Present a concise summary.**
   - Top 3–5 requirements.
   - High-level design approach.
   - Number of tasks and any dependencies.
   - Any consistency warnings or open questions.

8. **Run the formal approval/refinement loop:**

   This is the formal approval gate. Before offering `Accept`, confirm:
   - `design.md` has a non-empty `## Testing Strategy` section.
   - `tasks.md` has verification tasks covering every functional requirement.

   Ask the user:
   - `Accept` — update `spec.md` stage to `proposal-approved`, record decision, recommend `/srsp-apply`. Only offer this when the testing strategy and verification tasks are present.
   - `Refine proposal` — ask what is missing/wrong, append notes to `proposal.md`, regenerate, present again.
   - `Refine design` — ask what is missing/wrong, append notes to `design.md`, regenerate, present again.
   - `Refine tasks` — ask what to change, update `tasks.md`, present again.
   - `Skip` — record reason, set stage to `proposal-skipped`, recommend `/srsp-apply`.
   - `Cancel` — set `status: cancelled`, record reason, stop.

9. **Update `spec.md` metadata after every decision.**
   - `stage: <new stage>`
   - `proposed: <ISO timestamp>` on accept/skip
   - `updated: <ISO timestamp>`
   - `stage-changed-at: <ISO timestamp>`
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
- [ ] Verify-1: Unit/integration/UI test for FR1
- [ ] Verify-2: Unit/integration/UI test for FR2

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
- A non-empty `## Testing Strategy` is required in `design.md`; approval is blocked without it.
- Verification tasks in `tasks.md` must cover every functional requirement; approval is blocked without them.
- Every stage decision must be recorded in `spec.md`.
- Commit and PR are not created here; they happen in `/srsp-apply` only after engineer approval.
- Stage transitions and Decision Log format must follow `docs/state-machine.md`.
