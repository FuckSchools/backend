import type {
  NodeContextFull,
  NodeContext,
} from '../schema/nodeContext.schema.js';

export interface INodeContextRepository {
  create(nodeId: string, params: NodeContext): Promise<NodeContextFull>;

  getByNodeId(nodeId: string): Promise<NodeContextFull | null>;

  update(nodeContextId: string, params: NodeContext): Promise<NodeContextFull>;
}
