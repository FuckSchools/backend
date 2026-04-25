# DEPENDENCY INJECTION

## OVERVIEW

Manual Service-Locator map controlled via `z.enum`.

## CONVENTIONS

- **Eager Instantiation**: Dependencies instantiate at module load in `repository.ts`.
- **Zod Keys**: Names must be registered in the central `z.enum`.

## ANTI-PATTERNS

- **NO DI Libraries**: Keep the footprint minimal; no Tsyringe or Inversify.
- **Service Locator**: Request dependencies strictly through `getInjection()`.
