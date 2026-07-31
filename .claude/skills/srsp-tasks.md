---
name: srsp-tasks
description: Refine tasks.md for the active spec and warn if tasks lack coverage.
---

# /srsp-tasks — Refine the Tasks Only

Generate or update only `tasks.md` for the active spec. Useful when you want to reorder, add, or remove tasks without regenerating the full proposal or design.

## Prerequisite

- Read `.claude/specs/active-spec.txt`.
- Read `.claude/specs/<spec-name>/spec.md`.
- Read `.claude/specs/<spec-name>/proposal.md`.
- Read `.claude/specs/<spec-name>/design.md`.
- Read `.claude/specs/<spec-name>/tasks.md` if it exists.

## Steps

1. **Confirm active spec.**
   - Read `.claude/specs/active-spec.txt`.
   - Read the active spec's frontmatter to get `stage`.
   - Display: "Active spec: `<name>` (`<stage>`). Continue with this spec or switch?"
   - Offer: `Continue` or `Cancel`.
   - To switch active spec, tell the user to run `/srsp-switch` and stop.
   - If the current stage is earlier than `proposal-approved`, recommend `/srsp-propose` and stop.

2. **Generate or update `tasks.md`.**
   - Implementation Tasks (mapped to design TODOs)
   - Verification Tasks
   - Review / Release Tasks
   - Notes

3. **Cross-check consistency.**
   - Compare each implementation task in `tasks.md` against:
     - `design.md` `## Implementation TODOs` — each task should map to an existing TODO.
     - `proposal.md` `## Functional Requirements` — each task should trace back to at least one requirement.
   - If any task maps to a missing TODO or requirement, warn the engineer explicitly.
   - Recommend running `/srsp-propose` or `/srsp-design` to realign the artifacts.

4. **Present the plan.**
   - Ordered tasks with design mapping.
   - Any consistency warnings.

5. **Ask the user:**
   - `Accept` — keep the current `stage` (or set to `proposal-approved` if earlier), update `updated`, record decision.
   - `Edit` — let the user add, remove, or reorder tasks; rewrite `tasks.md` and present again.
   - `Refine` — ask what is missing, append notes, regenerate.
   - `Cancel` — stop.

6. **Update `spec.md` metadata and Decision Log.**
   - `stage: proposal-approved` (or keep current if later)
   - `updated: <ISO timestamp>`
   - Append to `## Decision Log` using the format from `docs/state-machine.md`:
     - On accept: `<timestamp> [proposal-approved] tasks refined: updated task plan`
     - On edit/refine loop: `<timestamp> [proposal-approved] tasks refined: <what changed>`
     - On cancel: `<timestamp> [proposal-approved] task refinement cancelled: <reason>`

## Rules

- Do not modify `proposal.md` or `design.md`.
- Tasks must be small enough to implement in one focused step.
- Preserve ordering and dependencies.
- Stage transitions and Decision Log format must follow `docs/state-machine.md`.
