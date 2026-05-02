import { threadEntity } from '../domain/entity/thread.entity.js';
import { messageEntity } from '../domain/entity/message.entity.js';
import type { ISessionRepository } from '../domain/interface/session.interface.js';
import { ThreadService } from '../domain/service/session.service.js';
import { MessageService } from '../domain/service/session.service.js';
import type { ThreadFull } from '../domain/entity/thread.entity.js';
import type { MessageFull } from '../domain/entity/message.entity.js';

export const createThread =
  (repository: ISessionRepository) =>
  async (sessionId: string, goalsRaw: unknown): Promise<ThreadFull> => {
    const params = threadEntity.parse({ goals: goalsRaw });
    const service = new ThreadService(repository, sessionId);
    service.setEntity(params);
    const created = await service.createThread();
    if (!created) {
      throw new Error('Failed to create thread');
    }
    const full = service.getFullEntity();
    if (!full) {
      throw new Error('Thread not found after creation');
    }
    return full;
  };

export const createMessage =
  (repository: ISessionRepository) =>
  async (
    threadId: string,
    roleRaw: unknown,
    contentRaw: unknown,
  ): Promise<MessageFull> => {
    const params = messageEntity.parse({ role: roleRaw, content: contentRaw });
    const service = new MessageService(repository, threadId);
    service.setEntity(params);
    const created = await service.createMessage();
    if (!created) {
      throw new Error('Failed to create message');
    }
    const full = service.getFullEntity();
    if (!full) {
      throw new Error('Message not found after creation');
    }
    return full;
  };

export const getMessagesByThread =
  (repository: ISessionRepository) =>
  async (threadId: string): Promise<MessageFull[]> => {
    return repository.getMessagesByThreadId(threadId);
  };
