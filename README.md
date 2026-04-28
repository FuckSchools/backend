# FuckSchools Backend

## Purpose

The backend is the execution layer for the FuckSchools graph. It owns the canonical domain model, evaluates traversal signals, records blockers, persists state, and emits normalized events for the studio layer. The backend is intentionally narrow: it should transform state, not render it, and it should enforce policy, not improvise UI behavior.

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
