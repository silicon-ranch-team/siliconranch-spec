---
spec: example-todo-api
stage: proposal
generated: 2026-07-28
---

# Proposal: Todo List REST API

## Summary
Build a small Express-based REST API for managing todo items. Todos will be kept in memory, exposed through five CRUD endpoints, and fully covered by integration tests.

## Functional Requirements
1. FR1: Create a new todo item.
   - Acceptance: `POST /todos` accepts `{ title, description? }` and returns `201 Created` with the created todo JSON.
2. FR2: List all todo items.
   - Acceptance: `GET /todos` returns `200 OK` with an array of todo JSON objects.
3. FR3: Retrieve a single todo item.
   - Acceptance: `GET /todos/:id` returns `200 OK` with the todo JSON, or `404 Not Found` if the id does not exist.
4. FR4: Update a todo item.
   - Acceptance: `PUT /todos/:id` accepts `{ title?, description?, completed? }` and returns `200 OK` with the updated todo JSON, or `404 Not Found` if the id does not exist.
5. FR5: Delete a todo item.
   - Acceptance: `DELETE /todos/:id` returns `204 No Content`, or `404 Not Found` if the id does not exist.
6. FR6: Todo item schema.
   - Acceptance: Each todo has `id` (string), `title` (string), `completed` (boolean), and `description` (string, optional).

## Non-Functional Requirements
1. NFR1: The API should start and respond on port `3000` by default.
2. NFR2: The API should include a runnable test suite covering all CRUD endpoints.
3. NFR3: The codebase should be small and easy to refactor into a database-backed version later.

## Constraints & Assumptions
- In-memory persistence is sufficient for this iteration.
- No authentication, authorization, or user isolation.
- Ids are generated as UUIDs.

## Open Questions
- Should `completed` default to `false` on creation? **Answer:** Yes.
- Should `PUT` allow partial updates? **Answer:** Yes, only provided fields are updated.

## Refinement Notes
- User confirmed partial updates are acceptable.
- User confirmed TypeScript/Express is the target stack for the example.
