# SRSP Framework Evaluation & Refinement TODO

**Created:** 2026-07-28  
**Purpose:** Capture the complete evaluation of the Silicon Ranch Spec Driven Development Framework (SRSP), including all findings, recommendations, architectural improvements, and a prioritized action plan. Revisit this folder tomorrow to decide which items to implement.

## Files in this Folder

| File | Contents |
|------|----------|
| `README.md` | This overview and index. |
| `evaluation.md` | Full evaluation: high, medium, and low-impact issues. |
| `recommendations.md` | Concrete recommendations mapped to each issue. |
| `architectural-improvements.md` | Bigger-picture improvements to consider. |
| `priority-order.md` | Recommended order of implementation + quick wins. |
| `action-plan.md` | Turned into a checkable task list for execution. |

## Quick Summary

The framework is functionally complete but has opportunities for refinement in three areas:

1. **Resumability** — `/srsp-apply` is monolithic; interrupted workflows are hard to resume cleanly.
2. **Stage clarity** — some stages are implicit or ambiguous, especially around design/tasks approval inside `/srsp-propose`.
3. **Artifact consistency** — granular skills can leave `proposal.md`, `design.md`, and `tasks.md` out of sync.

Two longer-term additions have also been added to the backlog:

- **Installable SRSP CLI** — package the framework as an npm-installable command-line tool with version control.
- **GitHub Pages docs workflow** — evaluate JSDoc vs Sphinx (and alternatives) and deploy generated HTML docs from `main`.

## Top 3 Quick Wins

1. Make `/srsp-apply` resumable from its current sub-stage.
2. Fix the example `spec.md` so its stage and Decision Log are internally consistent.
3. Add consistency warnings to granular skills (`/srsp-proposal`, `/srsp-design`, `/srsp-tasks`).

See `priority-order.md` and `action-plan.md` for the full plan.
