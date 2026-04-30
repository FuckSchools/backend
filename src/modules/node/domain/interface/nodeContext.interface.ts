import type { NodeContext } from 'prisma/client.js';
import type { NodeContextFull } from '../entity/nodeContext.entity.js';

export interface INodeContextRepository {
  create(nodeId: string, params: NodeContext): Promise<NodeContextFull>;

  getByNodeId(nodeId: string): Promise<NodeContextFull | null>;

  update(nodeContextId: string, params: NodeContext): Promise<NodeContextFull>;
}
