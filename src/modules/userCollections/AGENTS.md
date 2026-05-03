# USER COLLECTIONS MODULE

## OVERVIEW

Combined user + project module. Handles Clerk auth validation and Project CRUD. Non-standard naming — should be split into `user/` and `project/` modules.

## STRUCTURE

```
src/modules/userCollections/
├── domain/
│   ├── entity/
│   │   ├── user.entity.ts      # User (Clerk ID)
│   │   └── project.entity.ts   # Project (title, userId)
│   ├── interface/
│   │   ├── user.interface.ts
│   │   └── project.interface.ts
│   └── service/
│       └── user.service.ts
├── infrastructure/
│   └── repository/
│       ├── user.repository.ts
│       └── (project repo implicit)
├── application/
│   ├── createProject.ts
│   ├── getProject.ts
│   └── validate.ts        # Clerk auth validation
└── controller/
    ├── project.route.ts
    ├── project.controller.ts
    └── auth.middleware.ts
```

## CODE MAP

| Symbol                | Type       | Location                        |
| --------------------- | ---------- | ------------------------------- |
| userEntity            | Zod schema | domain/entity/user.entity.ts    |
| projectEntity         | Zod schema | domain/entity/project.entity.ts |
| projectProviderEntity | Zod schema | project.entity.ts:8             |

## CONVENTIONS

- **Auth**: Clerk middleware validates userId from request headers.
- **Project ownership**: userId links to Clerk user.
- **Functional DI**: Application layer uses curried functions.
- **Route + Controller pair**: Each has `.route.ts` and `.controller.ts`.

## ANTI-PATTERNS

- **DO NOT** skip auth middleware on project routes.
- **DO NOT** pass userId from client — validate via Clerk.
- **DO NOT** put domain logic in controller — delegate to application layer.
- **DO NOT** skip Zod validation on entity creation.

## STRUCTURE NOTES

- **Non-standard**: `domain/schema/` directory exists
- **Should split**: into `user/` and `project/` modules
