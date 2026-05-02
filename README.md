# FuckSchools Backend

> **Version 3.1** — canonical specification.

## Purpose

The backend is the execution layer for the FuckSchools graph. It owns the canonical domain model, evaluates traversal signals, records blockers, persists state, and emits normalized events for the studio layer. The backend is intentionally narrow: it should transform state, not render it, and it should enforce policy, not improvise UI behavior.

In v3.1 the backend adds passive MCP signal observation and delegates ConceptNode resolution authority to the Native Renderer's EventTrace. All domain boundaries are enforced through Zod at parse time. Additionally, the backend maintains a Dynamic Demand Resolution Tree (DDRT) per traversal cycle and propagates GoalContext without mutation across the full traversal pipeline.

> **Implementation status**: Zod structural enforcement, the hexagonal module structure, the `NodeContext`-based DDRT assembly (`rootNodeHandler.ts`), and the `ProjectService.isAuthorized` ownership pattern are **implemented in the current codebase**. The Passive Observation Layer (MCP), EventTrace integration, structured GoalContext entity, and the `node_transition` audit log are **specified below as v3.1 contracts** — they are required next steps and are not yet present in source.

## Module Map

The codebase is organized as a set of self-contained hexagonal modules under `src/modules/`. Each module owns its domain entity definitions, business logic, repository interfaces, infrastructure adapters, and (where applicable) HTTP transport.

```
src/
├── index.ts                          # Express app entry point and route wiring
├── config/
│   └── prisma.ts                     # PrismaClient singleton (custom adapter, test/prod switch)
├── DI/
│   └── repository.ts                 # Manual dependency injection map; concrete repos registered here
├── types/
│   └── globals.d.ts                  # Global TypeScript augmentations (res.locals shape, etc.)
└── modules/
    ├── shared/
    │   └── domain/
    │       ├── entity/
    │       │   ├── base.entity.ts    # providerEntity Zod schema (id, createdAt, optional updatedAt)
    │       │   └── error.entity.ts   # errorEnum and CustomError class
    │       ├── interface/
    │       │   └── error.interface.ts# knownErrors list used by error middleware
    │       └── service/
    │           └── base.service.ts   # Generic BaseService<T, K> — entity/full-entity/formerEntityId state
    ├── node/
    │   ├── domain/
    │   │   ├── entity/
    │   │   │   ├── node.entity.ts    # nodeEntity, rootNodeEntity, full variants, enums (Status, NodeType)
    │   │   │   └── nodeContext.entity.ts # nodeContextEntity and full variant
    │   │   ├── interface/
    │   │   │   ├── node.interface.ts # IRootNodeRepository, INodeRepository, persistent service interfaces
    │   │   │   └── nodeContext.interface.ts # INodeContextRepository
    │   │   └── service/
    │   │       ├── node.service.ts   # NodeService, RootNodeService (extend BaseService)
    │   │       ├── nodeContext.service.ts # NodeContextService (extend BaseService)
    │   │       └── nodePresistence.ts # RootNodePersistentService, NodePersistentService (output builders)
    │   ├── application/
    │   │   └── rootNodeHandler.ts    # getNodesByProjectId use-case (recursive BFS tree assembly)
    │   ├── infrastructure/
    │   │   └── repository/
    │   │       ├── node.repository.ts        # RootNodeRepository, NodeRepository (Prisma adapters)
    │   │       ├── nodeContext.repository.ts # NodeContextRepository (Prisma adapter)
    │   │       └── nodeRepositorySchema.ts   # Zod schemas bridging Prisma nullable fields → domain types
    │   └── controller/
    │       ├── node.controller.ts    # GET /nodes/:projectId — ownership check then tree assembly
    │       └── node.route.ts         # Express router for /nodes
    ├── session/
    │   └── domain/
    │       ├── entity/
    │       │   ├── session.entity.ts # sessionEntity, sessionFullEntity, SessionOwner enum
    │       │   ├── thread.entity.ts  # threadEntity (includes goals field), threadFullEntity
    │       │   └── message.entity.ts # messageEntity, MessageRole enum, messageFullEntity
    │       ├── interface/
    │       │   ├── session.interface.ts # ISessionRepository (extends IThreadRepository + IMessageRepository)
    │       │   ├── thread.interface.ts  # IThreadRepository
    │       │   └── message.interface.ts # IMessageRepository
    │       ├── service/
    │       │   └── session.service.ts # SessionService, ThreadService, MessageService, SessionSingularService
    │       └── infrastructure/
    │           └── repository/
    │               └── session.repository.ts # Prisma adapter for sessions, threads, messages
    └── userCollections/
        ├── domain/
        │   ├── entity/
        │   │   ├── user.entity.ts    # userEntity (clerkId), userFullEntity
        │   │   └── project.entity.ts # projectEntity (title), projectFullEntity (+ userId)
        │   ├── interface/
        │   │   ├── user.interface.ts  # IUserRepository
        │   │   └── project.interface.ts # IProjectRepository, IUserCollectionRepository
        │   └── service/
        │       └── user.service.ts   # ProjectService, UserCollectionService (create/acquire projects)
        ├── application/
        │   ├── createProject.ts      # createProject use-case
        │   ├── getProject.ts         # getProject, getProjects use-cases
        │   └── validate.ts           # validateUser — upsert by Clerk ID
        ├── infrastructure/
        │   └── repository/
        │       └── user.repository.ts # UserCollectionRepository (Prisma adapter)
        └── controller/
            ├── auth.middleware.ts    # Clerk auth + user upsert → res.locals.userId
            ├── project.controller.ts # createProjectController, getProjectController
            └── project.route.ts      # Express router for / (projects)
```

