# NODE MODULE

## OVERVIEW

Node lifecycle + tree structure. Building blocks with parent/child relationships. Uses Entity classes + aggregates.

## STRUCTURE

```
src/modules/node/
├── domain/
│   ├── entity/
│   │   ├── node.entity.ts       # RootNodeEntity, NodeEntity
│   │   └── nodeContext.entity.ts  # NodeContextEntity
│   ├── schema/
│   │   ├── node.schema.ts       # rootNodeSchema, nodeSchema
│   │   └── nodeContext.schema.ts
│   ├── aggregate/
│   │   ├── rootNode.aggregate.ts
│   │   └── node.aggregate.ts
│   ├── interface/
│   │   ├── node.interface.ts   # IRootNodeRepository, INodeRepository
│   │   └── nodeContext.interface.ts
│   └── service/
│       └── nodeFactory.service.ts
├── infrastructure/repository/
│   ├── node.repository.ts
│   ├── nodeContext.repository.ts
│   └── nodeMapper.ts
├── application/
│   ├── tree.service.ts    # TreeHandler (BFS tree assembly)
│   └── printTree.ts
└── controller/
    ├── node.controller.ts
    └── node.route.ts
```

## CODE MAP

| Symbol              | Type      | Location                                 |
| ------------------- | --------- | ---------------------------------------- |
| RootNodeEntity      | class     | domain/entity/node.entity.ts:5           |
| NodeEntity          | class     | domain/entity/node.entity.ts:11          |
| NodeContextEntity   | class     | domain/entity/nodeContext.entity.ts      |
| TreeHandler         | class     | application/tree.service.ts:11           |
| NodeFactory         | class     | domain/service/nodeFactory.service.ts:9  |
| NodeHandler         | class     | domain/service/nodeFactory.service.ts:61 |
| NodeAggregate       | class     | domain/aggregate/node.aggregate.ts:6     |
| RootNodeAggregate   | class     | domain/aggregate/rootNode.aggregate.ts   |
| IRootNodeRepository | interface | domain/interface/node.interface.ts       |

## NODE STATUS

- `NOT_STARTED` — prerequisite incomplete
- `IN_PROGRESS` — currently working
- `COMPLETED` — all prerequisites met + work done
- `FAILED` — blocker encountered

## NODE TYPES

- `BUILDING` — actionable task
- `CONCEPT` — conceptual prerequisite

## CONVENTIONS

- **Entity wrapping**: NodeEntity wraps nodeSchema from `domain/schema/`.
- **TreeHandler**: BFS tree assembly via `resumeExistingNodeFactoryByProjectId`.
- **NodeFactory**: Creates node aggregates for traversal.

## ANTI-PATTERNS

- **DO NOT** modify node state from routes — go through application layer.
- **DO NOT** skip Zod validation on node creation.
