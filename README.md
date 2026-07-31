# Silicon Ranch Spec Driven Development Framework

A customizable, end-to-end development workflow for Claude Code projects.

## What It Does

This framework guides a software development spec through its entire lifecycle:

```text
Spec → Explore → Propose → Apply → Archive/Done
```

Expanded view:

```text
submitted
   -> exploring
        -> proposal-draft
             -> proposal-approved
                  -> implementing
                       -> verified
                            -> review-approved
                                 -> committed
                                      -> pr-created
                                           -> applied
                                                -> done / archived / cancelled
```

At every stage, Claude presents the generated artifact and asks for explicit user approval. If the output is not good enough, the user can refine it in a loop until it meets the acceptance criteria.

## Quick Start

1. Install the CLI globally (recommended on Windows):
   ```bash
   npm install -g silicon-ranch-spec
   ```
2. Initialize the framework in your project:
   ```bash
   srsp init
   ```
3. Open the project in Claude Code and create your first spec:
   ```text
   /srsp-start my-feature
   /srsp-explore
   /srsp-propose
   /srsp-apply
   /srsp-archive
   ```

For a full walkthrough, see the [Framework Guide](docs/spec-driven-framework.md).

## Using the Framework

The framework is designed to be used sequentially. Each command produces or refines an artifact and asks for your approval before advancing.

### Primary workflow (recommended)

1. **`/srsp-start`** — Create a new spec.
   - Asks for a spec name, optional template, title, author, and the spec text.
   - Creates `.claude/specs/<spec-name>/spec.md` with SpecKit-style metadata and a Decision Log.
   - Also creates `proposal.md`, `design.md`, and `tasks.md` files (pre-seeded from a template if selected).
   - Sets the active spec in `.claude/specs/active-spec.txt`.

2. **`/srsp-explore`** — Clarify the spec.
   - Reads the active `spec.md`.
   - Asks focused questions about ambiguities, missing acceptance criteria, or constraints.
   - Drafts an initial `proposal.md` with functional and non-functional requirements.
   - Updates `spec.md` metadata and Decision Log.

3. **`/srsp-propose`** — Finalize proposal, design, and tasks.
   - Generates/refines `proposal.md` (requirements + acceptance criteria).
   - Generates/refines `design.md` (architecture + implementation TODOs).
   - Generates/refines `tasks.md` (ordered, checkable task plan).
   - Presents a summary and asks: **Accept / Refine proposal / Refine design / Refine tasks / Skip / Cancel**.
   - Every decision is recorded in `spec.md`.

4. **`/srsp-apply`** — Implement, verify, review, commit, and open a PR.
   - Implements tasks from `tasks.md` and checks them off.
   - Optionally checks off corresponding TODOs in `design.md`.
   - Runs tests live and records only a short summary in `spec.md`.
   - Presents changes for explicit engineer review approval.
   - Prepares a commit message and commits **only after** engineer confirmation.
   - Prepares a PR description and creates the PR **only after** engineer confirmation.
   - Records commit hash and PR URL in `spec.md`.

5. **`/srsp-archive`** — Mark the spec done, archive it, or cancel it.
   - Shows the final spec state.
   - Options: **Done / Archive / Cancel**.
   - Updates `spec.md` metadata and Decision Log.

6. **`/srsp-reopen`** — Reopen a done, archived, or cancelled spec.
   - Captures the reason and optional ticket URL.
   - Moves the spec back to `submitted` or `exploring` and creates reopen tasks.
   - Updates `spec.md` metadata and Decision Log.

7. **`/srsp-status`** — Check the state of all specs.
   - Shows a table of all specs with current stage, status, author, and last update.
   - Shows the active spec and recommends the next command.
   - Always confirms the active spec before switching.

8. **`/srsp-switch`** — Switch the active spec to another existing spec.
   - Lists all non-archived specs.
   - Updates `.claude/specs/active-spec.txt` to the selected spec.

9. **`/srsp-resume`** — Resume the active spec from its current stage.
   - Reads the active spec stage and recommends or invokes the next appropriate command.

10. **`/srsp-doctor`** — Validate the active spec.
   - Checks `spec.md` frontmatter, stage values, required artifacts, and FR→TODO→Task coverage.
   - Reports findings and recommends fixes.

11. **`/srsp-delete`** — Permanently delete a spec.
   - Requires typing the exact spec name to confirm.
   - Prefer `/srsp-archive` for normal completion.

### Per-spec `base-branch` override

The `spec.md` frontmatter supports an optional `base-branch` field. If set, `/srsp-apply` and `/srsp-pr` use it as the development/integration branch for feature branches and PR targets. If empty, the framework auto-detects `development`, `develop`, `main`, or `master`.

### Optional granular commands

Use these when you want finer control over a single artifact or step:

| Command | When to use |
|---------|-------------|
| `/srsp-proposal` | Refine only `proposal.md` without regenerating design or tasks. |
| `/srsp-design`   | Refine only `design.md` without regenerating proposal or tasks. |
| `/srsp-tasks`    | Edit or regenerate only `tasks.md`. |
| `/srsp-sync`     | Detect drift between requirements, design TODOs, and tasks. |
| `/srsp-coverage` | Trace requirements → TODOs → tasks → code → tests. |
| `/srsp-verify`    | Run tests only and update the test summary in `spec.md`. |
| `/srsp-commit`    | Commit approved changes only (requires explicit confirmation). |
| `/srsp-pr`        | Create a pull request only (requires explicit confirmation). |
| `/srsp-report`    | Generate a health and traceability report for all specs. |
| `/srsp-link`      | Link the active spec to an external issue tracker ticket. |

