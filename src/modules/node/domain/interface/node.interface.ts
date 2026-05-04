import type { IRepository } from '@/shared/domain/interface/repository.interface.js';
import type { NodeEntity, RootNodeEntity } from '../entity/node.entity.js';
import type { NodeContextEntity } from '../entity/nodeContext.entity.js';
export interface IRootNodeRepository extends IRepository<RootNodeEntity> {
  getByProjectId(projectId: string): Promise<RootNodeEntity | null>;
  getChildNodes(nodeId: string): Promise<NodeEntity[]>;
  getNodeContextByNodeId(nodeId: string): Promise<NodeContextEntity | null>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface INodeRepository extends IRepository<NodeEntity> {}
