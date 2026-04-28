import type { IRepository } from '@/modules/shared/domain/interface/repository.interface.js';
import type { Session, SessionProvider } from '../entity/session.entity.js';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ISessionRepository extends IRepository<
  Session,
  SessionProvider
> {}