### Conventions

- **Functional DI**: use-cases are higher-order functions: `(deps) => async (params) => { ... }`.
- **Zod = Type**: all domain types are derived via `z.infer`; no standalone `interface` for domain shapes.
- **ESM `.js` imports**: relative imports in TypeScript source always append `.js`.
- **Extended entities**: domain full-entities extend `providerEntity.shape` (id, createdAt, updatedAt?).
- **Path aliases**: `@/*` → `src/modules/*`, `prisma/*` → `generated/prisma/*`.
- **Custom Prisma output**: import from `generated/prisma/client.js`, never from `@prisma/client`.
- **No class-based DI containers**: repos are instantiated manually in `src/DI/repository.ts`.

## Prisma Schema v3.1

The schema is split across `prisma/schema.prisma` (generator/datasource) and `prisma/models/*.prisma` (models). The v3.1 shape removes the `Tree` indirection, promotes `Node` to carry its own graph position, and adds `NodeContext` for per-node traversal metadata.

```prisma
enum Status {
  NOT_STARTED
  IN_PROGRESS
  COMPLETED
  FAILED
}

enum NodeType {
  BUILDING
  CONCEPT
}

model User {
  id        String    @id @default(uuid())
  clerkId   String    @unique
  projects  Project[]
  createdAt DateTime  @default(now())
}

model Project {
  id        String    @id @default(uuid())
  title     String
  userId    String
  user      User      @relation(fields: [userId], references: [id])
  sessions  Session[]
  rootNode  Node?
  updatedAt DateTime  @updatedAt
  createdAt DateTime  @default(now())

  @@index([userId])
}

model Node {
  id         String      @id @default(uuid())
  status     Status      @default(NOT_STARTED)
  type       NodeType    @default(BUILDING)
  goal       String
  blocker    String?
  depth      Int
  parentId   String?
  parentNode Node?       @relation("NodeToNode", fields: [parentId], references: [id])
  childNodes Node[]      @relation("NodeToNode")
  context    NodeContext?
  projectId  String?     @unique   // set only on the root node
  project    Project?    @relation(fields: [projectId], references: [id])
  createdAt  DateTime    @default(now())
}

model NodeContext {
  id             String   @id @default(uuid())
  nodeId         String   @unique
  node           Node     @relation(fields: [nodeId], references: [id])
  rootNodeId     String
  pathFromRoot   String[]
  intentSummary  String
  constraints    String[]
  successSignals String[]
  createdAt      DateTime @default(now())
}

model Session {
  id        String       @id @default(uuid())
  projectId String
  project   Project      @relation(fields: [projectId], references: [id], onDelete: Cascade)
  owner     SessionOwner
  threads   Thread[]
  updatedAt DateTime     @updatedAt
  createdAt DateTime     @default(now())

  @@index([projectId, owner])
}

enum SessionOwner {
  CODING_AGENT
  EXTERNAL_AGENT
  BACKGROUND_AGENT
}

model Thread {
  id        String    @id @default(uuid())
  goals     String
  sessionId String
  session   Session   @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  messages  Message[]
  updatedAt DateTime  @updatedAt
  createdAt DateTime  @default(now())

  @@index([sessionId])
}

model Message {
  id        String      @id @default(uuid())
  threadId  String
  thread    Thread      @relation(fields: [threadId], references: [id], onDelete: Cascade)
  content   String
  role      MessageRole
  createdAt DateTime    @default(now())

  @@index([threadId, role])
}

enum MessageRole {
  SYSTEM
  HUMAN
  TOOL
  AI
}
```

