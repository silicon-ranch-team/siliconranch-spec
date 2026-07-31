---
name: srsp-proposal
description: Refine proposal.md for the active spec and warn on missing coverage.
---

# /srsp-proposal — Refine the Proposal Only

Generate or update only `proposal.md` for the active spec. Useful when you want to adjust requirements without touching design or tasks.

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
   - If the current stage is earlier than `submitted`, recommend `/srsp-start` and stop.

2. **Generate or update `proposal.md`.**
   - Summary
   - Functional Requirements with acceptance criteria
   - Non-Functional Requirements
   - Constraints & Assumptions
   - Open Questions
   - Refinement Notes

3. **Cross-check consistency.**
   - Compare the new functional requirements in `proposal.md` against:
     - `design.md` `## Implementation TODOs` — each requirement should trace to at least one TODO.
     - `tasks.md` `## Implementation Tasks` — each requirement should trace to at least one task.
   - If any requirement has no clear TODO or task mapping, warn the engineer explicitly.
   - Recommend running `/srsp-design`, `/srsp-tasks`, or `/srsp-propose` to realign the artifacts.

4. **Present summary.**
   - Top requirements and any open questions.
   - Any consistency warnings.

5. **Ask the user:**
   - `Accept` — update `spec.md` stage to `proposal-draft` (or keep current proposal stage), record decision.
   - `Refine` — ask what to change, append notes, regenerate.
   - `Cancel` — stop.

6. **Update `spec.md` metadata and Decision Log.**
   - `stage: proposal-draft` (or keep current if later)
   - `updated: <ISO timestamp>`
   - `stage-changed-at: <ISO timestamp>` (only if stage actually changed)
   - Append to `## Decision Log` using the format from `docs/state-machine.md`:
     - On accept: `<timestamp> [proposal-draft] proposal refined: updated requirements`
     - On refine loop: `<timestamp> [proposal-draft] proposal refined: <what changed>`
     - On cancel: `<timestamp> [proposal-draft] proposal refinement cancelled: <reason>`

## Rules

- Do not modify `design.md` or `tasks.md`.
- If design/tasks become inconsistent with the new proposal, warn the engineer and recommend `/srsp-propose` to realign everything.
- Preserve the user's original spec text unchanged in `spec.md`.
- Stage transitions and Decision Log format must follow `docs/state-machine.md`.
