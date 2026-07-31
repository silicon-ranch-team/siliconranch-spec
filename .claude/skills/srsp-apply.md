---
name: srsp-apply
description: Implement, verify, review, commit, and PR the active Silicon Ranch spec.
---

# /srsp-apply — Apply the Approved Spec

Implement, verify, review, commit, and open a PR for the active spec — resuming from wherever the workflow last stopped. Engineer approval is required for commit and PR.

## Prerequisite

- Read `.claude/specs/active-spec.txt`.
- Read `.claude/specs/<spec-name>/spec.md`.
- Read `.claude/specs/<spec-name>/proposal.md`.
- Read `.claude/specs/<spec-name>/design.md`.
- Read `.claude/specs/<spec-name>/tasks.md`.

## Steps

1. **Confirm active spec.**
   - Read `.claude/specs/active-spec.txt`.
   - Read the active spec's frontmatter to get `stage`.
   - Display: "Active spec: `<name>` (`<stage>`). Continue with this spec or switch?"
   - Offer: `Continue` or `Cancel`.
   - To switch active spec, tell the user to run `/srsp-switch` and stop.
   - If the current stage is earlier than `proposal-approved`, recommend `/srsp-propose` first and stop.

2. **Check required artifacts exist and have content beyond frontmatter.**
   - If `proposal.md`, `design.md`, or `tasks.md` is missing or has no body content, warn the engineer.
   - Recommend `/srsp-propose` to generate the missing artifacts and stop.

3. **Read SRSP config overrides.**
   - Read `.srsp-config.md` at the project root if it exists (project defaults).
   - Read `.claude/specs/<spec-name>/.srsp-config.md` if it exists (per-spec overrides).
   - Per-spec values override project-level values; empty values mean "use framework defaults".
   - Recognized overrides:
     - `test-command` — command to run in the verification step.
     - `commit-prefix` — prefix for generated commit messages.
     - `branch-prefix` — prefix for feature branch suggestions.
     - `pr-target` — overrides the PR target branch (takes precedence over `base-branch`).
     - `coverage-command` — command used by `/srsp-coverage`; if set, `/srsp-apply` will run the coverage check automatically after tests pass.
     - `ticket-base-url` — base URL used by `/srsp-link` for ticket validation.
   - Unknown keys are ignored but should warn the engineer (caught by `srsp doctor`).

4. **Run `/srsp-sync` drift check (optional but recommended).**
   - If the spec is at `proposal-approved` or later, compare `proposal.md` requirements, `design.md` TODOs, and `tasks.md` tasks.
   - If drift is detected, warn the engineer and offer:
     - `Fix drift first` — invoke `/srsp-sync`.
     - `Continue anyway` — proceed at the engineer's explicit risk.
   - If no drift, proceed without interruption.

5. **Check git branch.**
   - Detect the current branch (`git branch --show-current`).
   - Read `base-branch` from `spec.md` frontmatter.
   - Read `pr-target` from `.srsp-config.md` if present.
   - Identify the development branch in this order:
     1. `.srsp-config.md` `pr-target` if set (non-empty).
     2. `spec.md` `base-branch` if set (non-empty).
     3. Local branch `development` or `develop`.
     4. Remote ref `development` or `develop` (`git branch -r`).
     5. Fall back to `main` or `master`.
   - If on the development branch:
     - Warn: "You are on `<dev-branch>`. Implementation must happen on a feature branch branched from here."
   - If on the production branch (`main` or `master`):
     - Warn: "You are on `<production-branch>`. Feature work should branch from `<dev-branch>`, not from here."
   - If on neither a feature branch nor the development branch:
     - Treat as a feature branch and proceed, but note the expected development branch for PR targeting.
   - If not already on a feature branch, offer to create one from `<dev-branch>`:
     - `Use feature/<spec-name>` — create and switch to `feature/<spec-name>` branched from `<dev-branch>`.
     - `Use feat/<spec-name>` — create and switch to `feat/<spec-name>` branched from `<dev-branch>`.
     - `Custom name` — let the engineer type a custom branch name; prepend `feature/` automatically if they do not include a prefix (e.g., `feature/<input>`). Branch from `<dev-branch>`.
     - `Continue on current branch` — proceed only if the engineer explicitly accepts the risk.
     - `Cancel` — stop.

6. **Resume check.**
   - Read current `stage` from `spec.md`.
   - Based on the stage, ask the engineer where to resume:
     - `proposal-approved` — ask: `Start implementing`, `Review artifacts`, or `Cancel`.
     - `implementing` — find the first unchecked task in `tasks.md`; ask: `Resume from first unchecked task`, `Restart implementation`, `Jump to verify`, `Jump to review`, `Jump to commit`, `Jump to PR`, or `Cancel`.
     - `verified` — ask: `Proceed to engineer review`, `Re-run tests`, `Return to implementation`, or `Cancel`.
     - `review-approved` — ask: `Commit`, `Skip commit and create PR`, `Skip commit and PR`, or `Go back`.
     - `committed` — ask: `Create PR`, `Skip PR`, or `Go back`.
     - `pr-created` — finalize to `applied` and recommend `/srsp-archive`.
     - `applied` — inform the engineer and recommend `/srsp-archive`.
   - Update `spec.md` metadata and Decision Log when the resume point is selected.
   - Append to Decision Log using the format from `docs/state-machine.md`:
     - `<timestamp> [<new-stage>] apply resumed: ready to continue from <stage>`

7. **Ask implementation mode (if entering implementation).**
   - `All at once`
   - `One task at a time` (default for non-trivial specs)
   - `Batch by area`

