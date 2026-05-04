import type { IRepository } from '@/shared/domain/interface/repository.interface.js';
import type { NodeContextEntity } from '../entity/nodeContext.entity.js';
import { type ResultAsync } from 'neverthrow';

export interface INodeContext extends IRepository<NodeContextEntity> {
  getByNodeId(
    nodeId: string,
  ): Promise<ResultAsync<NodeContextEntity | null, string>>;
}
