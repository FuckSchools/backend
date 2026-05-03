import type { RootNodeAggregate } from '@/node/domain/aggregate/rootNode.aggregate.js';
import type {
  RootNodeEntity,
  NodeEntity,
} from '@/node/domain/entity/node.entity.js';
import type { IRootNodeRepository } from '@/node/domain/interface/node.interface.js';

export class RootNodeRepository implements IRootNodeRepository {
  createRootNodeByProjectId(
    rootNodeEntity: RootNodeEntity,
    projectId: string,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  getByProjectId(projectId: string): Promise<RootNodeAggregate | null> {
    throw new Error('Method not implemented.');
  }
  createNodeByParentId(
    nodeEntity: NodeEntity,
    parentId: string,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  save(data: RootNodeEntity): Promise<void> {
    throw new Error('Method not implemented.');
  }
  getById(id: string): Promise<RootNodeEntity | null> {
    throw new Error('Method not implemented.');
  }
}
