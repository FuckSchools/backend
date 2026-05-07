# Event Storming — FuckSchools v3.1

Backlink: [Backend v3.1 implementation contract](../../README.md#v31-backend-implementation-contract)

## Scope

This note maps the current backend state to the v3.1 traversal contract. It focuses on the lifecycle around Node, NodeContext, and the planned append-only NodeTransition audit log.

## Current codebase baseline

Persisted today:
- Project
- Session
- Thread
- Message
- Node
- NodeContext

Current node lifecycle implementation:
- `TreeHandler` rehydrates the graph from persisted `Node` and `NodeContext` records.
- `NodeFactory` and `NodeHandler` build the in-memory tree by stepping down into child nodes.
- `NodeRepository` and `NodeContextRepository` persist the current node shape.
- `Node.status`, `Node.blocker`, `Node.depth`, `Node.parentId`, `Node.projectId`, and `Node.context` are the state fields that move during traversal.

Not yet persisted in source:
- structured GoalContext entity
- EventTrace model / repository
- NodeTransition append-only audit log
- explicit traversal command handlers for goal refinement, friction recording, and go-around routing

## Domain event map

### 1) ProjectSeeded / RootNodeCreated

Command(s):
- CreateProject
- createRootNode

Domain event(s):
- ProjectSeeded
- NodeCreated (root)
- TraversalRootInitialized

Resulting state changes:
- `Project.rootNode` is attached to the project.
- Root `Node` is inserted with `projectId`, `depth = 0`, `status = NOT_STARTED`, and a root goal.
- Root `NodeContext` is created with a root path and initial intent summary.
- In the v3.1 target model, a NodeTransition row is written with `transitionType = initial`.

Current codebase status:
- Root node creation and root rehydration are implemented.
- NodeTransition is not yet implemented.

### 2) GoalRefined

Command(s):
- RefineGoal
- UpdateThreadGoals
- UpdateNodeContext

Domain event(s):
- GoalRefined
- GoalContextUpdated

Resulting state changes:
- `Thread.goals` is updated with the normalized goal string.
- `NodeContext.intentSummary`, `NodeContext.constraints`, and `NodeContext.successSignals` are updated to match the refined intent.
- The node itself usually keeps the same identity; the meaning of the current work becomes sharper rather than being replaced.
- In the v3.1 target model, `goalContextSnapshot` is appended to the NodeTransition record so the refinement can be replayed later.

Current codebase status:
- `Thread.goals` and `NodeContext` already exist.
- A structured GoalContext entity is still a v3.1 contract.

### 3) FrictionDetected

Command(s):
- RecordBlocker
- EvaluateTraversalSignal
- NormalizeMcpSignal

Domain event(s):
- FrictionDetected
- BlockerRecorded
- TraversalInterrupted

Resulting state changes:
- `Node.blocker` is populated or expanded.
- `Node.status` may move from `NOT_STARTED` or `IN_PROGRESS` toward `FAILED` when the blocker cannot be cleared immediately.
- `NodeContext.constraints` can gain a new constraint or friction note.
- In the v3.1 target model, the NodeTransition record stores `blockerIds` and `evidenceSnapshot` for replay and analytics.

Current codebase status:
- The blocker field exists on `Node`.
- A dedicated friction event stream is not yet implemented.

### 4) NodeCreated

Command(s):
- CreateNode
- StepDown
- SpawnChildNode

Domain event(s):
- NodeCreated
- ChildNodeLinked
- TraversalAdvanced

Resulting state changes:
- A child `Node` is inserted with `parentId` pointing at the current node.
- `Node.depth` increments relative to the parent.
- `Node.type` is set to `BUILDING` or `CONCEPT`.
- `Node.status` begins at `NOT_STARTED`.
- `NodeContext.pathFromRoot` is extended to include the new branch.
- In the v3.1 target model, a NodeTransition row records `fromNodeId`, `toNodeId`, and `transitionType = step_down`.

Current codebase status:
- Child-node creation and child aggregation are implemented through the current tree service and node handler.
- The audit log is still missing.

### 5) PathBranched

Command(s):
- BranchPath
- CreateAlternativeChild
- ChooseNextFrontier

Domain event(s):
- PathBranched
- AlternativePathOpened
- FrontierRecomputed

Resulting state changes:
- Multiple child nodes may be attached to the same parent.
- Each branch gets its own `NodeContext.pathFromRoot` entry, preserving the route that produced it.
- `Node.status` on the parent does not need to change just because the path split; the branching decision is captured in the traversal history.
- In the v3.1 target model, NodeTransition can represent each branch with distinct `toNodeId` values and a shared `fromNodeId`.

Current codebase status:
- The in-memory tree builder can add multiple children, but the branching policy is not yet explicit.

### 6) NodeResolved

Command(s):
- CommitCompletionEventTrace
- MarkNodeComplete
- CloseResolvedPath

Domain event(s):
- NodeResolved
- CompletionVerified
- PathClosed

Resulting state changes:
- `Node.status` moves to `COMPLETED`.
- If the resolved node is the root, the project traversal can terminate.
- The backend should only accept completion when the Native Renderer has emitted the matching EventTrace.
- In the v3.1 target model, a terminal NodeTransition row can close the traversal session.

Current codebase status:
- EventTrace-based completion is specified but not yet present in source.

### 7) GoAroundChosen

Command(s):
- RerouteAroundBlocker
- SkipBlockedNode
- SelectAlternateFrontier

Domain event(s):
- PathBranched
- GoAroundChosen
- FrontierSkipped

Resulting state changes:
- The blocked node remains as a historical fact, but traversal moves to another frontier node.
- `Node.status` may remain `FAILED` or stay `IN_PROGRESS` depending on policy.
- The NodeTransition record captures `transitionType = go_around` and keeps the blocker evidence attached.

Current codebase status:
- The traversal contract defines go-around behavior; the current repository does not yet persist it explicitly.

## Model-level summary

### Node

The Node model is the mutable domain object for traversal state.

Primary state fields affected by the events above:
- `status` — lifecycle state: `NOT_STARTED` → `IN_PROGRESS` → `COMPLETED` / `FAILED`
- `type` — `BUILDING` or `CONCEPT`
- `goal` — current work definition for the node
- `blocker` — friction text or blocker summary
- `depth` — tree depth from the project root
- `parentId` — graph parent for child creation and branching
- `projectId` — only present on the root node
- `context` — one-to-one traversal metadata in `NodeContext`

### NodeTransition

The NodeTransition model is the target append-only audit layer for replay and analytics.

Required state captured per transition:
- `transitionId`
- `projectId`
- `sessionId`
- `threadId`
- `fromNodeId`
- `toNodeId`
- `transitionType`
- `triggerSource`
- `blockerIds`
- `goalContextSnapshot`
- `evidenceSnapshot`
- `actorId`
- `createdAt`

Interpretation:
- `initial` = first placement of the traversal root
- `step_down` = drill deeper into a child node
- `step_up` = return to a parent node
- `go_around` = bypass a blocked node and continue elsewhere
- `terminal` = project root fully resolved and traversal session closes

## Diagram summary

Use this as the basis for a visual event-storming diagram:

1. Left lane: user, agent, or MCP signal enters with an intent or friction signal.
2. Command lane: CreateProject, RefineGoal, CreateNode, RecordBlocker, RerouteAroundBlocker, MarkNodeComplete.
3. Domain event lane: GoalRefined, FrictionDetected, NodeCreated, PathBranched, GoAroundChosen, NodeResolved.
4. State lane: Node status, blocker, depth, parentId, and NodeContext path/intent fields change after each event.
5. Audit lane: NodeTransition stores every movement as an append-only fact with snapshots.
6. Completion lane: EventTrace is the authority for ConceptNode resolution and terminal closure.
