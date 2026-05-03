import type { IRepository } from '@/shared/domain/interface/repository.interface.js';
import type { SessionEntity } from '../entity/session.entity.js';
import type { ThreadEntity } from '../entity/thread.entity.js';
import type { MessageEntity } from '../entity/message.entity.js';
import type { SessionAggregate } from '../aggregate/sessionAggregate.js';
import type { ThreadAggregate } from '../aggregate/threadAggregate.js';

export enum SessionIncludeOption {
  Threads = 'threads',
  Messages = 'threads.messages',
}

export interface ISessionRepository extends IRepository<SessionEntity> {
  getByProjectId(
    projectId: string,
    include: keyof typeof SessionIncludeOption,
  ): Promise<
    {
      sessionAggregate: SessionAggregate;
      threadAggregates: ThreadAggregate[];
    }[]
  >;
  getByProjectId(projectId: string): Promise<SessionEntity[]>;
  createThreadInSession(
    sessionId: string,
    threadEntity: ThreadEntity,
  ): Promise<void>;
  createMessageInThread(
    threadId: string,
    messageEntity: MessageEntity,
  ): Promise<void>;
}
