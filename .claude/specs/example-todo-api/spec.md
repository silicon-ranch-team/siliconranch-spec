---
spec: example-todo-api
title: Todo List REST API
author: engineer@example.com
status: active
stage: review-approved
explored: 2026-07-28T10:00:00Z
proposed: 2026-07-28T11:00:00Z
applied: ""
archived: ""
last-reopened: ""
reopened-count: 0
reopened-reason: ""
reopened-ticket-url: ""
created-at: 2026-07-28T00:00:00Z
stage-changed-at: 2026-07-29T09:00:00Z
created: 2026-07-28
updated: 2026-07-29T09:00:00Z
last-run: 2026-07-28T13:50:00Z
test-result: passed (10/10)
commit-hash: ""
pr-url: ""
base-branch: ""
ticket-url: ""
trace:
  FR1: TODO-3,Task-3,src/routes/todos.ts,tests/todos.test.ts
  FR2: TODO-4,Task-4,src/routes/todos.ts,tests/todos.test.ts
  FR3: TODO-5,Task-5,src/routes/todos.ts,tests/todos.test.ts
  FR4: TODO-6,Task-6,src/routes/todos.ts,tests/todos.test.ts
  FR5: TODO-7,Task-7,src/routes/todos.ts,tests/todos.test.ts
  FR6: TODO-2,Task-2,src/store.ts,tests/todos.test.ts
---

# Spec: Todo List REST API

## Context
We need a simple backend service that allows users to manage a personal todo list. This will be the foundation for a future web or mobile client.

## Goal
Build a minimal, testable REST API that supports creating, reading, updating, and deleting todo items.

## Requirements (user-provided)
1. Expose a REST API for todo items.
2. Support CRUD operations: create, list, get by id, update, delete.
3. Persist todos in memory for now (no database required).
4. Each todo should have an id, title, completion status, and optional description.
5. Return consistent JSON responses and appropriate HTTP status codes.

## Acceptance Criteria (user-provided, if any)
- `GET /todos` returns a list of todos.
- `POST /todos` creates a new todo and returns it with an auto-generated id.
- `GET /todos/:id` returns the todo or 404 if missing.
- `PUT /todos/:id` updates the todo and returns the updated todo.
- `DELETE /todos/:id` removes the todo and returns 204 No Content.

## Notes
- Use any language/framework the team prefers; this example uses TypeScript/Express.
- No authentication required for the example.
- The in-memory store can be replaced later with a database.

## Coverage Report

The `trace` frontmatter maps each functional requirement to its TODO, task, implementation file, and test file.

| Requirement | TODO | Task | Implementation | Tests |
|-------------|------|------|----------------|-------|
| FR1: Create todo | TODO-3 | Task-3 | `src/routes/todos.ts` | `tests/todos.test.ts` |
| FR2: List todos | TODO-4 | Task-4 | `src/routes/todos.ts` | `tests/todos.test.ts` |
| FR3: Get todo | TODO-5 | Task-5 | `src/routes/todos.ts` | `tests/todos.test.ts` |
| FR4: Update todo | TODO-6 | Task-6 | `src/routes/todos.ts` | `tests/todos.test.ts` |
| FR5: Delete todo | TODO-7 | Task-7 | `src/routes/todos.ts` | `tests/todos.test.ts` |
| FR6: Todo schema | TODO-2 | Task-2 | `src/store.ts` | `tests/todos.test.ts` |

Coverage score: 6/6 requirements traced (100% — Good).

## Decision Log
- 2026-07-28T10:00:00Z [submitted] spec submitted: initial draft created
- 2026-07-28T10:30:00Z [exploring] exploration: clarified persistence (in-memory) and response codes
- 2026-07-28T11:00:00Z [proposal-approved] proposal approved: requirements and acceptance criteria accepted
- 2026-07-28T11:30:00Z [proposal-approved] design approved: architecture and TODOs accepted
- 2026-07-28T12:00:00Z [proposal-approved] tasks approved: task plan accepted
- 2026-07-28T13:00:00Z [implementing] implementation complete: all tasks done
- 2026-07-28T13:10:00Z [verified] tests run: passed (10/10)
- 2026-07-28T13:15:00Z [review-approved] engineer review approved
- 2026-07-28T14:00:00Z [review-approved] apply paused: implementation and tests complete; commit and PR remain pending engineer action
