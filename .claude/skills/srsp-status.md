---
name: srsp-status
description: Show the active spec and a summary table of all Silicon Ranch specs.
tags:
  - srsp
  - primary
  - status
---

# /srsp-status — Show Spec Status

Show the current state of the Silicon Ranch spec workspace.

## Steps

1. **Confirm active spec.**
   - Read `.claude/specs/active-spec.txt` if it exists.
   - Read the active spec's frontmatter to get `stage`.
   - Display: "Active spec: `<name>` (`<stage>`). Continue or switch?"
   - Offer: `Continue`, `Switch active spec`, or `Cancel`.
   - `Switch active spec` invokes `/srsp-switch`.
   - If no active spec exists, offer `/srsp-start`.

2. **List all specs.**
   - Find every directory under `.claude/specs/` (and `.claude/specs/archive/` if it exists).
   - Skip the `templates` directory; it is not a spec.
   - For each, read only the frontmatter of `spec.md`.

3. **Present a table:**

   ```markdown
   | Spec | Title | Author | Stage | Status | Updated |
   |------|-------|--------|-------|--------|---------|
   | ...  | ...   | ...    | ...   | ...    | ...     |
   ```

4. **Show active spec details.**
   - Title, author, stage, status, last test result, commit hash, PR URL.
   - Last few Decision Log entries (optional, keep brief).
   - Recommended next command based on stage.

5. **Ask the user (optional):**
   - `Switch active spec` — invoke `/srsp-switch`.
   - `Start new spec` — invoke `/srsp-start`.
   - `Continue` — invoke the recommended next command for the active spec.

## Rules

- Do not modify any spec artifacts unless the user explicitly asks to switch the active spec.
- Read only the frontmatter of `spec.md` to keep token usage low.
- If no specs exist, prompt the user to run `/srsp-start`.
- Recommended next commands follow `docs/state-machine.md`.
