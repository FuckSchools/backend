import { prisma } from '@/config/prisma.js';
import type { projectEntity } from '@/entities/project.entity.js';
import type { sessionEntity } from '@/entities/session.entity.js';
import type { userEntity } from '@/entities/user.entity.js';
import { CustomError } from '@/interfaces/error.interface.js';
import type { ISessionRepository } from '@/interfaces/repository/session.interface.js';
import type { output } from 'zod';

export class SessionRepository implements ISessionRepository {
  private async assertProjectOwnership(
    projectId: output<typeof projectEntity.shape.internal.shape.id>,
    userId: output<typeof userEntity.shape.internal.shape.id>,
  ): Promise<void> {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
      select: {
        id: true,
      },
    });

    if (!project) {
      throw new CustomError(
        `Project with ID ${projectId} for user ${userId} not found.`,
        'IllegalOperationError',
      );
    }
  }

  async create(
    projectId: output<typeof projectEntity.shape.internal.shape.id>,
    userId: output<typeof userEntity.shape.internal.shape.id>,
    owner: output<typeof sessionEntity.shape.internal.shape.owner>,
  ): Promise<output<typeof sessionEntity>> {
    await this.assertProjectOwnership(projectId, userId);

    const createdSession = await prisma.session.create({
      data: {
        projectId,
        owner,
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

    return {
      internal: {
        id: createdSession.id,
        owner: createdSession.owner,
        createdAt: createdSession.createdAt,
        updatedAt: createdSession.updatedAt,
      },
      external: {
        threads: createdSession.threads,
      },
    };
  }

  async getById(
    sessionId: output<typeof sessionEntity.shape.internal.shape.id>,
    userId: output<typeof userEntity.shape.internal.shape.id>,
  ): Promise<output<typeof sessionEntity>> {
    const session = await prisma.session.findFirst({
      where: {
        id: sessionId,
        project: {
          userId,
        },
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
        `Session with ID ${sessionId} for user ${userId} not found.`,
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
      },
    };
  }

  async createThread(
    sessionId: output<typeof sessionEntity.shape.internal.shape.id>,
    userId: output<typeof userEntity.shape.internal.shape.id>,
  ): Promise<output<typeof sessionEntity.shape.external.shape.threads>> {
    const session = await prisma.session.findFirst({
      where: {
        id: sessionId,
        project: {
          userId,
        },
      },
      select: {
        id: true,
      },
    });

    if (!session) {
      throw new CustomError(
        `Session with ID ${sessionId} for user ${userId} not found.`,
        'IllegalOperationError',
      );
    }

    await prisma.thread.create({
      data: {
        sessionId,
      },
    });

    return await prisma.thread.findMany({
      where: {
        sessionId,
      },
      select: {
        id: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
}
