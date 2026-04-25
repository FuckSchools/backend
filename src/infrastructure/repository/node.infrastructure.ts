import { prisma } from '@/config/prisma.js';
import { nodeEntity, type nodeCreationEntity } from '@/entities/node.entity.js';
import { CustomError } from '@/interfaces/error.interface.js';
import type { INodeRepository } from '@/interfaces/repository/node.interface.js';
import type { output } from 'zod';

export class NodeRepository implements INodeRepository {
  async createNode(
    data: output<typeof nodeCreationEntity>,
    isRoot: boolean = false,
  ): Promise<output<typeof nodeEntity.shape.internal>> {
    const node = await prisma.node.create({
      data: {
        content: data.content,
        ...(isRoot ?
          {
            tree: {
              connect: {
                id: data.parentId,
              },
            },
          }
        : {
            parentNode: {
              connect: {
                id: data.parentId,
              },
            },
          }),
      },
    });
    const parentId = node.parentNodeId ?? node.treeId;
    if (!parentId) {
      console.error('neither parentNodeId nor treeId is valid for node:', node);
      throw new CustomError(
        `Node with ID ${node.id} is invalid. It must have either a parentNodeId or a treeId.`,
        'InfrastructureError',
      );
    }
    return node;
  }

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
    const parentId = node.parentNodeId ?? node.treeId;
    if (!parentId) {
      console.error('neither parentNodeId nor treeId is valid for node:', node);
      throw new CustomError(
        `Node with ID ${nodeId} is invalid. It must have either a parentNodeId or a treeId.`,
        'InfrastructureError',
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
        parentId,
      },
    };
  }
}
