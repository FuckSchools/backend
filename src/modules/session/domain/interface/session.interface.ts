import type { Session, SessionFull } from '../entity/session.entity.js';
import type { IMessageRepository } from './message.interface.js';
import type { IThreadRepository } from './thread.interface.js';

export interface ISessionRepository
  extends IMessageRepository, IThreadRepository {
  createSession(projectId: string, params: Session): Promise<SessionFull>;
  getSessionsByProjectId(projectId: string): Promise<Array<SessionFull>>;
  getSessionById(sessionId: string): Promise<SessionFull | null>;
}
