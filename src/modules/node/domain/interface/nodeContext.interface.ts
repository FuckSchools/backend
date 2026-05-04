import type { IRepository } from '@/shared/domain/interface/repository.interface.js';
import type { NodeContextEntity } from '../entity/nodeContext.entity.js';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface INodeContext extends IRepository<NodeContextEntity> {}
