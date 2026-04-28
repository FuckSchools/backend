# SHARED MODULE

## OVERVIEW
Shared domain primitives — base entity, service abstraction, repository contract.

## STRUCTURE
```
src/modules/shared/domain/
├── entity/
│   ├── base.entity.ts    # providerEntity (id, createdAt, updatedAt)
│   └── error.entity.ts   # Domain errors
├── interface/
│   └── repository.interface.ts  # IRepository<T, P> contract
└── service/
    └── base.service.ts   # BaseService<T, K> abstract class
```

## CODE MAP

| Symbol | Type | Location |
|--------|------|----------|
| providerEntity | Zod schema | domain/entity/base.entity.ts:3 |
| IRepository | interface | domain/interface/repository.interface.ts |
| BaseService | abstract class | domain/service/base.service.ts |

## CONVENTIONS
- **providerEntity**: Base for all domain entities via `.extend(providerEntity.shape)`.
- **IRepository**: Generic CRUD: `create`, `getById`, `getAll`.
- **BaseService**: Abstract CRUD + Zod parse/parseMany.

## ANTI-PATTERNS
- **DO NOT** use plain TS `interface` for domain types — use Zod `infer`.
- **DO NOT** put domain logic in shared — only primitives.