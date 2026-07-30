# Plan: SRSP Phase 2 — Safety & Guardrails

**Goal:** Add guardrails that reduce mistakes, make the framework more robust, and keep engineer-owned actions explicit.

**Scope:** Skill instruction updates only. No project source code is modified.

---

## 2.2 Add `/srsp-doctor` skill

**Create:** `.claude/skills/srsp-doctor.md`

**Behavior:**
- Read the active spec from `.claude/specs/active-spec.txt`.
- Read the active spec's `spec.md` frontmatter.
- Validate:
  - Required frontmatter fields exist: `spec`, `title`, `author`, `status`, `stage`, `created`, `updated`.
  - `status` is one of: `active`, `done`, `archived`, `cancelled`.
  - `stage` is one of the canonical values:
    `submitted`, `exploring`, `proposal-draft`, `proposal-approved`, `implementing`, `verified`, `review-approved`, `committed`, `pr-created`, `applied`, `done`, `archived`, `cancelled`.
  - Artifact files exist according to the current stage:
    - `submitted` → `spec.md` only.
    - `exploring` / `proposal-draft` → `spec.md`, `proposal.md`.
    - `proposal-approved` → `spec.md`, `proposal.md`, `design.md`, `tasks.md`.
    - `implementing` and beyond → all four files.
  - FR→TODO→Task coverage:
    - Every functional requirement in `proposal.md` maps to at least one TODO in `design.md`.
    - Every TODO in `design.md` maps to at least one task in `tasks.md`.
    - Every implementation task in `tasks.md` maps back to a requirement.
- Report findings in a table with severity: OK / Warning / Error.
- Offer next actions:
  - `Run recommended fix` — invoke the appropriate granular skill (`/srsp-propose`, `/srsp-design`, `/srsp-tasks`).
  - `Show details` — list specific missing mappings.
  - `Switch spec` — invoke `/srsp-status`.
  - `Cancel` — stop.

---

## 2.3 Spec naming validation in `/srsp-start`

**Update:** `.claude/skills/srsp-start.md`

**Behavior:**
- Add a naming validation step after the spec name is collected.
- Accept kebab-case or snake_case only.
- Regex: `^[a-z0-9]+(?:[-_][a-z0-9]+)*$`.
- If the name is invalid:
  - Explain the rule.
  - Suggest a normalized name derived from the title (lowercase, replace spaces/special chars with `-`).
  - Ask the engineer to confirm, edit, or cancel.
- Reject names that are `.`, `..`, or conflict with reserved filenames.

---

## 2.4 Move Delete out of `/srsp-archive`

**Create:** `.claude/skills/srsp-delete.md`

**Behavior:**
- Read the active spec.
- Require the engineer to type the exact spec name to confirm deletion.
- Show what will be removed: the entire `.claude/specs/<spec-name>/` directory.
- Ask:
  - `Delete` — only if typed name matches.
  - `Cancel` — stop.
- On deletion, remove the directory and clear `active-spec.txt` if it pointed to this spec.
- Record the deletion in `spec.md` Decision Log before removing the file.

**Update:** `.claude/skills/srsp-archive.md`

**Behavior:**
- Remove the `Delete` option from the archive menu.
- Keep `Done`, `Archive`, `Cancel`, `Reopen`.
- Add a note: "To permanently delete a spec, use `/srsp-delete`."

---

## 2.5 Branch management in `/srsp-apply` and `/srsp-pr`

**Update:** `.claude/skills/srsp-apply.md`

**Behavior:**
- At the start of `/srsp-apply` (after active-spec confirmation), check the current git branch.
- If on the default branch (`main` or `master`):
  - Warn that implementation should happen on a feature branch.
  - Offer to create and switch to a branch named `<spec-name>`.
  - Ask: `Create feature branch`, `Continue on default branch`, or `Cancel`.
- If already on a feature branch, proceed.

**Update:** `.claude/skills/srsp-pr.md`

**Behavior:**
- If on the default branch, refuse to create a PR unless the engineer explicitly confirms.
- Show a strong warning: "Creating a PR from the default branch is usually not what you want."
- Ask:
  - `Create feature branch <spec-name>` and switch.
  - `Explicitly create PR from default branch` — requires a second confirmation.
  - `Cancel`.

---

## Documentation updates

- Update `docs/spec-driven-framework.md`:
  - Add `/srsp-doctor` and `/srsp-delete` to command tables.
  - Add a "Safety & Guardrails" section covering validation, delete protection, and branch warnings.
- Update `.claude/CLAUDE.md`:
  - Add `/srsp-doctor` and `/srsp-delete` to the quick-start / command list.
  - Keep `/srsp-resume` from Phase 1.
- Update `README.md`:
  - Add `/srsp-doctor` and `/srsp-delete` to the appropriate sections.

---

## Order of execution

1. Create `/srsp-doctor.md`.
2. Update `/srsp-start.md` with spec naming validation.
3. Create `/srsp-delete.md`.
4. Update `/srsp-archive.md` to remove Delete option.
5. Update `/srsp-apply.md` with branch check.
6. Update `/srsp-pr.md` with default-branch refusal.
7. Update docs and indexes.
8. Final consistency review.
