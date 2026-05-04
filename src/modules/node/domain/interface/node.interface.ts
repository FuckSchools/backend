import type { IRepository } from '@/shared/domain/interface/repository.interface.js';
import type { NodeEntity, RootNodeEntity } from '../entity/node.entity.js';
import type { NodeContextEntity } from '../entity/nodeContext.entity.js';
export interface IRootNodeRepository extends IRepository<RootNodeEntity> {
  getByProjectId(projectId: string): Promise<RootNodeEntity | null>;
  getChildNodes(nodeId: string): Promise<NodeEntity[]>;
  save<T extends RootNodeEntity | NodeEntity>(data: T): Promise<void>;
}
export interface INodeRepository extends IRepository<NodeEntity> {
  getNodeContextByNodeId(nodeId: string): Promise<NodeContextEntity | null>;
  getChildNodes(nodeId: string): Promise<NodeEntity[]>;
}
