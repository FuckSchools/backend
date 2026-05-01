# FuckSchools Backend

> **Version 3.1** — canonical specification.

## Purpose

The backend is the execution layer for the FuckSchools graph. It owns the canonical domain model, evaluates traversal signals, records blockers, persists state, and emits normalized events for the studio layer. The backend is intentionally narrow: it should transform state, not render it, and it should enforce policy, not improvise UI behavior.

In v3.1 the backend adds passive MCP signal observation and delegates ConceptNode resolution authority to the Native Renderer's EventTrace. All domain boundaries are enforced through Zod at parse time. Additionally, the backend maintains a Dynamic Demand Resolution Tree (DDRT) per traversal cycle and propagates GoalContext without mutation across the full traversal pipeline.

## Clean Architecture Module Map

- src/entities/: pure domain primitives and state carriers.
  - node.entity.ts, tree.entity.ts, project.entity.ts, session.entity.ts, thread.entity.ts, message.entity.ts, prerequisite.entity.ts, soc.entity.ts, error.entity.ts.
  - No transport code, no Prisma imports, no HTTP concerns.
- src/applications/: use-case orchestration and policy execution.
  - Traversal planning, signal normalization, blocker registration, state transitions, event emission.
- src/controllers/: transport adapters that translate HTTP/request payloads into application commands.
- src/routes/: endpoint wiring and request surface.
- src/DI/: dependency wiring and concrete implementation registration.
- src/infrastructure/: persistence adapters, emitters, and external integrations.
- src/interfaces/: repository contracts and cross-layer interface definitions.
- src/middlewares/: auth, error handling, request lifecycle concerns.
- src/config/: environment, constants, runtime config.
- src/types/: shared TypeScript types and DTO glue.

## Prisma Schema v3.0

The Prisma layout is split across prisma/schema.prisma and prisma/models/\*.prisma. The v3.0 shape centers on graph traversal, project/session tracking, and message persistence.

```prisma

  enum Status {
    NOT_STARTED
    IN_PROGRESS
    COMPLETED
  }

  model User {
    id        String    @id
    projects  Project[]
    createdAt DateTime   @default(now())
  }

  model Project {
    id          String   @id @default(uuid())
    title       String
    userId      String
    sandboxExId String?  @unique
    user        User     @relation(fields: [userId], references: [id])
    sessions    Session[]
    tree        Tree?    @relation(name: "TreeToProject")
    updatedAt   DateTime @updatedAt
    createdAt   DateTime @default(now())
  }

  model Tree {
    id        String   @id @default(uuid())
    projectId String   @unique
    project   Project  @relation(fields: [projectId], references: [id], name: "TreeToProject", onDelete: Cascade)
    rootNode  Node?    @relation(name: "TreeToRootNode")
    updatedAt DateTime @updatedAt
    createdAt DateTime @default(now())
  }

  model Node {
    id                 String              @id @default(uuid())
    prerequisites      Prerequisite[]
    statesOfCompletion  StateOfCompletion[]
    content            String
    parentNodeId       String?
    parentNode         Node?               @relation("NodeToNode", fields: [parentNodeId], references: [id], onDelete: Cascade)
    treeId             String?             @unique
    tree               Tree?               @relation(name: "TreeToRootNode", fields: [treeId], references: [id], onDelete: Cascade)
    childNodes         Node[]              @relation("NodeToNode")
    createdAt          DateTime            @default(now())
  }

  model Session {
    id        String       @id @default(uuid())
    projectId String
    project   Project      @relation(fields: [projectId], references: [id], onDelete: Cascade)
    owner     SessionOwner
    updatedAt DateTime     @updatedAt
    createdAt DateTime     @default(now())
    threads   Thread[]
  }

  enum SessionOwner {
    CODING_AGENT
    EXTERNAL_AGENT
    BACKGROUND_AGENT
  }

  model Thread {
    id        String    @id @default(uuid())
    sessionId String
    session   Session   @relation(fields: [sessionId], references: [id], onDelete: Cascade)
    messages  Message[]
    updatedAt DateTime  @updatedAt
    createdAt DateTime  @default(now())
  }

  model Message {
    id       String      @id @default(uuid())
    threadId String
    thread   Thread      @relation(fields: [threadId], references: [id], onDelete: Cascade)
    content  String
    role     MessageRole
    createdAt DateTime   @default(now())
  }

  enum MessageRole {
    SYSTEM
    HUMAN
    TOOL
    AI
  }

  model Prerequisite {
    id        String   @id @default(uuid())
    nodeId    String
    node      Node     @relation(fields: [nodeId], references: [id], onDelete: Cascade)
    content   String
    status    Status   @default(NOT_STARTED)
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
  }

  model StateOfCompletion {
    id        String   @id @default(uuid())
    nodeId    String
    node      Node     @relation(fields: [nodeId], references: [id], onDelete: Cascade)
    content   String
    status    Status   @default(NOT_STARTED)
    updatedAt DateTime @updatedAt
    createdAt DateTime @default(now())
  }
```

