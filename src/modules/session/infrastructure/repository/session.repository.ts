import { prisma } from '@/config/prisma.js';
import { MessageEntity } from '@/session/domain/entity/message.entity.js';
import { SessionEntity } from '@/session/domain/entity/session.entity.js';
import { ThreadEntity } from '@/session/domain/entity/thread.entity.js';
import type { ISessionRepository } from '@/session/domain/interface/repository.interface.js';

export class SessionRepository implements ISessionRepository {
  async getByProjectId(projectId: string): Promise<SessionEntity[]> {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { sessions: true },
    });
    if (!project) {
      throw new Error('Project not found.');
    }
    const sessionEntities: SessionEntity[] = [];
    for (const session of project.sessions) {
      const sessionEntity = new SessionEntity(session, session.id);
      sessionEntities.push(sessionEntity);
    }
    return sessionEntities;
  }
  async getThreadsBySessionEntity(
    sessionEntity: SessionEntity,
  ): Promise<ThreadEntity[]> {
    const session = await prisma.session.findUnique({
      where: { id: sessionEntity.id },
      include: { threads: true },
    });
    if (!session) {
      throw new Error('Session not found.');
    }
    const threadEntities: ThreadEntity[] = [];
    for (const thread of session.threads) {
      const threadEntity = new ThreadEntity(thread, thread.id);
      threadEntities.push(threadEntity);
    }
    return threadEntities;
  }
  async createThreadInSession(
    sessionEntity: SessionEntity,
    threadEntity: ThreadEntity,
  ): Promise<void> {
    await prisma.session.update({
      where: { id: sessionEntity.id },
      data: {
        threads: { create: { ...threadEntity.data, id: threadEntity.id } },
      },
    });
  }
  async getMessagesByThreadEntity(
    threadEntity: ThreadEntity,
  ): Promise<MessageEntity[]> {
    const thread = await prisma.thread.findUnique({
      where: { id: threadEntity.id },
      include: { messages: true },
    });
    if (!thread) {
      throw new Error('Thread not found.');
    }
    const messageEntities: MessageEntity[] = [];
    for (const message of thread.messages) {
      const messageEntity = new MessageEntity(message, message.id);
      messageEntities.push(messageEntity);
    }
    return messageEntities;
  }
  async createMessageInThread(
    threadEntity: ThreadEntity,
    messageEntity: MessageEntity,
  ): Promise<void> {
    await prisma.thread.update({
      where: { id: threadEntity.id },
      data: {
        messages: { create: { ...messageEntity.data, id: messageEntity.id } },
      },
    });
  }
  async save(data: SessionEntity): Promise<void> {
    await prisma.project.update({
      where: { id: data.projectId },
      data: { sessions: { create: { ...data.data, id: data.id } } },
    });
  }
  async findById(id: string): Promise<SessionEntity | null> {
    const session = await prisma.session.findUnique({ where: { id } });
    if (!session) {
      return session;
    }
    return new SessionEntity(session, session.id);
  }
}
