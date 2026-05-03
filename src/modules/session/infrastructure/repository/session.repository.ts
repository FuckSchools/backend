import { prisma } from '@/config/prisma.js';
import { SessionAggregate } from '@/session/domain/aggregate/sessionAggregate.js';
import { ThreadAggregate } from '@/session/domain/aggregate/threadAggregate.js';
import { MessageEntity } from '@/session/domain/entity/message.entity.js';
import { SessionEntity } from '@/session/domain/entity/session.entity.js';
import { ThreadEntity } from '@/session/domain/entity/thread.entity.js';
import { type ISessionRepository } from '@/session/domain/interface/repository.interface.js';
import type { Message, Session, Thread } from 'prisma/client.js';

export class SessionRepository implements ISessionRepository {
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
  async getByProjectId(projectId: string): Promise<
    {
      sessionAggregate: SessionAggregate;
      threadAggregates: ThreadAggregate[];
    }[]
  > {
    return await this.getSessionsWithThreadsAndMessages(projectId);
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