## Traversal Logic

Traversal is demand-driven and reactive. The backend should not precompute a curriculum and then force users through it. Instead, it should listen for demand signals and re-evaluate the graph whenever a meaningful state change appears.

Canonical event flow:
Intent -> Normalize -> Select frontier -> Evaluate blockers/prerequisites -> Emit normalized traversal events -> Persist the new state.

The emitted event vocabulary is deliberately narrow:

- node_updated
- blocker_detected
- step_down
- step_up
- go_around

Behavioral rules:

- Traversal is always relative to the current project/session state.
- A frontier is chosen from unresolved demand plus current blockers.
- A blocker is not a UI hint; it is a persisted domain fact.
- Step-up and step-down transitions must be derivable from the graph, not manually invented.
- Reactive loops should recompute only when input state changes: new demand, updated blocker state, altered completion evidence, or graph mutation.
- The backend should stay deterministic given the same graph and signals.

## SoC Enforcement Rules

- Entities stay pure and do not import adapters, repositories, or HTTP code.
- Applications own business policy and traversal logic.
- Infrastructure owns IO, persistence, and external integrations.
- Controllers and routes translate transport shapes only.
- Prisma models remain in the persistence boundary; they are not referenced directly by domain entities.
- Domain rules for blockers, prerequisites, and completion must not leak into route handlers.
- No renderer-specific assumptions are allowed in backend code.
- Event emission should be performed by application services or infrastructure adapters, never by entities.
- Shared types should describe contracts, not behavior.
- Anything that changes policy should live in applications, not infrastructure.
- Anything that touches the database should remain behind repository interfaces.

## Passive Observation Layer (MCP Signals)
The backend treats MCP (Model Context Protocol) signal streams as a passive, read-only observation channel. It never writes back to the MCP channel and never initiates requests over it.

Signal types consumed from MCP:
- `agent_event` — lifecycle notifications from coding/background agents.
- `context_delta` — incremental context updates emitted by an active agent session.
- `session_ping` — heartbeat signals used to keep session liveness up-to-date.
- `capability_request` — agent declarations of intent that seed the DDRT demand side.

Processing rules:
- MCP signals are received by infrastructure adapters and normalized into internal domain events before being handed to application services.
- Signals must not cross the entity boundary in their raw form.
- Signal normalization is idempotent; duplicate delivery of the same signal must be safe.
- An unrecognized or malformed signal is logged and discarded; it must never cause a traversal failure.
- The observation layer is strictly append-only with respect to signal intake; no signal is ever acknowledged or transformed in-place by the backend.

## Native Renderer and EventTrace
The Native Renderer is the authoritative source of EventTrace records and is the ground truth for ConceptNode resolution. The backend does not unilaterally decide that a node is complete; it waits for a completion EventTrace emitted by the Native Renderer.

ConceptNode resolution rules:
- A ConceptNode is considered resolved when the Native Renderer has emitted a corresponding completion EventTrace for that node in the current session.
- The backend reads EventTrace records through a repository interface; it does not query the renderer directly.
- Partial or in-progress EventTrace records do not count as completion evidence.
- If no EventTrace exists for a node, its resolution state is `NOT_STARTED` by default.
- The backend must not infer resolution from conversational history, MCP signals, or any source other than a committed EventTrace record.
- EventTrace records are immutable once committed; the backend treats them as append-only facts.

Architecture placement:
- `src/infrastructure/` owns the EventTrace repository adapter.
- `src/applications/` owns the policy that reads EventTrace records and decides traversal outcomes.
- `src/entities/` defines the EventTrace domain type via a Zod schema; it never imports the Prisma model.

## Zod Structural Enforcement
All domain boundaries are enforced through Zod schemas at parse time. Runtime type assertions (`as SomeType`) are prohibited where a Zod parse is feasible.

Boundary rules:
- **Internal schemas** (`InternalXxx`) govern data flowing within the application boundary (application ↔ infrastructure).
- **External schemas** (`ExternalXxx`) govern data crossing the transport boundary (HTTP request/response bodies, MCP signal payloads).
- A schema parse failure at any boundary is a hard validation error, not a recoverable condition.
- Parse errors at the HTTP boundary result in a `400` response with a sanitized, field-level error payload — never a raw Zod error object.
- TypeScript types for all domain entities are derived via `z.infer<typeof SomeSchema>`; standalone `interface` declarations for domain types are prohibited.
- Zod refinements and `.transform()` calls that apply business policy belong in `src/entities/`, not in controllers or infrastructure.

