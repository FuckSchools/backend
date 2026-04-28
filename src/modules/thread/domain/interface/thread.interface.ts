import type { IRepository } from '@/shared/domain/interface/repository.interface.js';
import type { Thread, ThreadProvider } from '../entity/thread.entity.js';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IThreadRepository extends IRepository<
  Thread,
  ThreadProvider
> {}
