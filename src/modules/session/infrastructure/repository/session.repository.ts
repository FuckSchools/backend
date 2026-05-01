import { prisma } from '@/config/prisma.js';
import type { ISessionRepository } from '../../domain/interface/session.interface.js';
import type {
  Message,
  MessageFull,
} from '@/session/domain/entity/message.entity.js';
import type {
  Session,
  SessionFull,
} from '@/session/domain/entity/session.entity.js';
import type {
  Thread,
  ThreadFull,
} from '@/session/domain/entity/thread.entity.js';

export class SessionRepository implements ISessionRepository {
  async createSession(
    projectId: string,
    params: Session,
  ): Promise<SessionFull> {
    return await prisma.session.create({
      data: { ...params, project: { connect: { id: projectId } } },
    });
  }
  async getSessionsByProjectId(projectId: string): Promise<Array<SessionFull>> {
    return await prisma.session.findMany({ where: { projectId } });
  }
  async getSessionById(sessionId: string): Promise<SessionFull | null> {
    return await prisma.session.findUnique({ where: { id: sessionId } });
  }
  async createMessage(threadId: string, params: Message): Promise<MessageFull> {
    return await prisma.message.create({
      data: { ...params, thread: { connect: { id: threadId } } },
    });
  }
  async getMessagesByThreadId(threadId: string): Promise<Array<MessageFull>> {
    return await prisma.message.findMany({ where: { threadId } });
  }
  async getMessageById(messageId: string): Promise<MessageFull | null> {
    return await prisma.message.findUnique({ where: { id: messageId } });
  }
  async createThread(sessionId: string, params: Thread): Promise<ThreadFull> {
    return await prisma.thread.create({
      data: { ...params, session: { connect: { id: sessionId } } },
    });
  }
  async getThreadsBySessionId(sessionId: string): Promise<Array<ThreadFull>> {
    return await prisma.thread.findMany({ where: { sessionId } });
  }
  async getThreadById(threadId: string): Promise<ThreadFull | null> {
    return await prisma.thread.findUnique({ where: { id: threadId } });
  }
}
