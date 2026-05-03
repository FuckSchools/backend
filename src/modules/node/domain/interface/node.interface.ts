import type { IRepository } from '@/shared/domain/interface/repository.interface.js';
import type { NodeEntity, RootNodeEntity } from '../entity/node.entity.js';
import type { RootNodeAggregate } from '../aggregate/rootNode.aggregate.js';

export interface IRootNodeRepository extends IRepository<RootNodeEntity> {
  createRootNodeByProjectId(
    rootNodeEntity: RootNodeEntity,
    projectId: string,
  ): Promise<void>;
  getByProjectId(projectId: string): Promise<RootNodeAggregate | null>;
  createNodeByParentId(nodeEntity: NodeEntity, parentId: string): Promise<void>;
}