8. **Implement each pending task in `tasks.md`.**
   - Read relevant codebase files.
   - Make the change.
   - Update the task checkbox to `[x]`.
   - Optionally check off the corresponding TODO in `design.md`.
   - Update `spec.md` metadata:
     - `stage: implementing`
     - `updated: <ISO timestamp>`
     - `stage-changed-at: <ISO timestamp>`
   - Append to Decision Log using the format from `docs/state-machine.md`:
     - On first implementation entry: `<timestamp> [implementing] implementation started`
     - On each completed task: `<timestamp> [implementing] task complete: <task text>`
   - If a task reveals a design flaw, stop and ask whether to refine the proposal/design/tasks or adjust locally.

9. **Run tests live (`/srsp-verify` behavior).**
   - Prefer `test-command` from `.srsp-config.md` if set (non-empty).
   - Otherwise detect project test command from conventions.
   - Run tests, capture output, show summary.
   - Update `spec.md` metadata:
     - `stage: verified`
     - `last-run: <ISO timestamp>`
     - `test-result: <passed (n/n)>` or `<failed (x/n)>`
     - `updated: <ISO timestamp>`
     - `stage-changed-at: <ISO timestamp>`
   - Append to Decision Log using the format from `docs/state-machine.md`:
     - `<timestamp> [verified] tests run: <result summary>`
   - If tests fail, ask to fix or refine. Do not proceed to review until tests pass or the user explicitly skips.

9b. **Optional coverage check.**
   - Run `/srsp-coverage` if either of the following is true:
     - `.srsp-config.md` has a non-empty `coverage-command`.
     - The engineer explicitly chooses `Run coverage check`.
   - Show the coverage summary table.
   - If gaps are found (requirements without TODOs, TODOs without tasks, tasks without code changes, or changes without tests), warn the engineer and offer:
     - `Fix gaps first` — invoke `/srsp-coverage` to expand findings.
     - `Continue anyway` — proceed to review at the engineer's explicit risk.
   - If no gaps, proceed without interruption.

10. **Engineer review.**
   - Show a concise change summary (files modified, key decisions, test result).
   - Show diff only if requested.
   - Ask the engineer:
     - `Approve` — record approval in `spec.md` Decision Log, set `stage: review-approved`, update `updated` and `stage-changed-at`.
       - Append: `<timestamp> [review-approved] engineer review approved: ready to commit`
     - `Request changes` — record requested changes, set `stage: implementing`, update `stage-changed-at`, return to implementation.
       - Append: `<timestamp> [implementing] review requested changes: <summary>`
     - `Cancel` — set `status: cancelled`, update `stage-changed-at`, record reason, stop.
       - Append: `<timestamp> [cancelled] review cancelled: <reason>`
   - The engineer must explicitly approve before commit/PR.

11. **Commit (`/srsp-commit` behavior, engineer-triggered).**
   - Generate a commit message draft from the spec title and tasks.
   - Apply `commit-prefix` from `.srsp-config.md` if set (non-empty).
   - Show files to commit and the message.
   - Ask the engineer:
     - `Commit` — stage and commit. Record `commit-hash` in `spec.md` metadata, set stage to `committed`, update `stage-changed-at`, append to Decision Log.
       - Append: `<timestamp> [committed] commit created: <short-hash>`
     - `Edit message` — let the engineer edit, then commit.
     - `Skip commit` — record reason, proceed to PR step.
       - Append: `<timestamp> [committed] commit skipped: <reason>`
     - `Cancel` — stop.
   - Use the commit convention the project follows. Append `Co-Authored-By: Claude <noreply@anthropic.com>` if that is the project convention.

12. **Open PR (`/srsp-pr` behavior, engineer-triggered).**
   - Reuse the development/production branch detection from Step 4, respecting `pr-target` from `.srsp-config.md` or `base-branch` from `spec.md` if set.
   - If on the development branch or production branch, warn and offer to create a feature branch from the development branch first.
   - Generate PR title and description from the proposal and design.
   - Set default PR target to the development branch (or `base-branch` if set); offer an explicit hotfix path to the production branch.
   - Show the draft to the engineer.
   - Ask the engineer:
     - `Create PR` — push branch and create PR targeting the selected branch via `gh pr create --base <target-branch>` or provide manual description.
     - `Generate description only` — no PR created.
     - `Skip PR` — record reason.
     - `Cancel` — stop.
   - If PR created, record `pr-url` in `spec.md` metadata, set stage to `pr-created`, update `stage-changed-at`, append to Decision Log:
     - `<timestamp> [pr-created] PR opened: <url>`
   - If PR skipped, append:
     - `<timestamp> [pr-created] PR skipped: <reason>`

13. **Finalize apply.**
   - Update `spec.md` metadata:
     - `stage: applied`
     - `applied: <ISO timestamp>`
     - `updated: <ISO timestamp>`
     - `stage-changed-at: <ISO timestamp>`
   - Append to Decision Log using the format from `docs/state-machine.md`:
     - `<timestamp> [applied] apply complete: implemented, verified, reviewed, committed, PR created/skipped`
   - Recommend `/srsp-archive` to finalize.

## Rules

- Never auto-commit or auto-create a PR.
- Never auto-approve on the engineer's behalf.
- Test failures block review unless explicitly skipped.
- Keep changes small and reviewable per task.
- Match existing codebase style.
- All outcomes are recorded in `spec.md` metadata and Decision Log.
- On re-entry, always detect the current sub-stage and offer to resume from there.
- Stage transitions and Decision Log format must follow `docs/state-machine.md`.
