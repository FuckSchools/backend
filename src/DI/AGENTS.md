# DEPENDENCY INJECTION

## OVERVIEW
A tiny, manual, Service-Locator-style dependency injection map controlled via a strict `z.enum`.

## STRUCTURE
- `repository.ts`: Holds the injection map and instantiates concrete repos (like `UserRepository`).

## CONVENTIONS
- **Eager Instantiation**: Dependencies are currently instantiated at module load.
- **Zod Keys**: Dependency names MUST be registered in the central `z.enum` list.

## ANTI-PATTERNS
- **DO NOT** introduce heavy DI libraries (like Tsyringe or Inversify). Keep the footprint minimal.
- **NEVER** use class-based instantiation in controllers; always request dependencies through `getInjection()`.