### Key schema changes from v3.0

| Change                         | Detail                                                                                                                              |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| `Tree` model removed           | Project now holds a direct `rootNode` relation.                                                                                     |
| `Node.goal` replaces `content` | Expresses intent rather than generic content.                                                                                       |
| `Node.type` added              | `BUILDING` for task nodes, `CONCEPT` for knowledge nodes.                                                                           |
| `Node.blocker` added           | Nullable persisted blocker string on the node itself.                                                                               |
| `Node.depth` added             | Integer distance from root; maintained by the application layer.                                                                    |
| `Status.FAILED` added          | Fourth terminal state alongside `COMPLETED`.                                                                                        |
| `NodeContext` added            | Carries traversal metadata (pathFromRoot, intentSummary, constraints, successSignals).                                              |
| `User.clerkId` added           | Unique external identity; `id` is now an internal UUID.                                                                             |
| `Thread.goals` added           | String carrying the goal context for the thread.                                                                                    |
| Composite indices added        | `Project@@index([userId])`, `Session@@index([projectId, owner])`, `Thread@@index([sessionId])`, `Message@@index([threadId, role])`. |

## Traversal Logic

Traversal is demand-driven and reactive. The backend does not precompute a curriculum and force users through it. It listens for demand signals and re-evaluates the graph whenever a meaningful state change occurs.

Canonical event flow:

```
Intent → Normalize → Select frontier → Evaluate blockers/prerequisites
       → Emit normalized traversal events → Persist new state
```

The emitted event vocabulary is deliberately narrow:

- `node_updated`
- `blocker_detected`
- `step_down`
- `step_up`
- `go_around`

Behavioral rules:

- Traversal is always relative to the current project/session state.
- A frontier is chosen from unresolved demand plus current blockers.
- A blocker is a persisted domain fact on the `Node` record, not a UI hint.
- Transition type priority order: `step_down` is preferred, then `step_up`, then `go_around`. See the DDRT section for full definitions.
- Reactive loops recompute only when input state changes: new demand, updated blocker state, altered completion evidence, or graph mutation.
- The backend stays deterministic given the same graph and signals.

The `getNodesByProjectId` use-case in `src/modules/node/application/rootNodeHandler.ts` assembles the full tree via concurrent BFS: it fetches the root node, then recursively resolves child nodes and their `NodeContext` records in parallel using `Promise.allSettled`.

## SoC Enforcement Rules

