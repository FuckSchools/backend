# ROUTES

## OVERVIEW

Express router definitions mapping endpoints to controllers.

## CONVENTIONS

- **Thin Routers**: Only handle mapping. logic lives in controllers/use-cases.
- **Flat Structure**: Map sub-resources via path parameters, not nested routers.
- **Named Exports**: Export specific router instances (e.g., `authRouter`).

## ANTI-PATTERNS

- **Middleware Bloat**: Global auth middleware lives in `src/index.ts`.
- **Inline Handlers**: Always import functions from controllers.
