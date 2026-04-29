import type { IRepository } from '@/shared/domain/interface/repository.interface.js';
import type {
  NodeContext,
  NodeContextProvider,
} from '../entity/nodeContext.entity.js';

export interface INodeContextRepository extends IRepository<
  NodeContext,
  NodeContextProvider
> {
  update(
    id: string,
    pathFromRoot: string[],
    constraints: string[],
    successSignals: string[],
    intentSummary?: string,
    rootNodeId?: string,
  ): Promise<NodeContext & NodeContextProvider>;
}