- Domain entities (Zod schemas + `z.infer` types) stay pure. They do not import Prisma models, repositories, or HTTP code.
- Application use-cases own business policy and traversal logic.
- Infrastructure (repository implementations) owns IO, persistence, and external integrations.
- Controllers and routes translate transport shapes only; they do not contain business policy.
- Prisma models stay in the persistence boundary. Domain entities must never directly reference a Prisma-generated type.
- Domain rules for blockers, prerequisites, and completion must not leak into route handlers.
- Event emission is performed by application services or infrastructure adapters, never by entities.
- Shared types describe contracts, not behavior.
- Anything that changes policy lives in `application/`, not `infrastructure/`.
- Anything that touches the database stays behind a repository interface.
- Module-level `AGENTS.md` files carry agent instructions. They are not application code.

## Passive Observation Layer (MCP Signals)

> **Status**: planned — not yet implemented in source. The infrastructure adapter module and signal normalization layer described here are required next steps.

The backend treats MCP (Model Context Protocol) signal streams as a passive, read-only observation channel. It never writes back to the MCP channel and never initiates requests over it. When implemented, the ingestion adapter will live in `src/modules/session/infrastructure/` (for session lifecycle signals) and `src/modules/node/infrastructure/` (for demand signals that affect the DDRT).

Signal types consumed from MCP:

- `agent_event` — lifecycle notifications from coding/background agents.
- `context_delta` — incremental context updates emitted by an active agent session.
- `session_ping` — heartbeat signals used to keep session liveness current.
- `capability_request` — agent declarations of intent that seed the DDRT demand side.

Processing rules:

- MCP signals are received by infrastructure adapters and normalized into internal domain events before being handed to application services.
- Signals must not cross the entity boundary in their raw form.
- Signal normalization is idempotent; duplicate delivery of the same signal must be safe.
- An unrecognized or malformed signal is logged and discarded; it must never cause a traversal failure.
- The observation layer is strictly append-only with respect to signal intake; no signal is acknowledged or transformed in-place by the backend.

## Native Renderer and EventTrace

> **Status**: planned — no `EventTrace` Prisma model or repository exists yet. The ConceptNode resolution policy and the EventTrace repository interface described here are required next steps.

The Native Renderer is the authoritative source of EventTrace records and is the ground truth for ConceptNode resolution. The backend does not unilaterally decide that a node is complete; it waits for a completion EventTrace emitted by the Native Renderer.

ConceptNode resolution rules:

- A ConceptNode is considered resolved when the Native Renderer has emitted a corresponding completion EventTrace for that node in the current session.
- The backend reads EventTrace records through a repository interface; it does not query the renderer directly.
- Partial or in-progress EventTrace records do not count as completion evidence.
- If no EventTrace exists for a node, its resolution state is `NOT_STARTED` by default.
- The backend must not infer resolution from conversational history, MCP signals, or any source other than a committed EventTrace record.
- EventTrace records are immutable once committed; the backend treats them as append-only facts.

Architecture placement:

- `src/modules/*/infrastructure/` owns the EventTrace repository adapter.
- `src/modules/*/application/` owns the policy that reads EventTrace records and decides traversal outcomes.
- `src/modules/*/domain/entity/` defines the EventTrace domain type via a Zod schema; it never imports the Prisma model.

## Zod Structural Enforcement

All domain boundaries are enforced through Zod schemas at parse time. Runtime type assertions (`as SomeType`) are prohibited where a Zod parse is feasible.

Boundary rules:

- **Provider entities** (`providerEntity` and extensions) carry persistence-layer identity fields (id, createdAt, optional updatedAt).
- **Domain entities** (e.g. `nodeEntity`, `projectEntity`) carry business fields only; they extend provider shapes to form full entities.
- **Repository schemas** (e.g. `nodeRepositorySchema`) bridge Prisma's nullable fields to domain types using `.extend()` with nullable overrides; mappers then coerce nulls to domain-safe defaults.
- A schema parse failure at any boundary is a hard validation error, not a recoverable condition.
- Parse errors at the HTTP boundary result in a `400` response with a sanitized, field-level error payload — never a raw Zod error object.
- TypeScript types for all domain entities are derived via `z.infer<typeof SomeSchema>`; standalone `interface` declarations for domain types are prohibited.
- Zod refinements and `.transform()` calls that apply business policy belong in `src/modules/*/domain/entity/`, not in controllers or infrastructure.

