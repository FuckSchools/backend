import { BaseService } from '@/shared/domain/service/base.service.js';
import type { Session, SessionFull } from '../entity/session.entity.js';
import type { ISessionRepository } from '../interface/session.interface.js';
import type { Thread, ThreadFull } from '../entity/thread.entity.js';
import type { Message, MessageFull } from '../entity/message.entity.js';

export class MessageService extends BaseService<Message, MessageFull> {
  constructor(
    protected readonly repository: ISessionRepository,
    protected readonly threadId: string,
  ) {
    super();
  }

  public async createMessage(): Promise<boolean> {
    const entityData = this.getEntity();
    if (!entityData) {
      return false;
    }
    const newMessage = await this.repository.createMessage(
      this.threadId,
      entityData,
    );
    this.setFullEntity(newMessage);
    return true;
  }

  public async acquireMessageById(messageId: string): Promise<boolean> {
    const message = await this.repository.getMessageById(messageId);
    if (message && message.threadId === this.threadId) {
      this.setFullEntity(message);
      return true;
    }
    return false;
  }
}

export class ThreadService extends BaseService<Thread, ThreadFull> {
  constructor(
    protected readonly repository: ISessionRepository,
    protected readonly sessionId: string,
  ) {
    super();
  }

  public async createThread(): Promise<boolean> {
    const entityData = this.getEntity();
    if (!entityData) {
      return false;
    }
    const newThread = await this.repository.createThread(
      this.sessionId,
      entityData,
    );
    this.setFullEntity(newThread);
    return true;
  }

  public async acquireThreadById(threadId: string): Promise<boolean> {
    const thread = await this.repository.getThreadById(threadId);
    if (thread && thread.sessionId === this.sessionId) {
      this.setFullEntity(thread);
      return true;
    }
    return false;
  }

  public newMessageService(): MessageService {
    const id = this.getFullEntity()?.id;
    if (!id) {
      throw new Error('Thread ID is required to create MessageService');
    }
    return new MessageService(this.repository, id);
  }
}

export class SessionService extends BaseService<Session, SessionFull> {
  constructor(
    protected readonly repository: ISessionRepository,
    protected readonly projectId: string,
  ) {
    super();
  }

  public async createSession(): Promise<boolean> {
    const entityData = this.getEntity();
    if (!entityData) {
      return false;
    }
    const newSession = await this.repository.createSession(
      this.projectId,
      entityData,
    );
    this.setFullEntity(newSession);
    return true;
  }

  public async acquireSessionById(sessionId: string): Promise<boolean> {
    const session = await this.repository.getSessionById(sessionId);
    if (session && session.projectId === this.projectId) {
      this.setFullEntity(session);
      return true;
    }
    return false;
  }

  public newThreadService(): ThreadService {
    const id = this.getFullEntity()?.id;
    if (!id) {
      throw new Error('Session ID is required to create ThreadService');
    }
    return new ThreadService(this.repository, id);
  }
}
