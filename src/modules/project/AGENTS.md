# PROJECT MODULE

## OVERVIEW
Project CRUD + tree ownership. User-scoped projects with optional linked tree.

## STRUCTURE
```
src/modules/project/
├── domain/
│   ├── entity/project.entity.ts    # projectEntity, projectProviderEntity
│   ├── interface/project.interface.ts  # IProjectRepository
│   └── service/project.service.ts  # ProjectService extends BaseService
├── infrastructure/repository/
│   └── project.repository.ts  # Implements IProjectRepository
├── application/
│   ├── createProject.ts      # Use-case
│   └── getProject.ts        # Use-case
└── controller/
    ├── project.controller.ts  # HTTP handlers
    └── project.route.ts     # Router definition
```

## CODE MAP

| Symbol | Type | Location |
|--------|------|----------|
| ProjectService | class | domain/service/project.service.ts |
| projectEntity | Zod schema | domain/entity/project.entity.ts |
| projectProviderEntity | Zod schema | domain/entity/project.entity.ts |
| IProjectRepository | interface | domain/interface/project.interface.ts |

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add project field | `domain/entity/project.entity.ts` | Extend with Zod |
| Add project query | `domain/service/project.service.ts` | Add method to service |
| Add endpoint | `controller/project.route.ts` | Add route |
| Override create logic | `infrastructure/repository/project.repository.ts` | Implement custom |

## ANTI-PATTERNS
- **DO NOT** validate with TS `interface` — use Zod schema.
- **DO NOT** instantiate service in controller directly — use application layer.