import type {
  Node,
  NodeFull,
  RootNode,
  RootNodeFull,
} from '../entity/node.entity.js';

export interface IRootNodeRepository {
  create(projectId: string, params: RootNode): Promise<RootNodeFull>;

  getByProjectId(projectId: string): Promise<RootNodeFull | null>;

  update(rootNodeId: string, params: RootNode): Promise<RootNodeFull>;
}

export interface INodeRepository {
  create(parentNodeId: string, params: Node): Promise<NodeFull>;

  getChildren(parentNodeId: string): Promise<Array<NodeFull>>;

  update(nodeId: string, params: Node): Promise<NodeFull>;
}
