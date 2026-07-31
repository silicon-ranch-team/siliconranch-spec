# Spec Health Reports with `/srsp-report`

As the number of specs grows, teams need a lightweight way to monitor which specs are healthy, which are stuck, and which lack traceability. `/srsp-report` and the `srsp report` CLI command provide that overview.

## When to use `/srsp-report`

- In a team standup or planning session.
- Before a release, to confirm all active specs are moving.
- When you suspect specs are stuck in the same stage.
- To surface specs with poor requirement coverage.

## How to run it

Inside Claude Code:

```text
/srsp-report
```

CLI:

```bash
srsp report        # all specs
srsp report active # active specs only
```

## Configuration

`.srsp-config.md` may set a `stale-days` value. The default is `14`.

```yaml
stale-days: 14
```

A spec is flagged as stale when:

- Its `status` is `active`.
- Its `stage-changed-at` (or `updated`) timestamp is older than `stale-days`.

## Report columns

| Column | Meaning |
|--------|---------|
| Spec | Spec directory name |
| Title | Human-readable title from `spec.md` |
| Status | `active`, `done`, `archived`, `cancelled` |
| Stage | Current workflow stage |
| Age (days) | Days since `created-at` (or `created`) |
| Stage Age (days) | Days since last stage change |
| Reopened | `reopened-count` |
| Coverage | Traceability score from `trace` or heuristic |

## Coverage score

- `≥ 80%` — Good
- `50–79%` — Fair
- `< 50%` — Poor
- `N/A` — no requirements to trace yet

The score is computed from the `trace` frontmatter field when present. Otherwise, `/srsp-report` falls back to heuristic checks: requirements with TODOs, TODOs with tasks, and completed tasks.

## Example output

```text
SRSP Spec Health Report (stale threshold: 14 days)

| Spec | Title | Status | Stage | Age (days) | Stage Age (days) | Reopened | Coverage |
|------|-------|--------|-------|------------|------------------|----------|----------|
| example-todo-api | Todo List REST API | active | review-approved | 3 | 2 | 0 | 100% (Good) |
| auth-service | User Auth API | active | proposal-draft | 18 | 15 | 0 | 40% (Poor) |

Stale specs:
| Spec | Stage | Stage Age (days) | Recommended Action |
|------|-------|------------------|-------------------|
| auth-service | proposal-draft | 15 | /srsp-resume or /srsp-archive |
```

## Rules

- `/srsp-report` is read-only unless you ask it to invoke another skill or export a report.
- It does not modify spec metadata or artifacts.
- Use `/srsp-coverage` or `/srsp-propose` to fix poor coverage.
- Use `/srsp-resume` or `/srsp-archive` to act on stale specs.
