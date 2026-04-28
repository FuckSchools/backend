# PROJECT KNOWLEDGE BASE

**Generated:** 2026-04-28
**Commit:** 27da2e1
**Branch:** refactor-for-type

## OVERVIEW

Backend for FuckSchools: Anti-traditional education system. Node.js (TypeScript/ESM), Express.js, Prisma/PostgreSQL, Zod, Clerk. Entry: `src/index.ts`.

## STRUCTURE

```
.
├── prisma/
│   ├── schema.prisma        # Generator block only
│   └── models/            # Split models (users, projects, nodes, sessions, threads, messages)
├── generated/prisma/      # Custom Prisma output
└── src/
    ├── index.ts           # Entry point
    ├── config/            # Prisma singleton
    ├── types/           # Shared DTOs
    └── modules/
        ├── shared/       # BaseService, providerEntity, IRepository
        ├── project/     # Project CRUD
        ├── node/        # Node lifecycle
        ├── session/     # Session tracking
        ├── thread/      # Thread + messages
        └── user/        # Clerk auth validation
```

## CODE MAP

| Symbol         | Type           | Location                                                    |
| -------------- | -------------- | ----------------------------------------------------------- |
| prisma         | PrismaClient   | src/config/prisma.ts                                        |
| projectRouter  | Express Router | src/index.ts:21                                             |
| BaseService    | abstract class | src/modules/shared/domain/service/base.service.ts           |
| providerEntity | Zod schema     | src/modules/shared/domain/entity/base.entity.ts             |
| IRepository    | interface      | src/modules/shared/domain/interface/repository.interface.ts |

## WHERE TO LOOK

| Task              | Location                                      | Notes                                        |
| ----------------- | --------------------------------------------- | -------------------------------------------- |
| Add domain entity | `modules/{domain}/entity/`                    | Zod schema = truth. Use `z.infer` for types. |
| Add use-case      | `modules/{domain}/application/`               | Curried: `(deps) => async (input)`.          |
| Add repository    | `modules/{domain}/infrastructure/repository/` | Implements `IRepository`.                    |
| Wire DI           | `modules/{domain}/domain/service/`            | Instantiate repos here.                      |
| Add HTTP route    | `modules/{domain}/controller/`                | Route + Controller pair.                     |
| DB schema         | `prisma/models/`                              | Update .prisma → `prisma generate`.          |

## CONVENTIONS

- **Functional DI**: Higher-order functions: `(deps) => async (params) => { ... }`.
- **Zod = Type**: All domain types via `z.infer`. No plain `interface`.
- **ESM `.js`**: Append `.js` to relative imports in TS.
- **Extended Entities**: Domain entities extend `providerEntity.shape`.
- **Module Pattern**: Each module has `domain/entity/`, `domain/interface/`, `domain/service/`, `infrastructure/repository/`, `application/`, `controller/`.
- **ESLint**: `camelCase` filenames enforced, `prevent-abbreviations` off.

## ANTI-PATTERNS

- **DO NOT** import standard `@prisma/client`.
- **DO NOT** use class-based DI containers.
- **DO NOT** use plain TS `interface` for domain types.
- **DO NOT** edit `generated/prisma/` directly.
- **DO NOT** teach directly — routing engine only.

## COMMANDS

```bash
npm run dev          # Development server (tsx watch)
npm run test         # Vitest
npm run build       # tsc
npm run typecheck    # tsc --noEmit
npx prisma generate # Regenerate Prisma client
```