### Safety & guardrails

- **Spec name validation** — `/srsp-start` enforces kebab-case or snake_case and suggests a normalized name.
- **Active spec confirmation** — every SRSP skill confirms the active spec on entry.
- **Drift warnings** — granular skills warn when requirements, TODOs, and tasks fall out of sync.
- **Delete protection** — `/srsp-delete` requires typing the exact spec name; `/srsp-archive` no longer offers Delete.
- **Branch guardrails** — `/srsp-apply` detects the development branch (`development` or `develop`, falling back to `main`/`master`) and creates feature branches from it (`feature/<spec-name>`, `feat/<spec-name>`, or custom `feature/<input>`). `/srsp-pr` targets the development branch by default and supports an explicit hotfix path to the production branch (`main` or `master`).

### Typical command sequence

```text
/srsp-start    # Create a new spec
/srsp-explore  # Clarify the spec
/srsp-propose  # Finalize proposal/design/tasks
/srsp-apply    # Implement, verify, review, commit, PR
/srsp-archive  # Mark done/archive/cancel
/srsp-resume   # Resume from current stage at any time
/srsp-switch   # Change active spec at any time
```

You can also interleave granular commands when needed:

```text
/srsp-start
/srsp-explore
/srsp-propose
/srsp-tasks     # edit tasks before applying
/srsp-apply
/srsp-verify    # re-run tests after a fix
/srsp-commit
/srsp-pr
/srsp-archive
```

## Per-Spec Files (4 files)

```text
.claude/specs/<spec-name>/
  spec.md      # Original spec + SpecKit-style metadata + Decision Log
  proposal.md  # Refined requirements + acceptance criteria + proposal summary
  design.md    # Technical architecture + implementation TODOs
  tasks.md     # Executable, checkable task plan
```

## Documentation

- [docs/tutorial.md](docs/tutorial.md) — step-by-step walkthrough.
- [docs/spec-driven-framework.md](docs/spec-driven-framework.md) — full framework guide.
- [docs/state-machine.md](docs/state-machine.md) — canonical stages, transitions, and entry commands.
- [docs/maturity.md](docs/maturity.md) — incremental adoption maturity model.
- [docs/sync.md](docs/sync.md) — drift detection with `/srsp-sync`.
- [docs/coverage.md](docs/coverage.md) — requirement traceability with `/srsp-coverage`.
- [docs/reopen.md](docs/reopen.md) — reopening finalized specs.
- [docs/report.md](docs/report.md) — spec health reports.
- [.claude/specs/example-todo-api/](.claude/specs/example-todo-api/) — complete example spec.
- [.claude/specs/README.md](.claude/specs/README.md) — how specs are organized.

## Installable CLI

The framework ships as an npm package called `silicon-ranch-spec`.

### Install

```bash
# Global install (recommended, especially on Windows)
npm install -g silicon-ranch-spec

# Or run once without installing (works on macOS/Linux; may fail in Windows Git Bash)
npx silicon-ranch-spec <command>
```

> **Windows / Git Bash note:** `npx` may not resolve the `srsp` binary in Git Bash because npm does not expose `.cmd` wrappers there. Use a global install (`npm install -g silicon-ranch-spec`) or run from Command Prompt / PowerShell if you encounter `'srsp' is not recognized`.

### CLI commands

```bash
srsp init                 # Copy SRSP skills and docs into the current project
srsp start <spec-name>    # Create a new spec with stubs and set it active
srsp status               # Show active spec and list all specs
srsp switch <spec-name>   # Change the active spec
srsp doctor               # Validate the active spec metadata and artifacts
srsp help                 # Show help
```

The CLI handles file scaffolding and status checking. The reasoning-heavy workflow steps (`explore`, `propose`, `apply`, `archive`) are designed to run as Claude Code skills inside the editor.

### Publishing

Releases follow [GitFlow](https://nvie.com/posts/a-successful-git-branching-model/):

1. Create a release branch from `development`:
   ```bash
   git checkout development
   git pull origin development
   git checkout -b release/vX.Y.Z
   ```
2. Bump the version in `package.json` according to [Semantic Versioning](https://semver.org/).
3. Update `CHANGELOG.md` with a `## [X.Y.Z]` release section.
4. Commit the version/changelog bump and push the release branch.
5. Open a PR from `release/vX.Y.Z` to `main`.
6. After the PR is merged, tag the merge commit:
   ```bash
   git checkout main
   git pull origin main
   git tag -a vX.Y.Z -m "Release vX.Y.Z"
   git push origin vX.Y.Z
   ```
7. GitHub Actions will publish `silicon-ranch-spec@X.Y.Z` to npm automatically.

**Required secret:** Add an npm **automation token** named `NPM_TOKEN` in the repository's GitHub Actions secrets (`Settings → Secrets and variables → Actions`).

## Documentation

Framework documentation is published to GitHub Pages via the `.github/workflows/docs.yml` workflow using [MkDocs Material](https://squidfunk.github.io/mkdocs-material/).

- Docs workflow status: see the **Deploy docs to GitHub Pages** workflow in the Actions tab.
- Published docs URL: `https://<org>.github.io/<repo>/` (configure after enabling GitHub Pages in the repository settings).

## Engineer-Owned Actions

The following actions are never automatic and always require explicit engineer approval:

- Final review approval
- Committing changes
- Creating a pull request
- Archiving, deleting, or cancelling a spec

## Customization

All workflow logic lives in `.claude/skills/` as markdown files. Teams can freely edit prompts, add or remove stages, and adapt artifact templates to match their own process without writing any compiled code.
