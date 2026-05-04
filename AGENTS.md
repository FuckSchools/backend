# PROJECT KNOWLEDGE BASE

**Generated:** 2026-05-04
**Commit:** 48fe645
**Branch:** refactor-for-type

## OVERVIEW

Backend for FuckSchools: Anti-traditional education system. Node.js (TypeScript/ESM), Express.js, Prisma/PostgreSQL, Zod, Clerk. Entry: `src/index.ts`. Module-based hexagonal architecture.

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
    └── modules/
        ├── shared/       # BaseService, providerEntity, IRepository
        ├── node/        # Node lifecycle
        ├── session/     # Session tracking
        └── userCollections/  # User + Project (non-standard naming)
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
- **Test Runner**: Vitest (globals: true, no imports needed).

## STRUCTURE DEVIATIONS (EXPLORED)

| Module          | Status      | Issues                                        |
| --------------- | ----------- | --------------------------------------------- |
| node            | ✓ Compliant | None                                          |
| session         | ⚠️ Partial  | `domain/service/`, `domain/event/` empty dirs |
| userCollections | ⚠️ Partial  | `domain/schema/` non-standard                 |
| shared          | ⚠️ Missing  | No `application/`, `controller/`              |

## ANTI-PATTERNS (THIS PROJECT)

- **DO NOT** import standard `@prisma/client` — use `generated/prisma/client.js`.
- **DO NOT** use class-based DI containers.
- **DO NOT** use plain TS `interface` for domain types — use Zod `infer`.
- **DO NOT** edit `generated/prisma/` — update `.prisma` → regenerate.
- **DO NOT** modify node state from routes — go through application layer.
- **DO NOT** skip Zod validation on entity creation.

## UNIQUE STYLES

- **userCollections module**: Handles both user AND project — non-standard naming.
- **Split Prisma schemas**: Models in `prisma/models/*.prisma`, generator outputs to `generated/prisma/`.
- **README vs Implementation mismatch**: README documents traditional clean architecture, actual code uses module-based hexagonal.
- **Path aliases**: `@/*` maps to `src/modules/*`, `prisma/*` maps to `generated/prisma/*`.
- **No CI pipeline**: No GitHub Actions for lint/test/build. Only `opencode.yml` for AI assistant.
- **No pre-commit hooks**: No Husky or lint-staged.
- **packageManager mismatch**: Declares pnpm but uses npm scripts.

## CONFIG

- **TypeScript**: Strict mode, `verbatimModuleSyntax`, ESM (`module: nodenext`).
- **ESLint**: unicorn plugin with `prevent-abbreviations: off`, `filename-case: error`.
- **Prettier**: Single quotes, trailing commas, 2-space indent.

## COMMANDS

```bash
npm run dev          # Development server (tsx watch)
npm run test         # Vitest
npm run build       # tsc
npm run typecheck    # tsc --noEmit
npx prisma generate # Regenerate Prisma client
```

## NOTES

- **No test files**: Tests should colocate `src/modules/{domain}/**/*.test.ts`
- Module `userCollections` should likely be split into separate `user/` and `project/` modules.
- No Jest usage despite `@jest/globals` in dependencies — project uses Vitest.
- **No CI pipeline**: Only `opencode.yml` for AI assistant
