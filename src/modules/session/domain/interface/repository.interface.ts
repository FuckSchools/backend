import type { IRepository } from '@/shared/domain/interface/repository.interface.js';
import type { SessionEntity } from '../entity/session.entity.js';
import type { ThreadEntity } from '../entity/thread.entity.js';
import type { MessageEntity } from '../entity/message.entity.js';
import type { SessionAggregate } from '../aggregate/sessionAggregate.js';
import type { ThreadAggregate } from '../aggregate/threadAggregate.js';
import { type ResultAsync } from 'neverthrow';

export interface ISessionRepository extends IRepository<SessionEntity> {
  getByProjectId(
    projectId: string,
  ): Promise<
    ResultAsync<
      {
        sessionAggregate: SessionAggregate;
        threadAggregates: ThreadAggregate[];
      }[],
      string
    >
  >;
  createThreadInSession(
    sessionId: string,
    threadEntity: ThreadEntity,
  ): Promise<ResultAsync<void, string>>;
  createMessageInThread(
    threadId: string,
    messageEntity: MessageEntity,
  ): Promise<ResultAsync<void, string>>;
}
