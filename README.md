# FuckSchools Backend

## Purpose
The backend is the execution layer for the FuckSchools graph. It owns the canonical domain model, evaluates traversal signals, records blockers, persists state, and emits normalized events for the studio layer. The backend is intentionally narrow: it should transform state, not render it, and it should enforce policy, not improvise UI behavior.

## Clean Architecture Module Map
The repository already reflects a layered boundary model that maps cleanly onto the domain graph:

- src/entities/
  - Pure domain primitives and state carriers.
  - node.entity.ts, tree.entity.ts, project.entity.ts, session.entity.ts, thread.entity.ts, message.entity.ts, prerequisite.entity.ts, soc.entity.ts, error.entity.ts.
  - No transport code, no Prisma imports, no HTTP concerns.

- src/applications/
  - Use-case orchestration and policy execution.
  - Traversal planning, signal normalization, blocker registration, state transitions, and event emission.
  - This layer is where demand becomes an actionable operation.

- src/controllers/
  - Transport adapters that translate HTTP/request payloads into application commands.
  - Controllers should only validate shape, call use cases, and format results.

- src/routes/
  - Endpoint wiring and request surface.
  - Routes are intentionally thin and should never contain traversal policy.

- src/DI/
  - Dependency wiring and concrete implementation registration.
  - This is where repositories, emitters, and services are composed.

- src/infrastructure/
  - External systems, persistence adapters, emitters, and service integrations.
  - Prisma repositories, database access, queue/event adapters, and any IO boundary code belong here.

- src/interfaces/
  - Repository contracts and cross-layer interface definitions.

- src/middlewares/
  - Auth, error handling, request enrichment, and request lifecycle concerns.

- src/config/
  - Environment, constants, and runtime configuration.

- src/types/
  - Shared TypeScript types and DTO-level glue.

## Prisma Schema v3.0
The Prisma layout is split across prisma/schema.prisma and prisma/models/*.prisma. The v3.0 shape centers on graph traversal, project/session tracking, and message persistence.

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
