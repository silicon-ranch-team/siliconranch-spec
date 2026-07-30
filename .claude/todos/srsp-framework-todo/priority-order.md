# SRSP Framework Recommended Priority Order

**Date:** 2026-07-28

This is the recommended order for refining the framework. Items are grouped by priority and dependency.

---

## Phase 1: Quick Wins (Do First)

These are small, safe changes with high immediate value.

1. **Make `/srsp-apply` resumable.**
   - Detect current stage and first unchecked task.
   - Ask where to resume: `implement`, `verify`, `review`, `commit`, `pr`.
   - Update stage metadata after each sub-step.

2. **Fix the example spec consistency.**
   - Change `stage: applied` to `stage: review-approved`.
   - Keep `commit-hash` and `pr-url` empty.
   - Fix the Decision Log last entry.
   - Update `tasks.md` Review/Release Tasks checkboxes.

3. **Add consistency warnings to granular skills.**
   - `/srsp-proposal` warns if new requirements lack TODOs/tasks.
   - `/srsp-design` warns if new TODOs lack tasks.
   - `/srsp-tasks` warns if tasks map to missing TODOs.

4. **Shorten skill descriptions.**
   - Keep every description under 120 characters.
   - Update descriptions in all skill files.

5. **Normalize skill tags.**
   - Primary skills: `srsp`, `primary`, `<domain>`.
   - Granular skills: `srsp`, `granular`, `<domain>`.

---

## Phase 2: Safety & Guardrails

These reduce the risk of mistakes and make the framework more robust.

6. **Make every skill show and confirm the active spec.**
   - Display: "Active spec: `<name>` (`<stage>`). Continue or switch?"
   - Recommend the correct next command if stage is wrong.

7. **Add `/srsp-doctor` skill.**
   - Validate `spec.md` metadata.
   - Validate artifact existence.
   - Validate FR→TODO→Task coverage.

8. **Add spec naming validation in `/srsp-start`.**
   - Enforce kebab-case or snake_case.
   - Suggest a normalized name from the title.

9. **Move `Delete` out of `/srsp-archive`.**
   - Create separate `/srsp-delete` skill.
   - Require typed spec-name confirmation.

10. **Add branch management guidance in `/srsp-apply` and `/srsp-pr`.**
    - Offer to create a feature branch from default branch.
    - Refuse PR creation from default branch unless explicitly confirmed.

---

## Phase 3: Developer Experience

These make the framework smoother and easier to learn.

11. **Add `/srsp-resume` convenience skill.**
    - Read active spec stage.
    - Recommend or invoke the correct next command.

12. **Add `/srsp-switch` skill for safer active spec switching.**
    - Centralize switching logic.
    - Use it from `/srsp-status` and other skills.

13. **Clarify `/srsp-explore` vs `/srsp-propose`.**
    - `/srsp-explore` should not set `proposal-draft` or ask for formal approval.
    - `/srsp-propose` is the formal approval point.

14. **Document parallel spec handling.**
    - Explain one active spec at a time.
    - Explain how to switch and resume.

---

## Phase 4: Structural / Architectural

These are larger changes that improve maintainability and extensibility.

15. **Standardize Decision Log entry format.**
    - Use ISO timestamps and include stage/decision.
    - Update all skills to write in the new format.

16. **Create a unified state machine document.**
    - Define allowed stage transitions.
    - Reference it from every skill.

17. **Handle empty artifact stubs robustly.**
    - Seed stubs with minimal valid frontmatter.
    - Make skills generate missing artifacts instead of failing.

18. **Consider splitting `/srsp-list` from `/srsp-status`.**
    - `/srsp-list` = all specs table.
    - `/srsp-status` = active spec details + next action.

---

## Phase 5: Future Considerations

19. **Per-spec configuration overrides.**
    - Optional `.srsp-config.md` per spec.
    - Override test command, branch naming, commit prefix, PR requirements.

20. **Integration with issue trackers or project management tools.**
    - Optional skill to link a spec to a ticket.
    - Record ticket URL in `spec.md` metadata.

21. **Template specs.**
    - Allow starting from a template (e.g., `api-endpoint`, `bug-fix`, `refactor`).
    - Pre-seed `proposal.md`, `design.md`, `tasks.md` with template sections.

22. **Create an installable SRSP CLI.**
    - Publish an npm package named after the framework.
    - Provide global/local install via `npm install -g <framework_name>`.
    - Surface workflow helpers and maintain version control with releases and a changelog.

23. **GitHub Pages documentation workflow.**
    - Choose between JSDoc and Sphinx (or MkDocs / TypeDoc) based on maintainability and project fit.
    - Add `.github/workflows/docs.yml` triggered on `main` pushes.
    - Build docs into HTML and deploy with `actions/deploy-pages`.

---

## Suggested First-Day Plan

If you have one day to refine, do these in order:

1. `/srsp-apply` resumability.
2. Fix example spec consistency.
3. Granular skill consistency warnings.
4. Active spec confirmation in every skill.
5. Add `/srsp-resume`.

That set alone will make the framework feel significantly more robust and user-friendly.
