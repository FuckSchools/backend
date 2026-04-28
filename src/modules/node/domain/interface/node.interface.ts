import type {
  Node,
  NodeProvider,
  RootNode,
  RootNodeProvider,
} from '../entity/node.entity.js';
import type { IRepository } from '@/shared/domain/interface/repository.interface.js';

export interface INodeRepository extends IRepository<Node, NodeProvider> {
  createRootNode(
    params: RootNode,
    id: string,
  ): Promise<RootNode & RootNodeProvider>;
}
