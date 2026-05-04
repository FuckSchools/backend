import type { IRepository } from '@/shared/domain/interface/repository.interface.js';
import type { NodeEntity, RootNodeEntity } from '../entity/node.entity.js';
export interface IRootNodeRepository extends IRepository<RootNodeEntity> {
  getByProjectId(projectId: string): Promise<RootNodeEntity | null>;
  getChildNodes(nodeId: string): Promise<NodeEntity[]>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface INodeRepository extends IRepository<NodeEntity> {}