## DDRT (Dynamic Demand Resolution Tree)
The Dynamic Demand Resolution Tree (DDRT) is the runtime representation of the learner's current decomposition state within a single traversal cycle.

Structure and lifecycle:
- The DDRT is reconstructed from persisted graph state at the start of each traversal invocation.
- It is not persisted directly; it is derived, used, and discarded within a single traversal cycle.
- DDRT nodes carry: demand weight, blocker list, prerequisite satisfaction status, completion evidence references, and the current GoalContext snapshot.
- The DDRT root corresponds to the project's root `Node` in the graph.

Traversal order:
- When choosing the next transition, the backend evaluates candidate types in priority order: `step_down` is preferred, then `step_up`, then `go_around`. This is a priority ordering, not an emission sequence; more than one type may apply, and the highest-priority applicable type is chosen.
- `step_down`: move to the highest-demand unresolved child node.
- `step_up`: move to the parent when the current subtree is fully resolved or blocked.
- `go_around`: skip the current node and move to the next frontier node when a blocker is unresolvable in the current session.
- Traversal terminates when no frontier node with unmet demand remains.

Demand weighting:
- Demand is computed from GoalContext signals, blocker urgency, and prerequisite depth.
- Demand weights are recalculated on each traversal cycle; they are not cached between cycles.

## GoalContext Propagation
GoalContext is a structured, immutable payload that carries the learner's stated intent through the entire traversal pipeline from session initiation to node resolution.

Propagation rules:
- GoalContext is attached once at session initiation and flows through each traversal step without mutation.
- Application services may read GoalContext to inform demand weighting and frontier selection, but must not modify it.
- GoalContext is passed as an explicit parameter to every traversal use-case; it must not be retrieved from a global or thread-local store.
- A GoalContext snapshot is recorded in the `node_transition` audit log for every state transition, enabling replay and post-hoc analysis.
- If a session has no GoalContext (legacy or anonymous sessions), traversal falls back to uniform demand weighting.

GoalContext shape (Zod-enforced):
- `goalId` — stable identifier for this goal, scoped to the project.
- `intent` — the learner's stated intent as a normalized string.
- `prioritySignals` — ordered list of concept identifiers that the learner has expressed priority for.
- `constraints` — optional hard constraints (time-box, forbidden topics, preferred modality).
- `createdAt` — timestamp of goal declaration; immutable after creation.

## v3.1 Copilot Security and Performance Fixes
The following changes are required across all backend services as part of the v3.1 hardening pass. They apply in addition to, not instead of, the SoC Enforcement Rules above.

### Centralized Error Handling
- All unhandled exceptions must be caught exclusively by the global error middleware in `src/middlewares/`.
- Controllers must not contain `try/catch` blocks that swallow exceptions without re-throwing to the middleware chain.
- Custom application errors must extend a base `AppError` class defined in `src/entities/error.entity.ts` so the middleware can discriminate them by type.
- The global middleware maps `AppError` subtypes to appropriate HTTP status codes; anything not recognized maps to `500`.

### Redacted Diagnostics
- Error responses sent to the client must never include stack traces, internal resource IDs, raw Prisma errors, or any infrastructure detail.
- Diagnostic information (stack, query, context) is emitted only to the server-side logger.
- The sanitized client payload includes only: `error` (a stable code string), `message` (human-readable, safe), and optionally `fields` (for validation errors).
- This rule applies even in non-production environments; diagnostic verbosity is controlled through log level, not through response bodies.

### Cursor-Paginated Thread History
- All queries that retrieve thread messages must use cursor-based pagination.
- Loading an unbounded message list in a single query is prohibited on any code path that serves traversal or agent context assembly.
- The default page size is 50 messages; the maximum page size is 200.
- Repository contracts must expose a `listMessages(threadId, cursor?, limit?)` signature; callers must not bypass this by querying the `Message` table directly.
- Cursors are opaque strings from the caller's perspective; internally they encode the `createdAt` timestamp and `id` of the last seen record.

### Denormalized Ownership Checks
- Project, session, and thread records must each carry a denormalized `userId` field so that authorization can be resolved in a single indexed read without joins.
- Ownership validation must happen before any other query in every request handler; a request that fails ownership validation is rejected with `403` before business logic runs.
- The denormalized `userId` is written at creation time and is immutable; it must not be updated by any mutation path.
- Repository interfaces must expose a `checkOwnership(resourceId, userId)` method that returns a boolean without loading the full entity.

