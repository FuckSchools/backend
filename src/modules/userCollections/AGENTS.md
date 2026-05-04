# USER COLLECTIONS MODULE

## OVERVIEW

Combined user + project module with Entity classes. Handles Clerk auth validation and Project CRUD. Non-standard naming — should be split into `user/` and `project/` modules.

## STRUCTURE

```
src/modules/userCollections/
├── domain/
│   ├── entity/
│   │   ├── user.entity.ts     # UserEntity
│   │   └── project.entity.ts  # ProjectEntity
│   ├── schema/
│   │   ├── user.schema.ts
│   │   └── project.schema.ts
│   ├── interface/
│   │   └── repository.interface.ts
│   └── service/
│       └── user.service.ts
├── infrastructure/
│   └── repository/
│       └── user.repository.ts
├── application/
│   ├── createProject.ts
│   ├── getProject.ts
│   └── validate.ts
└── controller/
    ├── project.route.ts
    ├── project.controller.ts
    └── auth.middleware.ts
```

## CODE MAP

| Symbol                | Type       | Location                        |
| --------------------- | ---------- | ------------------------------- |
| UserEntity            | class     | domain/entity/user.entity.ts     |
| ProjectEntity        | class    | domain/entity/project.entity.ts |
| IUserRepository     | interface| domain/interface/repository.interface.ts |

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

## NOTES

- **Non-standard**: `domain/schema/` directory exists
- **Should split**: into `user/` and `project/` modules