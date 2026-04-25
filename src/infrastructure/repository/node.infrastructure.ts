import { prisma } from '@/config/prisma.js';
import type { nodeCreationEntity, nodeEntity } from '@/entities/node.entity.js';
import { CustomError } from '@/interfaces/error.interface.js';
import type { INodeRepository } from '@/interfaces/repository/node.interface.js';
import type { output } from 'zod';

export class NodeRepository implements INodeRepository {
  async getById(
    nodeId: output<typeof nodeEntity.shape.internal.shape.id>,
  ): Promise<output<typeof nodeEntity>> {
    const node = await prisma.node.findUnique({
      where: {
        id: nodeId,
      },
      include: {
        statesOfCompletion: true,
        childNodes: true,
        prerequisites: true,
      },
    });
    if (!node) {
      throw new CustomError(
        `Node with ID ${nodeId} not found.`,
        'IllegalOperationError',
      );
    }
    return {
      internal: {
        id: node.id,
        content: node.content,
        createdAt: node.createdAt,
      },
      external: {
        statesOfCompletion: node.statesOfCompletion,
        childNodes: node.childNodes,
        prerequisites: node.prerequisites,
        parentId: node.parentNodeId ?? '111',
      },
    };
  }
  async createNode(
    data: output<typeof nodeCreationEntity>,
  ): Promise<output<typeof nodeEntity.shape.internal>> {
    try {
      return await prisma.node.create({ data });
    } catch (error) {
      console.error('🚀 ~ NodeRepository ~ createNode ~ error:', error);
      throw new CustomError('Failed to create node.', 'IllegalOperationError');
    }
  }
}
