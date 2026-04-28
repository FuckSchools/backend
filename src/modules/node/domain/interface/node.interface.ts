import type {
  Node,
  NodeProvider,
  RootNode,
  RootNodeProvider,
} from '../entity/node.entity.js';
import type { IRepository } from '@/shared/domain/interface/repository.interface.js';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface INodeRepository extends IRepository<Node, NodeProvider> {
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IRootNodeRepository extends IRepository<RootNode, RootNodeProvider> {}