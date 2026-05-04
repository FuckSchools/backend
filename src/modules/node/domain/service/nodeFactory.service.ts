import {
  DuplicatedCreationError,
  NotFoundError,
} from '@/shared/domain/interface/error.interface.js';
import { NodeAggregate } from '../aggregate/node.aggregate.js';
import { RootNodeAggregate } from '../aggregate/rootNode.aggregate.js';
import type { NodeEntity, RootNodeEntity } from '../entity/node.entity.js';

export class NodeFactory {
  private _nodeAggregateMap: Map<string, NodeAggregate> = new Map();
  private _rootNodeAggregate: RootNodeAggregate;
  constructor(rootNodeEntity: RootNodeEntity) {
    this._rootNodeAggregate = new RootNodeAggregate(rootNodeEntity);
  }

  public get rootNodeAggregate(): RootNodeAggregate {
    return this._rootNodeAggregate;
  }

  public newNodeAggregateByEntity(nodeEntity: NodeEntity): NodeAggregate {
    if (this._nodeAggregateMap.has(nodeEntity.id)) {
      throw new DuplicatedCreationError(
        `Node aggregate with id ${nodeEntity.id} already exists`,
      );
    }
    const nodeAggregate = new NodeAggregate(nodeEntity);
    this._nodeAggregateMap.set(nodeEntity.id, nodeAggregate);
    return nodeAggregate;
  }

  public getNodeAggregateById(nodeId: string): NodeAggregate {
    const nodeAggregate = this._nodeAggregateMap.get(nodeId);
    if (!nodeAggregate) {
      throw new NotFoundError(`Node aggregate with id ${nodeId} not found`);
    }
    return nodeAggregate;
  }

  private nodeOutput(nodeId: string): ReturnType<NodeEntity['toJSON']> & {
    childNodes: ReturnType<NodeEntity['toJSON']>[];
  } {
    const nodeAggregate = this.getNodeAggregateById(nodeId);
    const current = nodeAggregate.toJSON();
    const childNodes = nodeAggregate.childNodes.map((child) =>
      this.nodeOutput(child),
    );
    return { ...current, childNodes };
  }

  public printTree(): ReturnType<RootNodeEntity['toJSON']> & {
    childNodes: ReturnType<NodeEntity['toJSON']>[];
  } {
    const rootNodeOutput = this._rootNodeAggregate.toJSON();
    const childNodesOutput = this._rootNodeAggregate.nodes.map((node) =>
      this.nodeOutput(node),
    );
    return { ...rootNodeOutput, childNodes: childNodesOutput };
  }
}
