---
name: srsp-delete
description: Permanently delete a Silicon Ranch spec after typed-name confirmation.
---

# /srsp-delete — Delete a Spec

Permanently remove a Silicon Ranch spec directory. This action requires explicit confirmation and is irreversible.

## Prerequisite

- Read `.claude/specs/active-spec.txt`.
- Read `.claude/specs/<spec-name>/spec.md`.

## Steps

1. **Confirm active spec.**
   - Read `.claude/specs/active-spec.txt`.
   - Read the active spec's frontmatter to get `stage`.
   - Display: "Active spec: `<name>` (`<stage>`). Delete this spec or switch?"
   - Offer: `Delete this spec`, `Switch active spec`, or `Cancel`.
   - `Switch active spec` invokes `/srsp-switch`.
   - If no active spec exists, offer `/srsp-switch` to select one.

2. **Show what will be deleted.**
   - Display the spec directory path: `.claude/specs/<spec-name>/`.
   - Show the title, stage, and last few Decision Log entries.
   - Warn that deletion is permanent and cannot be undone.

3. **Require typed confirmation.**
   - Ask the engineer to type the exact spec name to proceed.
   - Example prompt: "Type `<name>` to confirm deletion."
   - Compare input to the spec name character-for-character.
   - If input does not match, cancel and recommend `/srsp-archive` for a safer option.

4. **Record deletion intent in `spec.md` (before removal).**
   - Append to Decision Log using the format from `docs/state-machine.md`:
     - `<timestamp> [deleted] spec deleted: permanent removal by engineer`
   - Update `updated: <ISO timestamp>`.

5. **Delete the spec directory.**
   - Remove `.claude/specs/<spec-name>/` and all contents.

6. **Update `.claude/specs/active-spec.txt` if needed.**
   - If the deleted spec was the active one, set `active-spec.txt` to the next available active spec or leave it empty.

7. **Confirm to the engineer.**
   - Show that the spec was deleted and the new active spec (if any).

## Rules

- Never delete without typed-name confirmation.
- Deletion is irreversible; do not offer a soft-delete or undo option.
- Prefer `/srsp-archive` for normal completion; reserve `/srsp-delete` for permanently removing a spec.
- Decision Log format must follow `docs/state-machine.md`.
