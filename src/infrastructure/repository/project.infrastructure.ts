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
  ): Promise<output<typeof projectEntity.shape.internal>> {
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
    });

    return createdProject;
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
