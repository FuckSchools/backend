import type { IRepository } from '@/shared/domain/interface/repository.interface.js';
import type { NodeEntity, RootNodeEntity } from '../entity/node.entity.js';
import { type ResultAsync } from 'neverthrow';

export interface IRootNodeRepository extends IRepository<RootNodeEntity> {
  getByProjectId(
    projectId: string,
  ): Promise<ResultAsync<RootNodeEntity | null, string>>;
  getChildNodes(nodeId: string): Promise<ResultAsync<NodeEntity[], string>>;
}

export interface INodeRepository extends IRepository<NodeEntity> {
  getById(id: string): Promise<ResultAsync<NodeEntity | null, string>>;
}
