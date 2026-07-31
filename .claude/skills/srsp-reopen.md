---
name: srsp-reopen
description: Reopen a done, archived, or cancelled Silicon Ranch spec and prepare it for new work.
---

# /srsp-reopen — Reopen a Finalized Spec

Reopen a spec that was previously marked `done`, `archived`, or `cancelled`. Capture the reason, an optional ticket URL, and a new set of reopen tasks so the spec can re-enter the SRSP workflow.

## Prerequisite

- Read `.claude/specs/active-spec.txt`.
- Read `.claude/specs/<spec-name>/spec.md`.
- Read `.claude/specs/<spec-name>/tasks.md` if it exists.
- Read `.srsp-config.md` at the project root if it exists.
- Read `.claude/specs/<spec-name>/.srsp-config.md` if it exists.

## Steps

1. **Confirm active spec or accept a spec name.**
   - If the user provides a spec name, use it.
   - Otherwise read `.claude/specs/active-spec.txt`.
   - Read the spec's frontmatter to get `stage` and `status`.
   - Display: "Reopen spec: `<name>` (currently `<status>` / `<stage>`). Continue or switch?"
   - Offer: `Continue` or `Cancel`.
   - To switch active spec, tell the user to run `/srsp-switch` and stop.
   - If the spec is not in a terminal state (`done`, `archived`, `cancelled`), warn the engineer and recommend `/srsp-resume` or `/srsp-apply` instead.

2. **If the spec is archived, move it back to `.claude/specs/`.**
   - Source path: `.claude/specs/archive/<spec-name>/`
   - Destination path: `.claude/specs/<spec-name>/`
   - Do not overwrite an existing spec directory. If a collision exists, ask the engineer to resolve it manually.

3. **Ask for the reopen reason and optional ticket URL.**
   - Reason options:
     - `bug` — a defect was found after the spec was finalized.
     - `feature-request` — new scope was added to an already-finalized spec.
     - `regression` — previously working behavior broke.
     - `other` — let the engineer provide a short free-form reason.
   - Optional `ticket-url` — link to a bug tracker, issue, or support ticket.
   - Validate `ticket-url` against `ticket-base-url` from `.srsp-config.md` if configured. Warn if the URL does not match the expected base; do not block reopen.

4. **Ask for the target re-entry stage.**
   - `submitted` — treat the reopened spec as a fresh spec and recommend `/srsp-explore`.
   - `exploring` — jump straight back into exploration and recommend `/srsp-explore`.
   - Default: `submitted`.

5. **Update `spec.md` metadata:**
   - `status: active`
   - `stage: <submitted | exploring>` (the selected re-entry stage)
   - `updated: <ISO timestamp>`
   - `stage-changed-at: <ISO timestamp>`
   - `reopened-count: <n>` — increment if the field exists; otherwise set to `1`.
   - `last-reopened: <ISO timestamp>`
   - `reopened-reason: <reason>`
   - `reopened-ticket-url: <ticket-url>` (if provided)
   - Clear `commit-hash`, `pr-url`, `applied`, and `archived` if they were set, because the previous conclusion is no longer valid.

6. **Append to `spec.md` Decision Log:**
   - Use the format from `docs/state-machine.md`:
     - `<timestamp> [<new-stage>] spec reopened: reason=<reason>, previous-status=<previous-status>, ticket=<ticket-url-or-none>`

7. **Create a reopen work section in `tasks.md`.**
   - If `tasks.md` does not exist, create it with the standard stub frontmatter.
   - Append a new section at the end:

     ```markdown
     ## Reopen Tasks

     Reopened at <ISO timestamp> from `<previous-status>`.
     Reason: <reason>.
     Ticket: <ticket-url-or-none>.

     - [ ] Reopen-1: Confirm the spec context and current codebase state still match the original requirements.
     - [ ] Reopen-2: Identify which requirements, design TODOs, or tasks need to change because of the reopen reason.
     - [ ] Reopen-3: Update `proposal.md`, `design.md`, and/or `tasks.md` to reflect the new work.
     - [ ] Reopen-4: Run `/srsp-doctor` and `/srsp-coverage` to validate the updated artifacts.
     ```

   - Adjust the default tasks based on the reason:
     - `bug` — emphasize reproducing the bug and adding a regression test.
     - `feature-request` — emphasize updating requirements and design.
     - `regression` — emphasize identifying the changed code path and re-running tests.

8. **Update `.claude/specs/active-spec.txt`.**
   - Write the reopened spec name so it is the active spec.

9. **Confirm to the engineer and recommend the next command.**
   - Show the new stage, reason, and ticket.
   - Recommend the next command based on the selected re-entry stage:
     - `submitted` → `/srsp-explore`
     - `exploring` → `/srsp-explore`

## Rules

- Reopen requires explicit engineer confirmation.
- `/srsp-reopen` does not auto-delete the previous Decision Log; it appends to it.
- If the spec is archived, it must be moved out of `.claude/specs/archive/` before resuming work.
- Stage transitions and Decision Log format must follow `docs/state-machine.md`.
- The reopened spec is treated as a new iteration, so prior `commit-hash`, `pr-url`, `applied`, and `archived` values are cleared.
