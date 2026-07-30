---
name: srsp-pr
description: Create a pull request for the active spec with confirmation.
tags:
  - srsp
  - granular
  - pr
---

# /srsp-pr — Create Pull Request Only

Create a pull request for the active spec. This is an engineer-triggered action and requires explicit confirmation.

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
   - If the current stage is earlier than `committed`, recommend `/srsp-apply` or `/srsp-commit` and stop.

2. **Check git state.**
   - Current branch.
   - Latest commit hash.
   - Read `.srsp-config.md` for `pr-target` if it exists.
   - Read `base-branch` from `spec.md` frontmatter.
   - Identify the development branch in this order:
     1. `.srsp-config.md` `pr-target` if set (non-empty).
     2. `spec.md` `base-branch` if set (non-empty).
     3. Local branch `development` or `develop`.
     4. Remote ref `development` or `develop` (`git branch -r`).
     5. Fall back to `main` or `master`.
   - Identify the production branch: prefer `main`, then `master`.
   - If on the development branch:
     - Warn: "You are on `<dev-branch>`. PRs should be opened from a feature branch, not the development branch."
     - Offer:
       - `Create and switch to feature/<spec-name>` from `<dev-branch>` and restart `/srsp-pr`.
       - `Create and switch to feat/<spec-name>` from `<dev-branch>` and restart `/srsp-pr`.
       - `Custom feature branch` from `<dev-branch>`.
       - `Cancel` — stop.
   - If on the production branch (`main` or `master`):
     - Strong warning: "You are on `<production-branch>`. PRs for feature work should target `<dev-branch>` and be opened from a feature branch."
     - Offer:
       - `Create and switch to feature/<spec-name>` from `<dev-branch>` and restart `/srsp-pr`.
       - `Create and switch to feat/<spec-name>` from `<dev-branch>` and restart `/srsp-pr`.
       - `Custom feature branch` from `<dev-branch>`.
       - `Cancel` — stop.
   - Determine PR target branch:
     - Default target: `<dev-branch>` (or `base-branch` if set).
     - Hotfix target: `<production-branch>` (`main` or `master`) — requires explicit confirmation.
   - Ask the engineer:
     - `Target development branch` (default).
     - `This is a hotfix — target production branch` — requires a second confirmation and a hotfix note in the PR description.
     - `Cancel` — stop.

3. **Generate PR title and description.**

   Description template:
   ```markdown
   ## Summary
   <spec summary>

   ## Requirements Addressed
   - <FR1>

   ## Design Highlights
   - <highlight>

   ## Implementation
   - <task summary>

   ## Testing
   - <test result summary from spec.md metadata>

   ## Target Branch
   - <target-branch> (development branch by default; production branch for hotfixes)

   ## Checklist
   - [x] Proposal approved
   - [x] Design approved
   - [x] Tasks approved
   - [x] Implementation complete
   - [x] Tests passing
   - [x] Engineer review approved
   - [x] Committed

   Closes spec: <spec-name>
   ```
   - If this is a hotfix, add a note: "**Hotfix:** targets `<production-branch>` directly."

4. **Present to the engineer.**
   - Target branch, title, body.
   - Ask:
     - `Create PR` — push and create PR targeting `<target-branch>` via `gh pr create --base <target-branch> --title "..." --body "..."` if available.
     - `Generate description only` — no PR created.
     - `Cancel` — stop.

5. **Create PR if approved.**
   - Use the selected target branch.
   - Prefer `gh pr create --base <target-branch> --title "..." --body "..."`.
   - If `gh` is unavailable, print the manual command and description.
   - Capture PR URL.

6. **Update `spec.md` metadata and Decision Log:**
   - `pr-url: <url>`
   - `updated: <ISO timestamp>`
   - Append: `<timestamp> [pr-created] PR opened: <url>`

7. **Confirm to the engineer.**

## Rules

- Never create a PR without explicit engineer approval.
- Avoid creating PRs from the default branch.
- If `gh` is not installed, provide the manual description instead of failing.
- Decision Log format must follow `docs/state-machine.md`.
