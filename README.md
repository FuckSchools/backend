# FuckSchools Backend

## Purpose
The backend is the execution layer for the FuckSchools graph. It owns the canonical domain model, evaluates traversal signals, records blockers, persists state, and emits normalized events for the studio layer.

## Architecture
- Clean Architecture: entities/ | applications/ | infrastructure/ | DI/ | controllers/ | routes/
- Domain: Traversal rules, blocker semantics.
- Event-driven signal flow: Intent -> Normalized -> Traversal -> Emit (node_updated, blocker_detected, step_down, step_up, go_around).
