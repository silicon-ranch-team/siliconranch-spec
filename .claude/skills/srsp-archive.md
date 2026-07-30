---
name: srsp-archive
description: Mark the active Silicon Ranch spec done, archived, cancelled, or reopened.
tags:
  - srsp
  - primary
  - archive
---

# /srsp-archive — Archive the Spec

Finalize the active spec: mark it done, archive it, cancel it, or reopen it.

## Prerequisite

- Read `.claude/specs/active-spec.txt`.
- Read `.claude/specs/<spec-name>/spec.md`.

## Steps

1. **Confirm active spec.**
   - Read `.claude/specs/active-spec.txt`.
   - Read the active spec's frontmatter to get `stage`.
   - Display: "Active spec: `<name>` (`<stage>`). Continue with this spec or switch?"
   - Offer: `Continue` or `Cancel`.
   - To switch active spec, tell the user to run `/srsp-switch` and stop.
   - If no active spec exists, offer `/srsp-switch` to select one.

2. **Show final spec state.**
   - Title, author, stage, status, test result, commit hash, PR URL (if any).
   - Last few Decision Log entries.

3. **Ask the engineer:**
   - `Done` — mark `status: done`, `stage: done`. Keep the spec in `.claude/specs/`.
   - `Archive` — move the spec directory to `.claude/specs/archive/<spec-name>/`, set `status: archived`, `stage: archived`.
   - `Cancel` — set `status: cancelled`, `stage: cancelled`. Keep directory for reference.
   - `Reopen` — set `status: active`, restore last meaningful stage, and recommend the next command.
   - To permanently delete the spec, use `/srsp-delete` instead.

4. **Update `spec.md` metadata:**
   - `stage: <done | archived | cancelled | <last-stage>>`
   - `status: <done | archived | cancelled | active>`
   - `archived: <ISO timestamp>` (if archived)
   - `updated: <ISO timestamp>`

5. **Append to `spec.md` Decision Log:**
   - Use the format from `docs/state-machine.md`:
     - Done: `<timestamp> [done] spec done: <note>`
     - Archived: `<timestamp> [archived] spec archived: <note>`
     - Cancelled: `<timestamp> [cancelled] spec cancelled: <note>`
     - Reopened: `<timestamp> [<last-stage>] spec reopened: restored from <previous-status>`

6. **If archived, clear the active spec file?**
   - If the archived spec was the active one, update `.claude/specs/active-spec.txt` to the next available active spec or leave it empty.

7. **Confirm to the user.**
   - Show the final state and any next recommended action.

## Rules

- Archive, cancel, and reopen require explicit confirmation.
- Deletion is handled by `/srsp-delete` and requires typed-name confirmation.
- Reopening restores the spec to the last stage before finalization.
- Stage transitions and Decision Log format must follow `docs/state-machine.md`.
