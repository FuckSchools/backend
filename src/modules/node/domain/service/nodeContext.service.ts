import { BaseService } from '@/shared/domain/service/base.service.js';
import {
  nodeContextEntity,
  nodeContextProviderEntity,
  type NodeContext,
  type NodeContextProvider,
} from '../entity/nodeContext.entity.js';
import type { INodeContextRepository } from '../interface/nodeContext.interface.js';

export class NodeContextService extends BaseService<
  NodeContext,
  NodeContextProvider
> {
  data: (NodeContext & NodeContextProvider) | undefined;
  constructor(
    repository: INodeContextRepository,
    protected nodeId: string,
  ) {
    super(
      repository,
      nodeContextEntity.extend(nodeContextProviderEntity.shape),
    );
  }

  public async saveNodeContext(params: NodeContext) {
    const result = await this.create(params, this.nodeId);
    this.data = result;
    return result;
  }
}
