import type {
  Node,
  NodeFull,
  RootNode,
  RootNodeFull,
} from '../entity/node.entity.js';
import type { NodeContextFull } from '../entity/nodeContext.entity.js';
import type { INodeContextRepository } from './nodeContext.interface.js';

export type NodeWithContext = NodeFull & { context?: NodeContextFull };

export interface IRootNodeRepository {
  create(projectId: string, params: RootNode): Promise<RootNodeFull>;

  getByProjectId(projectId: string): Promise<RootNodeFull | null>;

  update(rootNodeId: string, params: RootNode): Promise<RootNodeFull>;

  getNodeRepository(): INodeRepository;
}

export interface INodeRepository {
  create(parentNodeId: string, params: Node): Promise<NodeFull>;

  getChildren(parentNodeId: string): Promise<Array<NodeWithContext>>;

  update(nodeId: string, params: Node): Promise<NodeFull>;

  getContextRepository(): INodeContextRepository;
}

export interface IRootNodePersistentService {
  appendNext(next: INodePersistentService): void;
  next(): INodePersistentService[];
  output(): RootNodeFull & {
    childNodes: Array<ReturnType<INodePersistentService['output']>>;
  };
}

export interface INodePersistentService {
  saveContext(context: NodeContextFull): void;
  getContext(): NodeContextFull | undefined;
  appendNext(next: INodePersistentService): void;
  next(): INodePersistentService[];
  output(): NodeFull & {
    childNodes: Array<ReturnType<INodePersistentService['output']>>;
    context?: NodeContextFull;
  };
}