## DDRT (Dynamic Demand Resolution Tree)

The Dynamic Demand Resolution Tree (DDRT) is the runtime representation of the learner's current decomposition state within a single traversal cycle.

Structure and lifecycle:

- The DDRT is reconstructed from persisted graph state (`Node` + `NodeContext` records) at the start of each traversal invocation.
- It is not persisted directly; it is derived, used, and discarded within a single traversal cycle.
- DDRT nodes carry: demand weight, blocker string, node status, node type, depth, `NodeContext` (pathFromRoot, intentSummary, constraints, successSignals), and the current GoalContext snapshot.
- The DDRT root corresponds to the project's root `Node` (the one with a non-null `projectId`).
- The `RootNodePersistentService` and `NodePersistentService` classes in `nodePresistence.ts` are the in-memory output builders for the DDRT; `output()` serializes the assembled tree.

Traversal priority order:

- When choosing the next transition, the backend evaluates candidate types in priority order: `step_down` is preferred, then `step_up`, then `go_around`.
- `step_down`: move to the highest-demand unresolved child node.
- `step_up`: move to the parent when the current subtree is fully resolved or blocked.
- `go_around`: skip the current node and move to the next frontier node when a blocker is unresolvable in the current session.
- Traversal terminates when no frontier node with unmet demand remains.

Demand weighting:

- Demand is computed from GoalContext signals, blocker urgency, and node depth.
- Demand weights are recalculated on each traversal cycle; they are not cached between cycles.

## GoalContext Propagation

> **Status**: partially implemented. `Thread.goals` (a plain string) and `NodeContext.intentSummary/constraints/successSignals` carry goal-context data in the current schema. The structured `GoalContext` entity (Zod schema, explicit propagation parameter) described below is a required next step — it will live in `src/modules/session/domain/entity/goalContext.entity.ts` when implemented.

GoalContext is a structured, immutable payload that carries the learner's stated intent through the entire traversal pipeline from session initiation to node resolution. It maps to the `goals` field on `Thread` and the `intentSummary`, `constraints`, and `successSignals` fields in `NodeContext`.

Propagation rules:

- GoalContext is attached once at session/thread initiation and flows through each traversal step without mutation.
- Application services may read GoalContext to inform demand weighting and frontier selection, but must not modify it.
- GoalContext is passed as an explicit parameter to every traversal use-case; it must not be retrieved from a global or thread-local store.
- A GoalContext snapshot is recorded in the `node_transition` audit log for every state transition, enabling replay and post-hoc analysis.
- If a session has no GoalContext (legacy or anonymous sessions), traversal falls back to uniform demand weighting.

GoalContext shape (Zod-enforced):

- `goalId` — stable identifier for this goal, scoped to the project.
- `intent` — the learner's stated intent as a normalized string (maps to `Thread.goals`).
- `prioritySignals` — ordered list of concept identifiers the learner has expressed priority for.
- `constraints` — optional hard constraints (maps to `NodeContext.constraints`).
- `successSignals` — observable outcomes that confirm the goal is met (maps to `NodeContext.successSignals`).
- `createdAt` — timestamp of goal declaration; immutable after creation.

## v3.1 Copilot Security and Performance Fixes

The following requirements apply across all backend services as part of the v3.1 hardening pass. They are in addition to, not instead of, the SoC Enforcement Rules above.

### Centralized Error Handling

- All unhandled exceptions must be caught exclusively by the global error middleware.
- Controllers must not contain `try/catch` blocks that swallow exceptions without re-throwing to the middleware chain.
- Custom application errors must extend `CustomError` (defined in `src/modules/shared/domain/interface/error.interface.ts`) so the middleware can discriminate them by the `errorEnum` type.
- The global middleware maps `CustomError` subtypes to appropriate HTTP status codes; anything not in `knownErrors` maps to `500`.

### Redacted Diagnostics

