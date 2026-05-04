# SESSION MODULE

## OVERVIEW

Session tracking — Project sessions, Threads, Messages with Entity classes + aggregates. Ownership enum for agent types.

## STRUCTURE

```
src/modules/session/
├── domain/
│   ├── entity/
│   │   ├── session.entity.ts   # SessionEntity
│   │   ├── thread.entity.ts   # ThreadEntity
│   │   └── message.entity.ts  # MessageEntity
│   ├── schema/
│   │   ├── session.schema.ts
│   │   ├── thread.schema.ts
│   │   └── message.schema.ts
│   ├── aggregate/
│   │   ├── sessionAggregate.ts
│   │   └── threadAggregate.ts
│   └── interface/
│       ├── session.interface.ts
│       ├── repository.interface.ts
├── infrastructure/
│   └── repository/
│       └── session.repository.ts
├── application/
│   ├── validate.ts
│   ├── getSessionsByProjectId.ts
│   └── sessionHandler.ts
└── controller/
    ├── session.controller.ts
    ├── session.route.ts
    └── projectAuth.middleware.ts
```

## CODE MAP

| Symbol              | Type      | Location                                 |
| ------------------- | --------- | ---------------------------------------- |
| SessionEntity       | class     | domain/entity/session.entity.ts:5        |
| ThreadEntity        | class     | domain/entity/thread.entity.ts           |
| MessageEntity       | class     | domain/entity/message.entity.ts          |
| ThreadAggregate     | class     | domain/aggregate/threadAggregate.ts      |
| SessionAggregate    | class     | domain/aggregate/sessionAggregate.ts:8   |
| ISessionRepository  | interface | domain/interface/repository.interface.ts |
| SessionOwner (enum) | Zod enum  | schema/session.schema.ts:3               |

## SESSION OWNERS

- `CODING_AGENT` — Main agent
- `EXTERNAL_AGENT` — External tool/agent
- **BACKGROUND_AGENT** — Background job

## MESSAGE ROLES

- `SYSTEM` — System prompts
- `HUMAN` — User messages
- `TOOL` — Tool outputs
- `AI` — Assistant responses

## CONVENTIONS

- Session belongs to Project via `projectId`.
- Thread belongs to Session.
- Message belongs to Thread.
- All entities extend Entity base class.

## ANTIPATTERNS

- **DO NOT** create session without projectId.
- **DO NOT** skip MessageRole validation.
- **DO NOT** skip Zod validation on entity creation.
