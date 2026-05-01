import type {
  Node,
  NodeFull,
  RootNode,
  RootNodeFull,
} from '../entity/node.entity.js';
import type { NodeContextFull } from '../entity/nodeContext.entity.js';
import type { INodeContextRepository } from './nodeContext.interface.js';

export interface IRootNodeRepository {
  create(projectId: string, params: RootNode): Promise<RootNodeFull>;

  getByProjectId(projectId: string): Promise<RootNodeFull | null>;

  update(rootNodeId: string, params: RootNode): Promise<RootNodeFull>;

  getNodeRepository(): INodeRepository;
}

export interface INodeRepository {
  create(parentNodeId: string, params: Node): Promise<NodeFull>;

  getChildren(parentNodeId: string): Promise<Array<NodeFull>>;

  update(nodeId: string, params: Node): Promise<NodeFull>;

  getNodeContextRepository(): INodeContextRepository;
}

export interface INodePersistentService<T> {
  data: T;
  context?: NodeContextFull;
  next: INodePersistentService<NodeFull>[];
}
