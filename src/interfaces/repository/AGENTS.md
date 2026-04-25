# REPOSITORY INTERFACES

## OVERVIEW

Abstract contracts defining data persistence using Zod-inferred types.

## WHERE TO LOOK

- `node.interface.ts`: Tree node lifecycle and lookups.
- `user.interface.ts`: Authentication and identity syncing.
- `tree.interface.ts`: Graph traversal contracts.
- `soc.interface.ts`: Signs of Completion (SoC) management.

## CONVENTIONS

- **Prefix with `I`**: Interfaces start with `I` (e.g., `IUserRepository`).
- **Zod Inference**: Use `z.infer<typeof entity.shape.internal>` for return types.
- **Promise Returns**: All methods must return a `Promise`.

## ANTI-PATTERNS

- **NO Implementations**: Do not include logic or concrete DB calls.
- **NO Plain TS Interfaces**: Use Zod inference for data shapes.
- **NO Domain Logic**: Business rules live in `src/applications/`.
