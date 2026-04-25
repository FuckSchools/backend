import { prisma } from '@/config/prisma.js';
import type {
  sessionCreationEntity,
  sessionEntity,
} from '@/entities/session.entity.js';
import { CustomError } from '@/interfaces/error.interface.js';
import type { ISessionRepository } from '@/interfaces/repository/session.interface.js';
import type { output } from 'zod';

export class SessionRepository implements ISessionRepository {
  async create(
    data: output<typeof sessionCreationEntity>,
  ): Promise<output<typeof sessionEntity.shape.internal>> {
    const createdSession = await prisma.session.create({
      data: {
        owner: data.owner,
        project: {
          connect: {
            id: data.projectId,
          },
        },
      },
    });

    return createdSession;
  }

  async getById(
    sessionId: output<typeof sessionEntity.shape.internal.shape.id>,
  ): Promise<output<typeof sessionEntity>> {
    const session = await prisma.session.findFirst({
      where: {
        id: sessionId,
      },
      include: {
        threads: {
          select: {
            id: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!session) {
      throw new CustomError(
        `Session with ID ${sessionId} not found.`,
        'IllegalOperationError',
      );
    }

    return {
      internal: {
        id: session.id,
        owner: session.owner,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
      },
      external: {
        threads: session.threads,
        projectId: session.projectId,
      },
    };
  }
}
