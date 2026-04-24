import { prisma } from '@/config/prisma.js';
import type { nodeEntity } from '@/entities/node.entity.js';
import type { projectEntity } from '@/entities/project.entity.js';
import type { treeEntity } from '@/entities/tree.entity.js';
import type { userEntity } from '@/entities/user.entity.js';
import { CustomError } from '@/interfaces/error.interface.js';
import type { ITreeRepository } from '@/interfaces/repository/tree.interface.js';
import type { output } from 'zod';

export class TreeRepository implements ITreeRepository {
  async create(
    projectId: output<typeof projectEntity.shape.internal.shape.id>,
    userId: output<typeof userEntity.shape.internal.shape.id>,
    rootContent: output<typeof nodeEntity.shape.internal.shape.content>,
    rootPrerequisites: output<
      typeof nodeEntity.shape.external.shape.prerequisites
    >,
    rootStatesOfCompletion: Array<{
      content: output<
        typeof nodeEntity.shape.external.shape.statesOfCompletion.element.shape.content
      >;
      status: output<
        typeof nodeEntity.shape.external.shape.statesOfCompletion.element.shape.status
      >;
    }>,
  ): Promise<output<typeof treeEntity>> {
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

    const existingTree = await prisma.tree.findUnique({
      where: {
        projectId,
      },
      select: {
        id: true,
      },
    });

    if (existingTree) {
      throw new CustomError(
        `Tree for project ${projectId} already exists.`,
        'IllegalOperationError',
      );
    }

    const createdTree = await prisma.tree.create({
      data: {
        project: {
          connect: {
            id: projectId,
          },
        },
        rootNode: {
          create: {
            content: rootContent,
            prerequisites: rootPrerequisites,
            ...(rootStatesOfCompletion.length > 0 ?
              {
                statesOfCompletion: {
                  create: rootStatesOfCompletion,
                },
              }
            : {}),
          },
        },
      },
      include: {
        rootNode: {
          select: {
            id: true,
            content: true,
            createdAt: true,
          },
        },
      },
    });

    return {
      internal: {
        id: createdTree.id,
      },
      external: {
        rootNode: createdTree.rootNode,
      },
    };
  }

  async getById(
    treeId: output<typeof treeEntity.shape.internal.shape.id>,
    userId: output<typeof userEntity.shape.internal.shape.id>,
  ): Promise<output<typeof treeEntity>> {
    const tree = await prisma.tree.findFirst({
      where: {
        id: treeId,
        project: {
          userId,
        },
      },
      include: {
        rootNode: {
          select: {
            id: true,
            content: true,
            createdAt: true,
          },
        },
      },
    });

    if (!tree) {
      throw new CustomError(
        `Tree with ID ${treeId} for user ${userId} not found.`,
        'IllegalOperationError',
      );
    }

    return {
      internal: {
        id: tree.id,
      },
      external: {
        rootNode: tree.rootNode,
      },
    };
  }
}
