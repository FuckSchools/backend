import { BaseService } from '@/shared/domain/service/base.service.js';
import type { Session, SessionFull } from '../entity/session.entity.js';
import type { Thread, ThreadFull } from '../entity/thread.entity.js';
import type { Message, MessageFull } from '../entity/message.entity.js';

export class SessionOnlyService extends BaseService<Session, SessionFull> {
  protected projectId: string | undefined;

  public set setProjectId(v: string) {
    this.projectId = v;
  }

  public get ProjectIdValue(): string {
    return this.projectId as string;
  }
}

export class ThreadService extends BaseService<Thread, ThreadFull> {
  protected sessionId: string | undefined;

  public set setSessionId(v: string) {
    this.sessionId = v;
  }

  public get SessionIdValue(): string {
    return this.sessionId as string;
  }
}

export class MessageService extends BaseService<Message, MessageFull> {
  protected threadId: string | undefined;

  public set setThreadId(v: string) {
    this.threadId = v;
  }

  public get ThreadIdValue(): string {
    return this.threadId as string;
  }
}
