# APPLICATIONS

## OVERVIEW

Business logic orchestrators using curried higher-order functions for functional DI.

## CONVENTIONS

- **Currying for DI**: Export a function taking dependencies, returning an async action function.
- **Zod Coupling**: Use `z.infer` from entities for use-case signatures.

## ANTI-PATTERNS

- **NO Instantiation**: Do not use `new` or instantiate dependencies inside the use-case.
- **Dependency Only**: Rely strictly on injected `I...Repository` interfaces.
