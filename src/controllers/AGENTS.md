# CONTROLLERS

## OVERVIEW

HTTP handlers bridging requests to functional use-cases with Zod validation.

## WHERE TO LOOK

- Auth: `auth.controller.ts` (Clerk sync).
- Tree: `tree.controller.ts` (Orchestration).
- Node: `node.controller.ts` (Atomic updates).

## CONVENTIONS

- Extract `userId` from `res.locals`.
- Parse payloads via Zod shapes from `src/entities/` before use-cases.
- Resolve dependencies via `getInjection`.
- Keep handlers thin; focus on status codes and response mapping.

## ANTI-PATTERNS

- Never put business logic in controllers.
- Do not bypass Zod validation.
- Do not pass raw `req` or `res` to use-cases.
