# PRISMA MODELS

## OVERVIEW
Advanced Prisma configuration where standard `schema.prisma` is split into multiple independent model files.

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Add new table | `*.prisma` | Create a standalone schema file for the model. |

## CONVENTIONS
- **Custom Generation**: Models compile down into a custom `@prisma/adapter-pg` implementation outputted to `generated/prisma/`.
- **Tree-Centric Design**: Maintain the strict relations between `Node`, `Tree`, and `StateOfCompletion`.

## ANTI-PATTERNS
- **NEVER** try to import from the standard `@prisma/client`.
- **DO NOT** edit files in `generated/prisma/` directly. Update these `.prisma` files and re-generate.
