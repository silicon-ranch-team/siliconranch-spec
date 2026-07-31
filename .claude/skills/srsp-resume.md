---
name: srsp-resume
description: Resume the active spec by reading its stage and invoking the next skill.
---

# /srsp-resume — Resume the Active Spec

Read the active spec's current stage and recommend or invoke the next appropriate SRSP command.

## Prerequisite

- Read `.claude/specs/active-spec.txt`.
- Read `.claude/specs/<spec-name>/spec.md` frontmatter.

## Steps

1. **Confirm active spec.**
   - Read `.claude/specs/active-spec.txt`.
   - Read the active spec's frontmatter to get `stage`.
   - Display: "Active spec: `<name>` (`<stage>`). Continue with this spec or switch?"
   - Offer: `Continue` or `Cancel`.
   - To switch active spec, tell the user to run `/srsp-switch` and stop.
   - If no active spec exists, offer `/srsp-start`.

2. **Map stage to next command.**

   | Stage | Recommended command |
   |-------|---------------------|
   | `submitted` | `/srsp-explore` |
   | `exploring` | `/srsp-propose` |
   | `proposal-draft` | `/srsp-propose` |
   | `proposal-approved` | `/srsp-apply` |
   | `implementing` | `/srsp-apply` |
   | `verified` | `/srsp-apply` |
   | `review-approved` | `/srsp-apply` |
   | `committed` | `/srsp-apply` |
   | `pr-created` | `/srsp-apply` |
   | `applied` | `/srsp-archive` |
   | `done` | `/srsp-status` or `/srsp-start` |
   | `archived` | `/srsp-status` or `/srsp-start` |
   | `cancelled` | `/srsp-status` or `/srsp-start` |

3. **Present recommendation.**
   - Display: "`<name>` is at stage `<stage>`. Recommended next step: `/srsp-<command>`."
   - If `stage` is `done`, `archived`, or `cancelled`, explain that the spec is finalized and offer to start a new one or review status.

4. **Ask the engineer:**
   - `Run recommended command` — invoke it.
   - `Switch spec` — invoke `/srsp-switch`.
   - `Cancel` — stop.

5. **Update `spec.md` metadata and Decision Log (optional).**
   - If the engineer proceeds, append a resume entry using the format from `docs/state-machine.md`:
     - `<timestamp> [<stage>] resume: recommended /srsp-<command>`
   - Update `updated: <ISO timestamp>`.

## Rules

- Never invoke an engineer-owned action (commit, PR, archive) without explicit engineer approval.
- If the stage is unrecognized, recommend `/srsp-status` and warn the engineer.
- `/srsp-resume` is a convenience wrapper; the actual work still happens in the target skill.
- Decision Log format must follow `docs/state-machine.md`.
