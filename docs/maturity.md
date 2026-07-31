# SRSP Maturity Model

The Silicon Ranch Spec Driven Development (SRSP) framework evolves through a set of maturity levels. Each level adds more structure and automation to the spec lifecycle while preserving the framework's core principle: engineers own every decision.

## Level 0 — Basic Spec Workflow

At this level, a team uses the four core artifacts:

- `spec.md` — original prompt, metadata, and Decision Log
- `proposal.md` — requirements and acceptance criteria
- `design.md` — architecture and implementation TODOs
- `tasks.md` — executable, checkable task plan

Commands available:

| Command | Purpose |
|---------|---------|
| `/srsp-start` | Create a new spec |
| `/srsp-explore` | Clarify the spec |
| `/srsp-propose` | Finalize proposal, design, and tasks |
| `/srsp-apply` | Implement, verify, review, commit, and open PR |
| `/srsp-archive` | Mark done, archive, or cancel |

Engineers approve every transition. This level works for small teams and early projects.

## Level 1 — Drift Detection and Recovery

Level 1 adds tools that keep the four artifacts aligned:

- `/srsp-sync` detects drift between requirements, TODOs, and tasks.
- Drift warnings appear in `/srsp-propose`, `/srsp-design`, and `/srsp-tasks`.
- `/srsp-reopen` brings finalized specs back into the workflow with reason tracking.
- `/srsp-report` surfaces stale specs and basic health metrics.

These tools reduce the risk of a spec quietly going out of date, but they remain advisory. Engineers decide when and how to fix drift.

## Level 2 — Traceability

Level 2 closes the loop between specs, code, and tests:

- `/srsp-coverage` traces each functional requirement through design TODOs, tasks, code changes, and tests.
- The optional `trace` frontmatter field in `spec.md` maps requirement IDs to TODO, task, implementation file pattern, and test pattern.
- `/srsp-doctor` validates `trace` metadata and flags gaps.
- `/srsp-apply` can run `/srsp-coverage` automatically after tests when `coverage-command` is configured.

Traceability is optional. Teams that do not need strict tracing can ignore the `trace` field and rely on heuristic coverage checks.

## Level 3 — Automation and Governance

Level 3 adds CI/CD integration and governance:

- GitHub Actions run tests, validate spec frontmatter, and run `srsp doctor` on every PR.
- `release.yml` publishes the `silicon-ranch-spec` package to npm on version tag pushes.
- `.srsp-config.md` centralizes project-level and per-spec overrides for commands, branch names, and PR targets.

At this level, the framework itself is released and versioned like any other dependency.

## Using the Maturity Levels

Teams can adopt SRSP incrementally:

1. Start with Level 0 and the core workflow.
2. Add `/srsp-sync` and `/srsp-reopen` when specs begin to drift or reopen.
3. Add `/srsp-coverage` and `trace` metadata when traceability becomes important.
4. Enable CI/CD and config validation when the framework is mature enough to ship.

Each level is opt-in. The framework does not enforce a level; it provides the tools and lets the team decide when to use them.

## Future Maturity Work

Possible future additions:

- CI validation of `trace` metadata (opt-in).
- Issue tracker integration beyond ticket URL validation.
- Custom project templates beyond the built-in templates.
- Automated coverage badge generation in `srsp-report`.
