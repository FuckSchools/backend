# PROJECT KNOWLEDGE BASE

**Generated:** 2026-05-04
**Commit:** 7a0a294
**Branch:** main

## OVERVIEW

Backend for FuckSchools: Anti-traditional education system. Node.js (TypeScript/ESM), Express.js, Prisma/PostgreSQL, Zod, Clerk. Entry: `src/index.ts`. Module-based hexagonal architecture with Entity classes.

## STRUCTURE

```
.
├── prisma/
│   ├── schema.prisma        # Generator block only
│   └── models/            # Split models (users, projects, nodes, sessions, threads, messages)
├── generated/prisma/      # Custom Prisma output (DO NOT EDIT)
└── src/
    ├── index.ts           # Entry point (Express app)
    ├── config/            # Prisma singleton
    ├── types/           # Shared DTOs
    ├── DI/              # Manual dependency injection
    └── modules/
        ├── shared/       # Entity base class, aggregate root, events
        ├── node/        # Node lifecycle, tree service
        ├── session/     # Session tracking
        └── userCollections/  # User + Project (non-standard naming)
```

## CODE MAP

| Symbol        | Type           | Location                                                    |
| ------------- | -------------- | ----------------------------------------------------------- |
| prisma        | PrismaClient   | src/config/prisma.ts                                        |
| projectRouter | Express Router | src/index.ts:21                                             |
| Entity        | class          | src/modules/shared/domain/entity/entity.ts                  |
| IRepository   | interface      | src/modules/shared/domain/interface/repository.interface.ts |

## WHERE TO LOOK

| Task              | Location                                      | Notes                                       |
| ----------------- | --------------------------------------------- | ------------------------------------------- |
| Add domain entity | `modules/{domain}/entity/`                    | Entity class extends base, wraps Zod schema |
| Add Zod schema    | `modules/{domain}/domain/schema/`             | Schema file, used by Entity                 |
| Add aggregate     | `modules/{domain}/domain/aggregate/`          | Aggregate roots for bounded contexts        |
| Add use-case      | `modules/{domain}/application/`               | Curried: `(deps) => async (input)`.         |
| Add repository    | `modules/{domain}/infrastructure/repository/` | Implements IRepository.                     |
| Add HTTP route    | `modules/{domain}/controller/`                | Route + Controller pair.                    |
| DB schema         | `prisma/models/`                              | Update .prisma → `prisma generate`.         |

## CONVENTIONS

- **Entity Class**: Domain entities are ES6 classes wrapping Zod schemas (not plain Zod schemas).
- **Functional DI**: use-cases as higher-order functions: `(deps) => async (params) => { ... }`.
- **Schema Layer**: Zod schemas in `domain/schema/` directory, imported by Entity classes.
- **Aggregate Pattern**: DDD aggregates in `domain/aggregate/`.
- **ESM `.js`**: Append `.js` to relative imports in TS.
- **Module Pattern**: Each module has `domain/entity/`, `domain/schema/`, `domain/aggregate/`, `domain/interface/`, `infrastructure/repository/`, `application/`, `controller/`.
- **ESLint**: `camelCase` filenames enforced, `prevent-abbreviations` off.
- **Test Runner**: Vitest (globals: true, no imports needed).

## ANTI-PATTERNS (THIS PROJECT)

- **DO NOT** import standard `@prisma/client` — use `generated/prisma/client.js`.
- **DO NOT** use class-based DI containers — manual DI in `src/DI/repository.ts`.
- **DO NOT** use plain TS `interface` for domain types — use Zod `infer` via Entity.
- **DO NOT** edit `generated/prisma/` — update `.prisma` → regenerate.
- **DO NOT** modify node state from routes — go through application layer.
- **DO NOT** skip Zod validation on entity creation.

## UNIQUE STYLES

- **Entity-based**: Domain entities are `Entity<T>` classes, not plain Zod schemas.
- **userCollections module**: Handles both user AND project — non-standard naming.
- **Split Prisma schemas**: Models in `prisma/models/*.prisma`, generator outputs to `generated/prisma/`.
- **Path aliases**: `@/*` maps to `src/modules/*`, `prisma/*` maps to `generated/prisma/*`.
- **No CI pipeline**: No GitHub Actions for lint/test/build.
- **No pre-commit hooks**: No Husky or lint-staged.

## COMMANDS

```bash
npm run dev          # Development server (tsx watch)
npm run test         # Vitest
npm run build       # tsc
npm run typecheck    # tsc --noEmit
npx prisma generate # Regenerate Prisma client
```

## NOTES

- **Entity architecture**: Uses `Entity<T>` class pattern with Zod schema validation.
- **Module `userCollections`**: Should likely be split into separate `user/` and `project/` modules.
- **Aggregates exist**: `node/`, `session/`, `shared` have `domain/aggregate/` directories.
- **Schemas exist**: All modules have `domain/schema/` for Zod definitions.
