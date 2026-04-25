import { prisma } from '@/config/prisma.js';
import type {
  threadCreationEntity,
  threadEntity,
} from '@/entities/thread.entity.js';
import type { userEntity } from '@/entities/user.entity.js';
import { CustomError } from '@/interfaces/error.interface.js';
import type { IThreadRepository } from '@/interfaces/repository/thread.interface.js';
import type { output } from 'zod';

export class ThreadRepository implements IThreadRepository {
  async create(
    data: output<typeof threadCreationEntity>,
  ): Promise<output<typeof threadEntity.shape.internal>> {
    try {
      return await prisma.thread.create({ data });
    } catch (error) {
      throw new CustomError(
        `Failed to create thread: ${error instanceof Error ? error.message : String(error)}`,
        'IllegalOperationError',
      );
    }
  }
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
          role: message.role,
          content: message.content,
          createdAt: message.createdAt,
        })),
        sessionId: thread.sessionId,
      },
    };
  }
}
