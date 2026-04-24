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
| Task | Location | Notes |
|------|----------|-------|
| Define domain logic | `src/entities/` | Schemas are truth. Split `internal`/`external`. |
| Add business logic | `src/applications/` | Functional use-cases curried with dependencies. |
| Wire dependencies | `src/DI/repository.ts` | Manual DI container. Instantiate repos here. |
| Modify DB schema | `prisma/models/` | Models are split into individual `.prisma` files. |

## CONVENTIONS
- **Clean Architecture with Functional DI**: Services are higher-order functions: `(Repository) => async (input) => { ... }`.
- **Zod-Driven Design**: Zod schemas act as the strict boundary for domain entities and runtime types simultaneously.
- **Internal vs External State**: Explicit data shape boundaries within Zod objects (e.g., `user.internal` vs `user.external`).
- **ESM NodeNext**: `.js` extensions must be appended to relative imports in TS files.

## ANTI-PATTERNS (THIS PROJECT)
- **DO NOT** teach directly; the platform is a routing/decomposition engine.
- **NEVER** use standard class-based DI containers; stick to the manual `z.enum` Map.
- **NEVER** put domain types in plain TS `interface`s; use `z.infer<typeof schema>`.
- **DO NOT** ignore prerequisites; child nodes MUST fully represent parent's prerequisites.
- **DEPRECATED**: Do not use standard `@prisma/client`; use the custom generated client in `generated/prisma/`.

## UNIQUE STYLES
- **Signs of Completion (SoC)**: Used as the hard boundary for `Node` completion in the `Tree` architecture.
- **Currying**: Extensive use of `(deps) => (args) => logic`.

## COMMANDS
```bash
npm run dev    # Start dev server via tsx
npm test       # Run Vitest (requires test DB setup)
```

## NOTES
- The tree traversal utilizes BFS. Valid events are `step_up` (processed), `step_down` (disappointed), and `go_around` (branch mismatch).