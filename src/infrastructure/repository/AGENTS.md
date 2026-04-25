# REPOSITORY INFRASTRUCTURE

## OVERVIEW

Concrete implementations bridging domain interfaces to the Prisma adapter.

## CONVENTIONS

- **Class-Based**: satisfying interfaces (e.g., `UserRepository implements IUserRepository`).
- **Entity Alignment**: Return domain entities from `src/entities/` via `internal`/`external` mapping.
- **Error Handling**: Use `IllegalOperationError` from `CustomError` for missing resources.
- **Strict Typing**: Use `z.infer` for all parameters and return types.

## ANTI-PATTERNS

- **NO Business Logic**: Keep logic in `src/applications/`.
- **Direct Prisma Exports**: Do not leak raw Prisma client objects.
- **Untyped Results**: Do not bypass Zod entity schemas.
