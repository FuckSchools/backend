import type { IRepository } from '@/shared/domain/interface/repository.interface.js';
import type { NodeContextEntity } from '../entity/nodeContext.entity.js';

export interface INodeContext extends IRepository<NodeContextEntity> {}
