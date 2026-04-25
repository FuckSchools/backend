# ENTITIES

## OVERVIEW

Domain shapes defined as Zod schemas. Single source of truth for validation and types.

## CONVENTIONS

- **Internal vs External**: Define both DB representation and API response shapes.
- **Pure Data**: No classes. Data is pure and validated via schema.

## ANTI-PATTERNS

- **NO Interfaces**: Never define standalone TS interfaces for domain models.
- **Zod Drive**: Let Zod drive all domain types via `z.infer`.
