import { prisma } from '@/config/prisma.js';
import { CustomError } from '@/interfaces/error.interface.js';
import type { IProjectRepository } from '@/interfaces/repository/project.interface.js';
import type { projectEntity } from '@/entities/project.entity.js';
import type { userEntity } from '@/entities/user.entity.js';
import type { output } from 'zod';

export class ProjectRepository implements IProjectRepository {
  async create(
    userId: output<typeof userEntity.shape.internal.shape.id>,
    title: output<typeof projectEntity.shape.internal.shape.title>,
  ): Promise<output<typeof projectEntity>> {
    const createdProject = await prisma.project.create({
      data: {
        title,
        userId,
      },
      include: {
        sessions: true,
        tree: {
          select: {
            id: true,
          },
        },
      },
    });

    return {
      internal: {
        id: createdProject.id,
        title: createdProject.title,
        createdAt: createdProject.createdAt,
        updatedAt: createdProject.updatedAt,
      },
      external: {
        sessions: createdProject.sessions,
        tree: createdProject.tree,
      },
      special: {
        sandboxExId: createdProject.sandboxExId,
      },
    };
  }

  async getById(
    projectId: output<typeof projectEntity.shape.internal.shape.id>,
    userId: output<typeof userEntity.shape.internal.shape.id>,
  ): Promise<output<typeof projectEntity>> {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        userId,
      },
      include: {
        sessions: true,
        tree: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!project) {
      throw new CustomError(
        `Project with ID ${projectId} for user ${userId} not found.`,
        'IllegalOperationError',
      );
    }

    return {
      internal: {
        id: project.id,
        title: project.title,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      },
      external: {
        sessions: project.sessions,
        tree: project.tree,
      },
      special: {
        sandboxExId: project.sandboxExId,
      },
    };
  }
}
