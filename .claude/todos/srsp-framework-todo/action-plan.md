# SRSP Framework Action Plan

**Date:** 2026-07-28

Turned the evaluation and recommendations into a checkable task list. Use this as the execution backlog.

---

## Phase 1: Quick Wins

- [x] 1.1 Make `/srsp-apply` resumable
  - [x] Detect current stage on entry.
  - [x] Find first unchecked task in `tasks.md` if `stage: implementing`.
  - [x] Ask engineer where to resume: `implement`, `verify`, `review`, `commit`, `pr`.
  - [x] Update `stage` metadata after each sub-step:
    - `implementing`
    - `verified`
    - `review-approved`
    - `committed`
    - `pr-created`
    - `applied`

- [x] 1.2 Fix example spec consistency
  - [x] Change `stage: applied` to `stage: review-approved` in `spec.md`.
  - [x] Keep `commit-hash: ""` and `pr-url: ""`.
  - [x] Fix last Decision Log entry to indicate pending commit/PR.
  - [x] Update `tasks.md` Review/Release Tasks checkboxes.

- [x] 1.3 Add consistency warnings to granular skills
  - [x] `/srsp-proposal`: warn if new requirements lack TODOs/tasks.
  - [x] `/srsp-design`: warn if new TODOs lack tasks.
  - [x] `/srsp-tasks`: warn if tasks map to missing TODOs.

- [x] 1.4 Shorten all skill descriptions to under 120 characters
  - [x] `/srsp-start`
  - [x] `/srsp-explore`
  - [x] `/srsp-propose`
  - [x] `/srsp-apply`
  - [x] `/srsp-archive`
  - [x] `/srsp-status`
  - [x] `/srsp-proposal`
  - [x] `/srsp-design`
  - [x] `/srsp-tasks`
  - [x] `/srsp-verify`
  - [x] `/srsp-commit`
  - [x] `/srsp-pr`

- [x] 1.5 Normalize skill tags
  - [x] Primary skills: `srsp`, `primary`, `<domain>`.
  - [x] Granular skills: `srsp`, `granular`, `<domain>`.

---

## Phase 2: Safety & Guardrails

- [x] 2.1 Active spec confirmation in every skill
  - [x] Display active spec name and stage on skill entry.
  - [x] Offer to switch if the engineer wants a different spec.
  - [x] Recommend correct next command if stage is wrong.

- [x] 2.2 Add `/srsp-doctor` skill
  - [x] Validate `spec.md` frontmatter fields.
  - [x] Validate canonical stage values.
  - [x] Validate artifact existence for current stage.
  - [x] Validate FR→TODO→Task coverage.
  - [x] Report results in a table.

- [x] 2.3 Spec naming validation in `/srsp-start`
  - [x] Enforce kebab-case or snake_case regex.
  - [x] Suggest normalized name from title.

- [x] 2.4 Move Delete out of `/srsp-archive`
  - [x] Create `/srsp-delete` skill.
  - [x] Require typed spec-name confirmation.
  - [x] Remove `Delete` option from `/srsp-archive`.

- [x] 2.5 Branch management in `/srsp-apply` and `/srsp-pr`
  - [x] Check current branch at start of `/srsp-apply`.
  - [x] Offer to create feature branch `<spec-name>` if on default branch.
  - [x] `/srsp-pr` refuses default branch unless explicitly confirmed.

---

## Phase 3: Developer Experience

- [x] 3.1 Add `/srsp-resume` convenience skill
  - [x] Read active spec stage.
  - [x] Recommend or invoke next appropriate skill.

- [x] 3.2 Add `/srsp-switch` skill
  - [x] List all specs.
  - [x] Let engineer pick new active spec.
  - [x] Update `.claude/specs/active-spec.txt`.

- [x] 3.3 Clarify `/srsp-explore` vs `/srsp-propose`
  - [x] `/srsp-explore` should set `stage: exploring`, not `proposal-draft`.
  - [x] `/srsp-explore` should not ask for formal Accept/Refine/Skip/Cancel.
  - [x] `/srsp-propose` remains the formal approval point.

- [x] 3.4 Document parallel spec handling
  - [x] Add section to `docs/spec-driven-framework.md`.
  - [x] Explain active spec switching and resumption.

---

## Phase 4: Structural / Architectural

- [x] 4.1 Standardize Decision Log entry format
  - [x] Use format: `<ISO timestamp> [<stage>] <decision>: <note>`.
  - [x] Update all skills to write in new format.
  - [x] Update example spec Decision Log to match.
  - [x] Update `docs/spec-driven-framework.md` Decision Log section.

- [x] 4.2 Create unified state machine document
  - [x] Create `docs/state-machine.md` with stages, transitions, required artifacts, and entry commands.
  - [x] Reference from every skill.
  - [x] Reference from `docs/spec-driven-framework.md`, `.claude/CLAUDE.md`, and `README.md`.

- [x] 4.3 Handle empty artifact stubs robustly
  - [x] Seed stubs with minimal valid frontmatter in `/srsp-start`.
  - [x] Add missing-artifact guard to `/srsp-apply` that recommends `/srsp-propose`.

- [x] 4.4 Consider splitting `/srsp-list` from `/srsp-status`
  - [x] Evaluated: `/srsp-status` already lists all specs and shows active spec details; `/srsp-switch` also lists specs for selection.
  - [x] Decision: Defer `/srsp-list` to avoid redundancy. Revisit if the dashboard grows beyond one screen.

---

## Phase 5: Future Considerations

- [x] 5.1 Per-spec configuration overrides
  - [x] Optional `.srsp-config.md` per spec.
  - [x] Override test command, branch naming, commit prefix, PR target.
  - [x] Updated `/srsp-start`, `/srsp-apply`, `/srsp-verify`, `/srsp-commit`, `/srsp-pr` to read overrides.

- [x] 5.2 Issue tracker integration
  - [x] Created `/srsp-link` skill to record ticket URL.
  - [x] Added `ticket-url` metadata field to `spec.md` and CLI start command.

- [x] 5.3 Template specs
  - [x] Created templates under `.claude/specs/templates/`: `api-endpoint`, `ui-component`, `bug-fix`, `refactor`.
  - [x] Updated `/srsp-start` and CLI `start` to support `--template`.
  - [x] Updated skills/CLI to ignore the `templates` directory as a spec.

- [x] 5.4 Create an installable SRSP CLI
  - [x] Scaffolded npm package `silicon-ranch-spec`.
  - [x] Added CLI commands: `init`, `start`, `status`, `switch`, `doctor`, `help`.
  - [x] Added `CHANGELOG.md`, `package.json`, `bin/srsp.js`, and `src/commands/`.
  - [x] Added install, usage, and publishing instructions to `README.md`.

- [x] 5.5 Add GitHub Pages documentation workflow
  - [x] Chose MkDocs Material for markdown docs.
  - [x] Created `.github/workflows/docs.yml`.
  - [x] Created `mkdocs.yml` and `docs/index.md`, `docs/cli.md`.
  - [x] Documented workflow badge/URL in `README.md`.

---

## If You Only Do One Day of Work

1. [ ] `/srsp-apply` resumability.
2. [ ] Fix example spec consistency.
3. [ ] Granular skill consistency warnings.
4. [ ] Active spec confirmation in every skill.
5. [ ] Add `/srsp-resume`.
