import type { NodeContextEntity } from '@/node/domain/entity/nodeContext.entity.js';
import type { INodeContext } from '@/node/domain/interface/nodeContext.interface.js';

export class NodeContextRepository implements INodeContext {
  getByNodeId(nodeId: string): Promise<NodeContextEntity | null> {
    throw new Error('Method not implemented.');
  }
  save(data: NodeContextEntity): Promise<void> {
    throw new Error('Method not implemented.');
  }
  getById(id: string): Promise<NodeContextEntity | null> {
    throw new Error('Method not implemented.');
  }
}
