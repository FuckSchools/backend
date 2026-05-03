import { prisma } from '@/config/prisma.js';
import { SessionAggregate } from '@/session/domain/aggregate/sessionAggregate.js';
import { ThreadAggregate } from '@/session/domain/aggregate/threadAggregate.js';
import { MessageEntity } from '@/session/domain/entity/message.entity.js';
import { SessionEntity } from '@/session/domain/entity/session.entity.js';
import { ThreadEntity } from '@/session/domain/entity/thread.entity.js';
import {
  SessionIncludeOption,
  type ISessionRepository,
} from '@/session/domain/interface/repository.interface.js';
import type { Message, Session, Thread } from 'prisma/client.js';

export class SessionRepository implements ISessionRepository {
  private getSessionAggregateWithThreads(
    session: Session & { threads: Thread[] },
  ) {
    const sessionAggregate = new SessionAggregate(
      new SessionEntity(session, session.id),
    );
    const threadAggregates = session.threads.map((thread) => {
      return sessionAggregate.newThreadAggregate(
        new ThreadEntity(thread, thread.id),
      );
    });
    return { sessionAggregate, threadAggregates };
  }

  private getSessionAggregateWithThreadsAndMessages(
    session: Session & { threads: Array<Thread & { messages: Message[] }> },
  ) {
    const sessionAggregate = new SessionAggregate(
      new SessionEntity(session, session.id),
    );
    const threadAggregates = session.threads.map((thread) => {
      const threadAggregate = this.getThreadAggregateWithMessages(thread);
      sessionAggregate.addThreadAggregate(threadAggregate);
      return threadAggregate;
    });
    return { sessionAggregate, threadAggregates };
  }

  private getThreadAggregateWithMessages(
    thread: Thread & { messages: Message[] },
  ) {
    const threadAggregate = new ThreadAggregate(
      new ThreadEntity(thread, thread.id),
    );
    for (const message of thread.messages) {
      threadAggregate.addMessageEntity(new MessageEntity(message, message.id));
    }
    return threadAggregate;
  }
  private async getSessions(projectId: string) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { sessions: true },
    });
    if (!project) {
      return [];
    }
    return project.sessions.map(
      (session) => new SessionEntity(session, session.id),
    );
  }

  private async getSessionsWithThreads(projectId: string) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { sessions: { include: { threads: true } } },
    });
    if (!project) {
      return [];
    }
    return project.sessions.map((session) =>
      this.getSessionAggregateWithThreads(session),
    );
  }

  private async getSessionsWithThreadsAndMessages(projectId: string) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        sessions: {
          include: {
            threads: {
              include: {
                messages: true,
              },
            },
          },
        },
      },
    });
    if (!project) {
      return [];
    }
    return project.sessions.map((session) =>
      this.getSessionAggregateWithThreadsAndMessages(session),
    );
  }
  async getByProjectId(
    projectId: string,
    include: keyof typeof SessionIncludeOption,
  ): Promise<
    {
      sessionAggregate: SessionAggregate;
      threadAggregates: ThreadAggregate[];
    }[]
  >;
  async getByProjectId(projectId: string): Promise<SessionEntity[]>;
  async getByProjectId(
    projectId: string,
    include?: keyof typeof SessionIncludeOption,
  ): Promise<
    | SessionEntity[]
    | {
        sessionAggregate: SessionAggregate;
        threadAggregates: ThreadAggregate[];
      }[]
  > {
    if (include === 'Threads') {
      return await this.getSessionsWithThreads(projectId);
    }
    if (include === 'Messages') {
      return await this.getSessionsWithThreadsAndMessages(projectId);
    }
    return await this.getSessions(projectId);
  }
  async createThreadInSession(
    sessionId: string,
    threadEntity: ThreadEntity,
  ): Promise<void> {
    await prisma.session.update({
      where: { id: sessionId },
      data: {
        threads: { create: { ...threadEntity.data, id: threadEntity.id } },
      },
    });
  }
  async createMessageInThread(
    threadId: string,
    messageEntity: MessageEntity,
  ): Promise<void> {
    await prisma.thread.update({
      where: { id: threadId },
      data: {
        messages: { create: { ...messageEntity.data, id: messageEntity.id } },
      },
    });
  }
  async save(data: SessionEntity): Promise<void> {
    await prisma.project.update({
      where: { id: data.data.projectId },
      data: { sessions: { create: { ...data.data, id: data.id } } },
    });
  }
  async getById(id: string): Promise<SessionEntity | null> {
    const session = await prisma.session.findUnique({ where: { id } });
    if (!session) {
      return session;
    }
    return new SessionEntity(session, session.id);
  }
}
