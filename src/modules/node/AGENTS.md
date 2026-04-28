# NODE MODULE

## OVERVIEW
Node lifecycle + tree structure. Building blocks with parent/child relationships.

## STRUCTURE
```
src/modules/node/
├── domain/
│   ├── entity/
│   │   ├── node.entity.ts       # nodeEntity, nodeProviderEntity
│   │   └── nodeContext.entity.ts  # NodeContext, ContextNode
│   ├── interface/
│   │   ├── node.interface.ts     # INodeRepository
│   │   └── nodeContext.interface.ts
│   └── service/
├── infrastructure/repository/
│   ├── node.repository.ts
│   └── nodeContext.repository.ts
├── application/
└── controller/
```

## CODE MAP

| Symbol | Type | Location |
|--------|------|----------|
| nodeEntity | Zod schema | domain/entity/node.entity.ts |
| nodeProviderEntity | Zod schema | domain/entity/node.entity.ts |
| nodeStatusEnum | Zod enum | node.entity.ts:4 |
| INodeRepository | interface | domain/interface/node.interface.ts |

## NODE STATUS
- `NOT_STARTED` — prerequisite incomplete
- `IN_PROGRESS` — currently working
- `COMPLETED` — all prerequisites met + work done
- `FAILED` — blocker encountered

## NODE TYPES
- `BUILDING` — actionable task
- `CONCEPT` — conceptual prerequisite

## ANTI-PATTERNS
- **DO NOT** modify node state from routes — go through application layer.
- **DO NOT** skip Zod validation on node creation.