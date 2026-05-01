# SESSION MODULE

## OVERVIEW

Session tracking — Project sessions, Threads, Messages. Ownership enum for agent types.

## STRUCTURE

```
src/modules/session/
├── domain/
│   ├── entity/
│   │   ├── session.entity.ts   # Session, SessionProvider, SessionOwner
│   │   ├── thread.entity.ts    # Thread (session-scoped)
│   │   └── message.entity.ts   # Message with role (SYSTEM/HUMAN/TOOL/AI)
│   ├── interface/
│   │   ├── session.interface.ts
│   │   ├── thread.interface.ts
│   │   └── message.interface.ts
│   └── service/
└── infrastructure/
    └── repository/
```

## CODE MAP

| Symbol                | Type       | Location             |
| --------------------- | ---------- | -------------------- |
| SessionOwner          | Zod enum   | session.entity.ts:4  |
| sessionEntity         | Zod schema | session.entity.ts:10 |
| sessionProviderEntity | Zod schema | session.entity.ts:14 |
| MessageRole           | Zod enum   | message.entity.ts:4  |

## SESSION OWNERS

- `CODING_AGENT` — Main agent
- `EXTERNAL_AGENT` — External tool/agent
- `BACKGROUND_AGENT` — Background job

## MESSAGE ROLES

- `SYSTEM` — System prompts
- `HUMAN` — User messages
- `TOOL` — Tool outputs
- `AI` — Assistant responses

## CONVENTIONS

- Session belongs to Project via `projectId`.
- Thread belongs to Session.
- Message belongs to Thread.
- All entities extend `providerEntity.shape`.

## ANTI-PATTERNS

- **DO NOT** create session without projectId.
- **DO NOT** skip MessageRole validation.
