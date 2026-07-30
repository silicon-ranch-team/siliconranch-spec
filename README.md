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

5. **`/srsp-archive`** — Mark the spec done, archive it, cancel it, or reopen it.
   - Shows the final spec state.
   - Options: **Done / Archive / Cancel / Reopen**.
   - Updates `spec.md` metadata and Decision Log.
   - To permanently delete, use `/srsp-delete`.

6. **`/srsp-status`** — Check the state of all specs.
   - Shows a table of all specs with current stage, status, author, and last update.
   - Shows the active spec and recommends the next command.
   - Always confirms the active spec before switching.

7. **`/srsp-switch`** — Switch the active spec to another existing spec.
   - Lists all non-archived specs.
   - Updates `.claude/specs/active-spec.txt` to the selected spec.

8. **`/srsp-resume`** — Resume the active spec from its current stage.
   - Reads the active spec stage and recommends or invokes the next appropriate command.

9. **`/srsp-doctor`** — Validate the active spec.
   - Checks `spec.md` frontmatter, stage values, required artifacts, and FR→TODO→Task coverage.
   - Reports findings and recommends fixes.

10. **`/srsp-delete`** — Permanently delete a spec.
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
| `/srsp-verify`    | Run tests only and update the test summary in `spec.md`. |
| `/srsp-commit`    | Commit approved changes only (requires explicit confirmation). |
| `/srsp-pr`        | Create a pull request only (requires explicit confirmation). |
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

- [docs/spec-driven-framework.md](docs/spec-driven-framework.md) — full framework guide.
- [docs/state-machine.md](docs/state-machine.md) — canonical stages, transitions, and entry commands.
- [.claude/specs/example-todo-api/](.claude/specs/example-todo-api/) — complete example spec.
- [.claude/specs/README.md](.claude/specs/README.md) — how specs are organized.

## Installable CLI

The framework ships as an npm package called `silicon-ranch-spec`.

### Install

```bash
# Global install
npm install -g silicon-ranch-spec

# Or run once without installing
npx silicon-ranch-spec <command>
```

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

1. Bump the version in `package.json` according to [Semantic Versioning](https://semver.org/).
2. Update `CHANGELOG.md` under `## [Unreleased]` or create a new release section.
3. Tag the release: `git tag vX.Y.Z`.
4. Publish to npm: `npm publish`.

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
