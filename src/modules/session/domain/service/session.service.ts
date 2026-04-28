import { BaseService } from '@/shared/domain/service/base.service.js';
import {
  sessionEntity,
  sessionProviderEntity,
  type Session,
  type SessionProvider,
} from '../entity/session.entity.js';
import type { ISessionRepository } from '../interface/session.interface.js';

export class SessionService extends BaseService<Session, SessionProvider> {
  constructor(repository: ISessionRepository) {
    super(repository, sessionEntity.extend(sessionProviderEntity.shape));
  }
}