- Error responses sent to the client must never include stack traces, internal resource IDs, raw Prisma errors, or any infrastructure detail.
- Diagnostic information (stack, query, context) is emitted only to the server-side logger.
- The sanitized client payload includes only: `error` (a stable `errorEnum` code string), `message` (human-readable, safe), and optionally `fields` (for validation errors).
- This rule applies even in non-production environments; diagnostic verbosity is controlled through log level, not through response bodies.

### Cursor-Paginated Thread History

- All queries that retrieve thread messages must use cursor-based pagination.
- Loading an unbounded message list in a single query is prohibited on any code path that serves traversal or agent context assembly.
- The default page size is 50 messages; the maximum page size is 200.
- Repository contracts must expose a `listMessages(threadId, cursor?, limit?)` signature; callers must not bypass this by querying the `Message` table directly.
- Cursors are opaque strings from the caller's perspective; internally they encode the `createdAt` timestamp and `id` of the last seen record.

### Denormalized Ownership Checks

- `Project`, `Session`, and `Thread` records each carry a denormalized `userId` (or derive it from their parent chain) so that authorization can be resolved without unbounded joins.
- Ownership validation must happen before any other query in every request handler; a request that fails ownership validation is rejected with `403` before business logic runs.
- The `ProjectService.isAuthorized()` pattern (comparing `fullEntity.userId` to `formerEntityId`) is the canonical ownership check; all new services must follow this pattern.
- Repository interfaces must expose a `checkOwnership(resourceId, userId)` method that returns a boolean without loading the full entity.

### Fail-Closed Validation

- Any request that fails Zod schema parsing or ownership validation must be rejected immediately with no partial processing.
- The backend must not attempt to proceed with a best-effort interpretation of an invalid payload.
- Fail-closed applies recursively: if a sub-operation within a use-case receives an invalid intermediate value, it must throw rather than degrade gracefully.
- Optional fields that are absent are treated as absent (not coerced to defaults) unless a Zod `.default()` is explicitly declared in the schema.

## v3.1 Backend Implementation Contract

### node_transition Audit Log Schema

> **Status**: planned — not yet in the Prisma schema. Add the model to `prisma/models/` and regenerate the client. The schema below is the required target shape.

The `node_transition` table is an append-only audit log for every graph movement. It must not be used as mutable working state.

Required fields:

- `transitionId` — UUID, primary key.
- `projectId` — foreign key to `Project`.
- `sessionId` — foreign key to `Session`.
- `threadId` — foreign key to `Thread` (the thread active at the time of transition).
- `fromNodeId` — the node the traversal is moving away from (nullable for initial placement).
- `toNodeId` — the node the traversal is moving to.
- `transitionType` — enum: `step_down | step_up | go_around | initial | terminal`. `initial` is recorded when a node is first entered at session start; `terminal` is recorded when the project root is fully resolved and the traversal session closes.
- `triggerSource` — enum: `mcp_signal | user_event | agent_event | system`.
- `blockerIds` — JSON array of blocker strings active at transition time.
- `goalContextSnapshot` — JSON snapshot of the GoalContext at transition time.
- `evidenceSnapshot` — JSON snapshot of completion evidence consulted during the transition decision.
- `createdAt` — timestamp, set by the database at insert time.
- `actorId` — the internal user UUID (or agent ID) that triggered the transition.

The log row must be sufficient for replay, debugging, and downstream analytics without re-querying mutable application state.

### Performance Notes

- Use `findFirst` when querying by non-unique fields (e.g. filtering by `projectId` or `userId`); `findUnique` is only correct when the filter targets a unique constraint or primary key and will error otherwise.
- Use the composite indices already defined on `Project`, `Session`, `Thread`, and `Message` to avoid full-table scans on hot traversal paths.
- Apply cursor pagination to all thread history queries (see Cursor-Paginated Thread History above) so the traversal loop never loads unbounded conversational context.
- These optimizations must be expressed in repository contracts and read models, not embedded inside controller logic.
