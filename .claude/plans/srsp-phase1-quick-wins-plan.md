# Plan: SRSP Phase 1 Quick Wins

**Goal:** Implement the five recommended first-day actions from the SRSP framework evaluation backlog.

**Scope:** Read-only changes to framework behavior are not possible; this plan updates skill instructions and the example spec only. No project source code is modified.

---

## 1. Make `/srsp-apply` resumable

**Files:** `.claude/skills/srsp-apply.md`

**Changes:**
- Add an entry step that reads the active spec's current `stage` from `spec.md` metadata.
- Define resume behavior for each relevant stage:
  - `proposal-approved` → ask whether to start implementing or review artifacts first.
  - `implementing` → find the first unchecked task in `tasks.md`; ask whether to resume from there, restart implementation, or jump ahead to verify/review/commit/PR.
  - `verified` → ask whether to proceed to engineer review, re-run tests, or go back.
  - `review-approved` → ask whether to commit, skip commit, or go back.
  - `committed` → ask whether to create PR, skip PR, or go back.
  - `pr-created` → finalize to `applied`.
- After each sub-step, update `spec.md` metadata:
  - `implementing` after first task begins.
  - `verified` after tests pass (or are explicitly skipped).
  - `review-approved` after engineer approval.
  - `committed` after commit.
  - `pr-created` after PR creation.
  - `applied` after finalization.
- Append a Decision Log entry after every sub-step transition.
- Preserve existing engineer-owned confirmation rules for commit and PR.

---

## 2. Fix `example-todo-api` spec consistency

**Files:**
- `.claude/specs/example-todo-api/spec.md`
- `.claude/specs/example-todo-api/tasks.md`

**Changes:**
- In `spec.md` frontmatter:
  - Change `stage: applied` to `stage: review-approved`.
  - Leave `commit-hash: ""` and `pr-url: ""` empty.
  - Update `updated` timestamp to today (`2026-07-29`).
- In `spec.md` Decision Log:
  - Replace the last entry with a clear "commit/PR pending engineer action" entry.
  - Keep all earlier entries unchanged.
- In `tasks.md`:
  - Leave `Engineer review and approval` checked `[x]`.
  - Leave `Engineer commits approved changes` unchecked `[ ]`.
  - Leave `Engineer creates pull request (optional)` unchecked `[ ]`.

---

## 3. Add consistency warnings to granular skills

**Files:**
- `.claude/skills/srsp-proposal.md`
- `.claude/skills/srsp-design.md`
- `.claude/skills/srsp-tasks.md`

**Changes:**
- `/srsp-proposal`: after regenerating `proposal.md`, compare its functional requirements against `design.md` TODOs and `tasks.md` tasks. If any requirement has no clear mapping, warn the engineer and recommend `/srsp-design` or `/srsp-tasks` or `/srsp-propose` to realign.
- `/srsp-design`: after regenerating `design.md`, compare its implementation TODOs against `tasks.md` tasks. If any TODO lacks a corresponding task, warn the engineer and recommend `/srsp-tasks` or `/srsp-propose`.
- `/srsp-tasks`: after regenerating `tasks.md`, compare its tasks against `design.md` TODOs and `proposal.md` requirements. If any task maps to a missing TODO or requirement, warn the engineer and recommend `/srsp-propose` or `/srsp-design`.
- Keep the existing rule that granular skills do not modify the other artifacts unless explicitly asked.

---

## 4. Add active-spec confirmation to every skill

**Files:** all `.claude/skills/srsp-*.md` skills.

**Changes:**
- Add a preamble step near the top of each skill (where applicable):
  - Read `.claude/specs/active-spec.txt`.
  - Read the active spec's frontmatter to get `stage`.
  - Display: "Active spec: `<name>` (`<stage>`). Continue or switch?"
  - Offer: `Continue`, `Switch active spec`, or `Cancel`.
- If the current stage is wrong for the invoked skill, recommend the correct next command before proceeding (e.g., `/srsp-apply` invoked while stage is `exploring` should recommend `/srsp-propose`).
- `/srsp-start` is special: it creates a new active spec, but it should still warn if an active spec already exists and confirm whether to create a new one or switch first.
- `/srsp-status` already lists specs; add the same active-spec confirmation prompt and a `Switch` option.

---

## 5. Add `/srsp-resume` convenience skill

**Files:**
- Create `.claude/skills/srsp-resume.md`
- Update `.claude/CLAUDE.md` and `docs/spec-driven-framework.md` to list the new command.

**Changes:**
- Read active spec and its `stage`.
- Map stage to the recommended next command:
  - `submitted` → `/srsp-explore`
  - `exploring` / `proposal-draft` → `/srsp-propose`
  - `proposal-approved` / `implementing` / `verified` / `review-approved` / `committed` / `pr-created` → `/srsp-apply`
  - `applied` → `/srsp-archive`
  - `done` / `archived` / `cancelled` → inform the engineer and offer `/srsp-status` or `/srsp-start`
- Present the recommendation and ask:
  - `Run recommended command` — invoke it.
  - `Switch spec` — call `/srsp-status`.
  - `Cancel` — stop.

---

## Documentation updates

- Update `docs/spec-driven-framework.md`:
  - Add `/srsp-resume` to the command tables.
  - Mention resumable `/srsp-apply`.
  - Mention active-spec confirmation.
- Update `.claude/CLAUDE.md`:
  - Add `/srsp-resume` to the quick-start and command list.
  - Keep the existing 4-file layout and engineer-owned rules.

---

## Verification

After edits:
1. Run a quick consistency check across all skill files for duplicated or conflicting active-spec confirmation wording.
2. Verify the `example-todo-api/spec.md` frontmatter and Decision Log no longer contradict `tasks.md`.
3. Confirm `/srsp-resume` appears in docs and `.claude/CLAUDE.md`.

---

## Order of execution

1. Fix example spec consistency (small, safe).
2. Update `/srsp-apply` resumability.
3. Add consistency warnings to granular skills.
4. Add active-spec confirmation to all skills.
5. Create `/srsp-resume` skill.
6. Update documentation indexes.
7. Final consistency review.
