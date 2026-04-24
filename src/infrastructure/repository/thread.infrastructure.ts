import { prisma } from '@/config/prisma.js';
import type { threadEntity } from '@/entities/thread.entity.js';
import type { userEntity } from '@/entities/user.entity.js';
import { CustomError } from '@/interfaces/error.interface.js';
import type { IThreadRepository } from '@/interfaces/repository/thread.interface.js';
import type { output } from 'zod';

export class ThreadRepository implements IThreadRepository {
  async getById(
    threadId: output<typeof threadEntity.shape.internal.shape.id>,
    userId: output<typeof userEntity.shape.internal.shape.id>,
  ): Promise<output<typeof threadEntity>> {
    const thread = await prisma.thread.findFirst({
      where: {
        id: threadId,
        session: {
          project: {
            userId,
          },
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!thread) {
      throw new CustomError(
        `Thread with ID ${threadId} for user ${userId} not found.`,
        'IllegalOperationError',
      );
    }

    return {
      internal: {
        id: thread.id,
        createdAt: thread.createdAt,
      },
      external: {
        messages: thread.messages.map((message) => ({
          id: message.id,
          sender: message.role,
          content: message.content,
          createdAt: message.createdAt,
        })),
      },
    };
  }

  async createMessage(
    threadId: output<typeof threadEntity.shape.internal.shape.id>,
    userId: output<typeof userEntity.shape.internal.shape.id>,
    sender: output<
      typeof threadEntity.shape.external.shape.messages.element.shape.sender
    >,
    content: output<
      typeof threadEntity.shape.external.shape.messages.element.shape.content
    >,
  ): Promise<output<typeof threadEntity.shape.external.shape.messages>> {
    const thread = await prisma.thread.findFirst({
      where: {
        id: threadId,
        session: {
          project: {
            userId,
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (!thread) {
      throw new CustomError(
        `Thread with ID ${threadId} for user ${userId} not found.`,
        'IllegalOperationError',
      );
    }

    await prisma.message.create({
      data: {
        threadId,
        role: sender,
        content,
      },
    });

    const messages = await prisma.message.findMany({
      where: {
        threadId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return messages.map((message) => ({
      id: message.id,
      sender: message.role,
      content: message.content,
      createdAt: message.createdAt,
    }));
  }
}
