# PRISMA MODELS

## OVERVIEW
Split Prisma schema architecture where models live in independent files.

## CONVENTIONS
- **Custom Generation**: Output to `generated/prisma/`.
- **Tree Relations**: Strict mapping between `Node`, `Tree`, and `StateOfCompletion`.

## ANTI-PATTERNS
- **Standard Client**: Never import from `@prisma/client`. Use the generated client.
- **Manual Edits**: Do not edit `generated/prisma/` directly. Update `.prisma` files and re-generate.
