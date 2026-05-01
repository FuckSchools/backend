import { BaseService } from '@/shared/domain/service/base.service.js';
import type {
  NodeContext,
  NodeContextFull,
} from '../entity/nodeContext.entity.js';
import type { INodeContextRepository } from '../interface/nodeContext.interface.js';

export class NodeContextService extends BaseService<
  NodeContext,
  NodeContextFull
> {
  constructor(
    protected repository: INodeContextRepository,
    nodeId: string,
  ) {
    super();
    this.setFormerEntityId(nodeId);
  }

  public async getNodeContext(): Promise<boolean> {
    const nodeId = this.getFormerEntityId();
    if (!nodeId) {
      return false;
    }
    const nodeContext = await this.repository.getByNodeId(nodeId);
    if (!nodeContext) {
      return false;
    }
    this.setFullEntity(nodeContext);
    return true;
  }

  public async createNodeContext(): Promise<boolean> {
    const nodeId = this.getFormerEntityId();
    const nodeContext = this.getEntity();
    if (!nodeId || !nodeContext) {
      return false;
    }
    const newNodeContext = await this.repository.create(nodeId, nodeContext);
    this.setFullEntity(newNodeContext);
    return true;
  }

  public async updateNodeContext(): Promise<boolean> {
    const nodeContextId = this.getFullEntity()?.id;
    const nodeContext = this.getEntity();
    if (!nodeContextId || !nodeContext) {
      return false;
    }
    const updatedNodeContext = await this.repository.update(
      nodeContextId,
      nodeContext,
    );
    this.setFullEntity(updatedNodeContext);
    return true;
  }
}
