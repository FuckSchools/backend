import { prisma } from '@/config/prisma.js';
import { CustomError } from '@/interfaces/error.interface.js';
import type { IProjectRepository } from '@/interfaces/repository/project.interface.js';
import type {
  projectCreationEntity,
  projectEntity,
} from '@/entities/project.entity.js';
import type { output } from 'zod';

export class ProjectRepository implements IProjectRepository {
  async create(
    data: output<typeof projectCreationEntity>,
  ): Promise<output<typeof projectEntity>> {
    const createdProject = await prisma.project.create({
      data: {
        title: data.title,
        user: {
          connect: {
            id: data.userId,
          },
        },
        tree: {
          create: {},
        },
      },
      include: {
        sessions: true,
        tree: true,
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
        userId: createdProject.userId,
      },
      special: {
        sandboxExId: createdProject.sandboxExId,
      },
    };
  }

  async getById(
    projectId: output<typeof projectEntity.shape.internal.shape.id>,
  ): Promise<output<typeof projectEntity>> {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        sessions: true,
        tree: true,
      },
    });

    if (!project) {
      throw new CustomError(
        `Project with ID ${projectId} not found.`,
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
        userId: project.userId,
      },
      special: {
        sandboxExId: project.sandboxExId,
      },
    };
  }
}
