# SHARED MODULE

## OVERVIEW

Shared domain primitives — Entity base class, aggregate root, repository contract, events, value objects.

## STRUCTURE

```
src/modules/shared/domain/
├── entity/
│   └── entity.ts        # Entity<T> base class
├── interface/
│   ├── repository.interface.ts  # IRepository<T> contract
│   └── error.interface.ts   # Error classes
├── aggregate/
│   └── aggregateRoot.ts   # AggregateRoot<T>
├── event/
│   └── event.ts        # DomainEvent class
└── value-object/
    └── valueObject.ts # ValueObject<T> class
```

## CODE MAP

| Symbol        | Type      | Location                                 |
| ------------- | --------- | ---------------------------------------- |
| Entity        | class     | domain/entity/entity.ts:3                |
| AggregateRoot | class     | domain/aggregate/aggregateRoot.ts:4      |
| IRepository   | interface | domain/interface/repository.interface.ts |
| NotFoundError | class     | domain/interface/error.interface.ts:22   |

## CONVENTIONS

- **Entity<T>**: Generic class wrapping Zod schema. Takes `data`, `schema`, optional `id`.
- **AggregateRoot<T>**: Extends Entity, wraps another Entity.
- **IRepository**: `create`, `getById`, `getAll`, `save`, `delete`.

## ANTI-PATTERNS

- **DO NOT** use plain TS `interface` for domain types — use Entity wrapping Zod.
- **DO NOT** put business logic in shared — only primitives.
- **DO NOT** skip Zod validation on entity creation.

## NOTES

- **base.entity.ts**: Removed in refactor - NOT USED.
- **IRepository interface**: `create`, `getById`, `getAll`, `save`, `delete`.
- **No application/controller**: Only domain primitives.
