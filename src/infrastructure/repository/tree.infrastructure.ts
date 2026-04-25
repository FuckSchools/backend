import { prisma } from '@/config/prisma.js';
import type { projectEntity } from '@/entities/project.entity.js';
import type { treeEntity } from '@/entities/tree.entity.js';
import { CustomError } from '@/interfaces/error.interface.js';
import type { ITreeRepository } from '@/interfaces/repository/tree.interface.js';
import type { output } from 'zod';

export class TreeRepository implements ITreeRepository {
  async getByProjectId(
    projectId: output<typeof projectEntity.shape.internal.shape.id>,
  ): Promise<output<typeof treeEntity>> {
    const tree = await prisma.tree.findUnique({
      where: {
        projectId,
      },
      include: {
        rootNode: true,
      },
    });
    if (!tree) {
      throw new CustomError('Tree not found', 'IllegalOperationError');
    }
    return {
      internal: {
        id: tree.id,
        createdAt: tree.createdAt,
      },
      external: {
        projectId: tree.projectId,
        rootNode: tree.rootNode,
      },
    };
  }
}
