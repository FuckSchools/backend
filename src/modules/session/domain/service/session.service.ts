import { BaseService } from '@/shared/domain/service/base.service.js';
import type { Session, SessionFull } from '../entity/session.entity.js';
import type { ISessionRepository } from '../interface/session.interface.js';
import type { Thread, ThreadFull } from '../entity/thread.entity.js';
import type { ProviderEntity } from '@/shared/domain/entity/entity.js';
import type { Message, MessageFull } from '../entity/message.entity.js';

export class SessionSingularService<
  T,
  K extends ProviderEntity,
> extends BaseService<T, K> {
  public isAuthorized(incomingId: string): boolean {
    return this.getFormerEntityId() === incomingId;
  }

  public async create(
    createFn: (id: string, params: T) => Promise<K>,
  ): Promise<boolean> {
    const formerEntityId = this.getFormerEntityId();
    const entityData = this.getEntity();
    if (!formerEntityId || !entityData) {
      return false;
    }
    const newEntity = await createFn(formerEntityId, entityData);
    this.setFullEntity(newEntity);
    return true;
  }

  public async getById(
    id: string,
    getByIdFn: (id: string) => Promise<K | null>,
  ): Promise<boolean> {
    const entity = await getByIdFn(id);
    if (entity) {
      if (this.isAuthorized(entity.id)) {
        this.setFullEntity(entity);
        return true;
      }
      return false;
    }
    return false;
  }

  public newNext<P, Q extends ProviderEntity>(): SessionSingularService<P, Q> {
    return new SessionSingularService<P, Q>();
  }
}

export class MessageService extends BaseService<Message, MessageFull> {
  protected message = new SessionSingularService<Message, MessageFull>();
  constructor(protected repository: ISessionRepository) {
    super();
  }

  private synchronize(): void {
    this.message.setEntity(this.getEntity());
    this.message.setFormerEntityId(this.getFormerEntityId());
    this.message.setFullEntity(this.getFullEntity());
  }

  public async createMessage(): Promise<boolean> {
    this.synchronize();
    return await this.message.create(this.repository.createMessage);
  }

  public async acquireMessageById(): Promise<boolean> {
    this.synchronize();
    return await this.message.getById(
      this.getFormerEntityId()!,
      this.repository.getMessageById,
    );
  }

  public getMessageService(): SessionSingularService<Message, MessageFull> {
    return this.message;
  }
}

export class ThreadService extends BaseService<Thread, ThreadFull> {
  protected thread = new SessionSingularService<Thread, ThreadFull>();
  constructor(protected repository: ISessionRepository) {
    super();
  }

  private synchronize(): void {
    this.thread.setEntity(this.getEntity());
    this.thread.setFormerEntityId(this.getFormerEntityId());
    this.thread.setFullEntity(this.getFullEntity());
  }

  public async createThread(): Promise<boolean> {
    this.synchronize();
    return await this.thread.create(this.repository.createThread);
  }

  public async acquireThreadById(): Promise<boolean> {
    this.synchronize();
    return await this.thread.getById(
      this.getFormerEntityId()!,
      this.repository.getThreadById,
    );
  }

  public getThreadService(): SessionSingularService<Thread, ThreadFull> {
    return this.thread;
  }

  public newMessageService(): MessageService {
    const id = this.getFullEntity()?.id;
    if (!id) {
      throw new Error('Thread ID is required to create MessageService');
    }
    const messageService = new MessageService(this.repository);
    messageService.setFormerEntityId(id);
    return messageService;
  }
}

export class SessionService extends BaseService<Session, SessionFull> {
  protected session = new SessionSingularService<Session, SessionFull>();
  constructor(protected repository: ISessionRepository) {
    super();
  }

  private synchronize(): void {
    this.session.setEntity(this.getEntity());
    this.session.setFormerEntityId(this.getFormerEntityId());
    this.session.setFullEntity(this.getFullEntity());
  }

  public async createSession(): Promise<boolean> {
    this.synchronize();
    return await this.session.create(this.repository.createSession);
  }

  public async acquireSessionById(): Promise<boolean> {
    this.synchronize();
    return await this.session.getById(
      this.getFormerEntityId()!,
      this.repository.getSessionById,
    );
  }

  public getSessionService(): SessionSingularService<Session, SessionFull> {
    return this.session;
  }

  public newThreadService(): ThreadService {
    const id = this.getFullEntity()?.id;
    if (!id) {
      throw new Error('Session ID is required to create ThreadService');
    }
    const threadService = new ThreadService(this.repository);
    threadService.setFormerEntityId(id);
    return threadService;
  }
}
