import {
  assertStatusTransition,
  type NodeStatus,
} from '../value-object/nodeStatus.js';
import type { INodeRepository, IRootNodeRepository } from '../interface/node.interface.js';
import type { Node, NodeFull, RootNode } from '../entity/node.entity.js';

/**
 * NodeStatusTransitionService is a stateless domain service responsible for
 * guarding and applying valid status transitions on nodes. It enforces the
 * state machine defined in NodeStatus and delegates persistence to the
 * repository.
 */
export const transitionNodeStatus =
  (repository: INodeRepository) =>
  async (
    node: NodeFull,
    nextStatus: NodeStatus,
    updates: Omit<Node, 'status'>,
  ): Promise<void> => {
    assertStatusTransition(node.status, nextStatus);
    await repository.update(node.id, { ...updates, status: nextStatus });
  };

export const transitionRootNodeStatus =
  (repository: IRootNodeRepository) =>
  async (
    rootNode: RootNode & { id: string },
    nextStatus: NodeStatus,
    updates: Omit<RootNode, 'status'>,
  ): Promise<void> => {
    assertStatusTransition(rootNode.status, nextStatus);
    await repository.update(rootNode.id, { ...updates, status: nextStatus });
  };
