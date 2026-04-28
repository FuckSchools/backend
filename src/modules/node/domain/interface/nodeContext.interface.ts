import type { IRepository } from '@/modules/shared/domain/interface/repository.interface.js';
import type {
  NodeContext,
  NodeContextProvider,
} from '../entity/nodeContext.entity.js';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface INodeContextRepository extends IRepository<
  NodeContext,
  NodeContextProvider
> {}
