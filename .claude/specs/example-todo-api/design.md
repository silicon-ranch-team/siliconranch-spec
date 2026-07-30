---
spec: example-todo-api
stage: design
generated: 2026-07-28
---

# Design: Todo List REST API

## Overview
A single Express server (`src/server.ts`) mounted on `src/app.ts` will expose five REST endpoints. Todos will be stored in an in-memory `Map` managed by `src/store.ts`. Tests will use `supertest` against `app.ts` so the server does not need to run on a real port during testing.

## Architecture / Approach
- `src/app.ts` — configures Express, attaches routes, exports the app for testing.
- `src/server.ts` — starts the app on a port for local development.
- `src/routes/todos.ts` — defines `/todos` route handlers.
- `src/store.ts` — in-memory todo store with CRUD helper functions.
- `src/types.ts` — shared `Todo` interface.
- `tests/todos.test.ts` — supertest-based CRUD tests.

## File Changes
- `package.json`: add `express`, `uuid`, `supertest`, `jest`, `@types/*` dependencies.
- `tsconfig.json`: TypeScript configuration.
- `src/types.ts`: new.
- `src/store.ts`: new.
- `src/routes/todos.ts`: new.
- `src/app.ts`: new.
- `src/server.ts`: new.
- `tests/todos.test.ts`: new.

## API / Interface Definitions
- `POST   /todos`     → create a todo
- `GET    /todos`     → list todos
- `GET    /todos/:id` → get one todo
- `PUT    /todos/:id` → update one todo
- `DELETE /todos/:id` → delete one todo

Response shape:

```json
{
  "id": "uuid",
  "title": "Buy milk",
  "completed": false,
  "description": "Get 2 liters"
}
```

## Implementation TODOs
- [x] TODO-1: Initialize TypeScript/Express project and install dependencies — maps to FR1–FR5 setup.
- [x] TODO-2: Define `Todo` type and in-memory store with CRUD methods — maps to FR6.
- [x] TODO-3: Implement `POST /todos` endpoint — maps to FR1.
- [x] TODO-4: Implement `GET /todos` endpoint — maps to FR2.
- [x] TODO-5: Implement `GET /todos/:id` endpoint — maps to FR3.
- [x] TODO-6: Implement `PUT /todos/:id` endpoint — maps to FR4.
- [x] TODO-7: Implement `DELETE /todos/:id` endpoint — maps to FR5.
- [x] TODO-8: Add Jest + supertest CRUD test suite — maps to NFR2.

## Testing Strategy
- Unit/integration tests hit the Express app via `supertest`.
- Each CRUD operation gets at least one success test and one edge case test (404, partial update).

## Risks & Mitigations
- Risk: Auto-incrementing ids may cause collisions if reset. Mitigation: use `uuid` package.
- Risk: No database means data is lost on restart. Mitigation: accepted for this iteration; noted for future work.

## Refinement Notes
