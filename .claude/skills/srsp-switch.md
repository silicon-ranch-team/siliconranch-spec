---
name: srsp-switch
description: Switch the active Silicon Ranch spec by selecting from all available specs.
---

# /srsp-switch — Switch the Active Spec

List all specs and switch the active one.

## Prerequisite

- Read `.claude/specs/active-spec.txt`.
- Read the frontmatter of every `spec.md` under `.claude/specs/` and `.claude/specs/archive/`.

## Steps

1. **Read current active spec.**
   - Read `.claude/specs/active-spec.txt`.
   - Display: "Current active spec: `<name>` (`<stage>`)."

2. **List all specs.**
   - Find every directory under `.claude/specs/` (excluding `archive` and `templates` at the top level; include specs inside `archive/` separately).
   - For each, read only the frontmatter of `spec.md`.
   - Present a table:
     ```markdown
     | Spec | Title | Stage | Status | Updated |
     |------|-------|-------|--------|---------|
     | ...  | ...   | ...   | ...    | ...     |
     ```
   - Mark archived specs separately or include a note.

3. **Ask the engineer to pick a new active spec.**
   - Offer a numbered list or ask the engineer to type the spec name.
   - If there is only one spec, offer to activate it directly.
   - Options:
     - `Switch to <spec-name>` — update `.claude/specs/active-spec.txt`.
     - `Start new spec` — invoke `/srsp-start`.
     - `Cancel` — stop without changing.

4. **Update the active spec file.**
   - Write the selected spec name to `.claude/specs/active-spec.txt`.

5. **Confirm and recommend next step.**
   - Display: "Active spec is now `<name>` (`<stage>`)."
   - Recommend the next command based on stage (or `/srsp-resume`).

## Rules

- Do not modify any spec artifact; only change `.claude/specs/active-spec.txt`.
- If the selected spec is archived, inform the engineer and offer `/srsp-archive` to reopen it first.
- If no specs exist, prompt to run `/srsp-start`.
- Recommended next commands follow `docs/state-machine.md`.
