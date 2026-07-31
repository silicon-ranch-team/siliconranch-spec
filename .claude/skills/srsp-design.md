---
name: srsp-design
description: Refine design.md for the active spec and warn if TODOs lack tasks.
---

# /srsp-design — Refine the Design Only

Generate or update only `design.md` for the active spec. Useful when you want to adjust technical approach without regenerating the full proposal or tasks.

## Prerequisite

- Read `.claude/specs/active-spec.txt`.
- Read `.claude/specs/<spec-name>/spec.md`.
- Read `.claude/specs/<spec-name>/proposal.md`.
- Read `.claude/specs/<spec-name>/design.md` if it exists.
- Read `.claude/specs/<spec-name>/tasks.md` if it exists.

## Steps

1. **Confirm active spec.**
   - Read `.claude/specs/active-spec.txt`.
   - Read the active spec's frontmatter to get `stage`.
   - Display: "Active spec: `<name>` (`<stage>`). Continue with this spec or switch?"
   - Offer: `Continue` or `Cancel`.
   - To switch active spec, tell the user to run `/srsp-switch` and stop.
   - If the current stage is earlier than `proposal-draft`, recommend `/srsp-propose` or `/srsp-explore` and stop.

2. **Generate or update `design.md`.**
   - Overview
   - Architecture / Approach
   - File Changes
   - API / Interface Definitions
   - Implementation TODOs
   - Testing Strategy
   - Risks & Mitigations
   - Refinement Notes

3. **Cross-check consistency.**
   - Compare the new `## Implementation TODOs` in `design.md` against `tasks.md` `## Implementation Tasks`.
   - If any TODO lacks a corresponding task, warn the engineer explicitly.
   - Recommend running `/srsp-tasks` or `/srsp-propose` to realign the task plan.

4. **Present summary.**
   - High-level approach and key TODOs.
   - Any consistency warnings.

5. **Ask the user:**
   - `Accept` — keep the current `stage` (or set to `proposal-draft` if earlier), update `updated`, record decision.
   - `Refine` — ask what to change, append notes, regenerate.
   - `Cancel` — stop.

6. **Update `spec.md` metadata and Decision Log.**
   - `stage: proposal-draft` (or keep current if later)
   - `updated: <ISO timestamp>`
   - Append to `## Decision Log` using the format from `docs/state-machine.md`:
     - On accept: `<timestamp> [proposal-draft] design refined: updated implementation TODOs`
     - On refine loop: `<timestamp> [proposal-draft] design refined: <what changed>`
     - On cancel: `<timestamp> [proposal-draft] design refinement cancelled: <reason>`

## Rules

- Do not modify `proposal.md` or `tasks.md`.
- If the new design changes the TODOs, warn the engineer that `tasks.md` may need updating via `/srsp-tasks` or `/srsp-propose`.
- Stage transitions and Decision Log format must follow `docs/state-machine.md`.