### Fail-Closed Validation
- Any request that fails Zod schema parsing or ownership validation must be rejected immediately with no partial processing.
- The backend must not attempt to proceed with a best-effort interpretation of an invalid payload.
- Fail-closed applies recursively: if a sub-operation within a use-case receives an invalid intermediate value, it must throw rather than degrade gracefully.
- Optional fields that are absent are treated as absent (not coerced to defaults) unless a Zod `.default()` is explicitly declared in the schema.

## v3.1 Backend Implementation Contract

### node_transition Audit Log Schema
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
- `blockerIds` — JSON array of blocker IDs active at transition time.
- `goalContextSnapshot` — JSON snapshot of the GoalContext at transition time.
- `evidenceSnapshot` — JSON snapshot of completion evidence consulted during the transition decision.
- `createdAt` — timestamp, set by the database at insert time.
- `actorId` — the Clerk user ID or agent ID that triggered the transition.

The log row must be sufficient for replay, debugging, and downstream analytics without re-querying mutable application state.

### Performance Notes
- Use `findFirst` when querying by non-unique fields (e.g. filtering by `projectId` or `userId`); `findUnique` is only correct when the filter targets a unique constraint or primary key and will error otherwise.
- Denormalize ownership (see Denormalized Ownership Checks above) to eliminate repeated joins on hot traversal paths.
- Apply cursor pagination to all thread history queries (see Cursor-Paginated Thread History above) so the traversal loop never loads unbounded conversational context.
- These optimizations must be expressed in repository contracts and read models, not embedded inside controller logic.

## v3.1 Backend Implementation Contract

### DDRT traversal planning

- The v3.1 backend should treat DDRT as the traversal engine: collect demand, resolve the current frontier, recurse only when the graph requires it, and persist the trace of each step.
- Keep traversal policy in the application layer. The application should select the next node, but repositories and adapters should only persist state or emit signals.
- The traversal planner should be able to explain why a step-down, step-up, or go-around happened, using blocker state, completion evidence, and current goal context.
- Files that will likely own the work later include the traversal use-case layer, node lifecycle orchestration, event emission adapters, and the read models that expose frontier state.

### GoalContext propagation

- GoalContext should be created at the project/session boundary and carried through every node lifecycle transition.
- The context should include the active goal, scope boundaries, blockers, evidence summaries, and the current frontier reference.
- Every node enter/evaluate/exit path should receive GoalContext explicitly rather than reconstructing it ad hoc.
- The context should be threaded through application commands, persisted snapshots, and event payloads so downstream consumers can replay the same decision path.

### Passive Observation Layer

- The Passive Observation Layer should remain passive: it reads MCP-originated signals, renderer signals, and lifecycle events without making policy decisions itself.
- MCP signal ingestion should normalize external inputs into a signal reader pipeline, then route them into a latent blocker queue when a hard stop is detected.
- The queue should defer promotion until the backend sees evidence that changes the frontier or clears the blocker.
- The observation layer should be the place where noisy inputs are filtered, deduplicated, and tagged with provenance.

### Zod schema enforcement at the LLM boundary

- All LLM-facing inputs and outputs should be validated with Zod before entering or leaving the policy boundary.
- The backend should reject partial, extra, or malformed shapes instead of silently coercing them into domain state.
- Schema validation should sit between application orchestration and any LLM adapter so the domain always sees predictable data.
- When schemas evolve, the contract should be updated before the execution path is widened.

### EventTrace and Native Renderer hooks

- EventTrace should be treated as the canonical stream for replayable traversal history, decision justification, and renderer synchronization.
- Native Renderer hooks should subscribe to emitted traversal events rather than inferring state from internal database reads.
- Each event should preserve enough metadata to reconstruct the active node, trigger type, and goal context at the moment of transition.
- The backend should emit renderer-ready events without coupling itself to presentation logic.

### node_transition audit log schema

- The node_transition log should record the immutable transition history for every graph movement.
- Suggested fields: transitionId, projectId, sessionId, threadId, fromNodeId, toNodeId, transitionType, triggerSource, blockerIds, goalContextSnapshot, evidenceSnapshot, createdAt, and actor/source metadata.
- The audit row should be append-only and should not be used as a mutable working state table.
- The log should be sufficient for replay, debugging, and downstream analytics without re-querying mutable application state.

### Performance notes

- Prefer findFirst over findUnique when the runtime path is selecting the first qualifying record from a non-unique filter set.
- Denormalize ownership where it removes repeated joins on hot paths, especially when resolving project/session/thread ownership during traversal.
- Paginate thread history so the traversal loop does not load unbounded conversational history when only the active window is needed.
- These optimizations should be reflected in repository contracts and read models, not hidden inside controllers.
