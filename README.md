# FuckSchools Backend

## Purpose
The backend is the execution layer for the FuckSchools graph. It owns the canonical domain model, evaluates traversal signals, records blockers, persists state, and emits normalized events for the studio layer.

## Architecture
- Clean Architecture: src/entities/ | src/applications/ | src/infrastructure/ | src/DI/ | src/controllers/ | src/routes/
- Domain: Traversal rules, blocker semantics.
- Event-driven signal flow: Intent -> Normalized -> Traversal -> Emit (draft/roadmap event semantics, e.g. `node_updated`, `blocker_detected`, `step_down`, `step_up`, `go_around`).
