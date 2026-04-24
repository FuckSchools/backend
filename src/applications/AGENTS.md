# APPLICATIONS & USE CASES

## OVERVIEW

Business logic orchestrators written as higher-order curried functions for functional Dependency Injection.

## WHERE TO LOOK

| Task            | Location                | Notes                       |
| --------------- | ----------------------- | --------------------------- |
| Create new flow | `[feature]/[action].ts` | e.g. `user/registerUser.ts` |

## CONVENTIONS

- **Currying for DI**: Always export a function that takes dependencies (Repositories), returning an async function that performs the action.
  ```ts
  export const myUseCase = (Repo: IRepo) => async (input) => { ... }
  ```
- **Zod Coupling**: Use-case signatures heavily rely on `z.infer` from the `entities` layer.

## ANTI-PATTERNS

- **DO NOT** instantiate classes or dependencies inside the use case.
- **NEVER** use `new` keywords here. Rely entirely on the injected `I...Repository`.
