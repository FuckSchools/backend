# PROJECT KNOWLEDGE BASE

**Generated:** 2026-04-24
**Commit:** N/A
**Branch:** N/A

## OVERVIEW

Backend for FuckSchools: An anti-traditional education system optimized for intent-driven, hands-on building via a tree-based decomposition engine. Tech stack: Node.js (TypeScript/ESM), Express.js, Prisma, Zod, Clerk.

## STRUCTURE

```
.
├── prisma/            # Split Prisma schema architecture
├── src/
│   ├── entities/      # Domain models mapped strictly 1:1 to Zod schemas (Internal/External split)
│   ├── applications/  # Curried use-cases (functional DI pattern)
│   ├── infrastructure/# Concrete repository implementations
│   ├── DI/            # Tiny manual dependency injection container mapped via z.enum
│   ├── controllers/   # HTTP handlers (orchestrate use-cases & DI)
│   └── routes/        # Express route definitions
└── generated/prisma/  # Output for custom Prisma adapter
```

## WHERE TO LOOK

| Task                | Location               | Notes                                             |
| ------------------- | ---------------------- | ------------------------------------------------- |
| Define domain logic | `src/entities/`        | Schemas are truth. Split `internal`/`external`.   |
| Add business logic  | `src/applications/`    | Functional use-cases curried with dependencies.   |
| Wire dependencies   | `src/DI/repository.ts` | Manual DI container. Instantiate repos here.      |
| Modify DB schema    | `prisma/models/`       | Models are split into individual `.prisma` files. |

## CONVENTIONS

- **Functional DI**: Services use curried higher-order functions: `(deps) => async (input) => { ... }`.
- **Zod Boundaries**: Schemas define strict internal/external boundaries for domain entities.
- **ESM NodeNext**: `.js` extensions must be appended to relative imports in TS files.

## ANTI-PATTERNS

- **DO NOT** teach directly; the platform is a routing engine.
- **NEVER** use class-based DI containers; use the manual Map.
- **NEVER** use plain TS `interface`s for domain types; use `z.infer`.
- **DEPRECATED**: Don't use standard `@prisma/client`; use the generated client in `generated/prisma/`.

## ARCHITECTURE NOTES

- **Signs of Completion (SoC)**: Hard boundary for `Node` completion in the `Tree` architecture.
- **BFS Traversal**: Valid events are `step_up`, `step_down`, and `go_around`.
