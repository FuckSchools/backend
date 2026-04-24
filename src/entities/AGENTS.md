# ENTITIES & DOMAIN MODELS

## OVERVIEW

Domain shapes defined entirely as Zod schemas. This is the single source of truth for both runtime validation and TypeScript typings via `z.infer`.

## WHERE TO LOOK

| Task              | Location      | Notes                        |
| ----------------- | ------------- | ---------------------------- |
| Add domain fields | `*.entity.ts` | Modify Zod objects directly. |

## CONVENTIONS

- **Split Definitions**: Always define both `internal` (DB/domain representation) and `external` (API/response representation) shapes.
- **No Classes**: Do not use classes for entities. Data is pure and validated via schema.

## ANTI-PATTERNS

- **NEVER** define a standalone TypeScript `interface` for a domain model. Let Zod drive the types.
- **DO NOT** import raw `uuidv4` without verifying the correct Zod extension usage currently established in `tree.entity.ts` / `project.entity.ts`.
