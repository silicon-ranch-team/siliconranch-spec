# Plan: SRSP Phase 3 — Developer Experience

**Goal:** Make the framework smoother and easier to learn without changing the core workflow.

**Scope:** Skill instruction updates, one new `/srsp-switch` skill, and documentation. No project source code is modified.

---

## 3.1 Add `/srsp-switch` skill (already partly covered by `/srsp-status`, but make it standalone)

**Create:** `.claude/skills/srsp-switch.md`

**Behavior:**
- List all specs with their stage and status (read only frontmatter).
- Let the engineer pick a new active spec by name.
- Update `.claude/specs/active-spec.txt`.
- Show the new active spec and recommend the next command.
- If no specs exist, offer `/srsp-start`.

**Why:** Centralizes switching logic so other skills can say "invoke `/srsp-switch`" instead of each implementing their own prompt.

---

## 3.2 Clarify `/srsp-explore` vs `/srsp-propose`

**Update:** `.claude/skills/srsp-explore.md`

**Changes:**
- `/srsp-explore` should **not** ask for formal Accept/Refine/Skip/Cancel.
- It should set `stage: exploring`, not `proposal-draft`.
- It drafts an initial `proposal.md` as a **starting point** for `/srsp-propose`.
- At the end, it asks:
  - `Ready to formalize in /srsp-propose` — set `stage: exploring`, recommend `/srsp-propose`.
  - `Explore more` — ask another round of questions.
  - `Cancel` — set `status: cancelled`, record reason.

**Update:** `.claude/skills/srsp-propose.md`

**Changes:**
- Keep `/srsp-propose` as the formal approval point.
- When invoked from `exploring` or `proposal-draft`, present the proposal/design/tasks and run the approval/refinement loop.
- On Accept, set `stage: proposal-approved`.

---

## 3.3 Document parallel spec handling

**Update:** `docs/spec-driven-framework.md`

**Add a section:** "Working with multiple specs"
- Only one spec is active at a time (tracked in `.claude/specs/active-spec.txt`).
- Use `/srsp-status` to see all specs.
- Use `/srsp-switch` to change the active spec.
- Use `/srsp-resume` to continue the active spec from its current stage.
- Each skill confirms the active spec before acting on it.

---

## 3.4 Add a quick reference to `/srsp-resume` and `/srsp-switch` in all skill flows

**Update:** `.claude/skills/srsp-*.md` where relevant
- When offering to switch specs, reference `/srsp-switch`.
- When the engineer is unsure what to do next, reference `/srsp-resume`.

---

## 3.5 Consistency: standardize "offer to switch" wording

**Update:** all skills that say "Switch active spec"
- Replace with "Switch active spec via `/srsp-switch`" or "Invoke `/srsp-switch`".
- Keep `/srsp-status` as the listing option.

---

## Order of execution

1. Create `/srsp-switch.md`.
2. Update `/srsp-explore.md` to be non-formal (stage stays `exploring`).
3. Update `/srsp-propose.md` to be the formal approval point.
4. Update all "Switch active spec" prompts to reference `/srsp-switch`.
5. Add "Working with multiple specs" section to `docs/spec-driven-framework.md`.
6. Update `.claude/CLAUDE.md` and `README.md` to list `/srsp-switch`.
7. Final consistency review.
