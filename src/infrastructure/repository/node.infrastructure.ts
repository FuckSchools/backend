import { prisma } from '@/config/prisma.js';
import type { nodeEntity } from '@/entities/node.entity.js';
import type { userEntity } from '@/entities/user.entity.js';
import { CustomError } from '@/interfaces/error.interface.js';
import type { INodeRepository } from '@/interfaces/repository/node.interface.js';
import type { output } from 'zod';

export class NodeRepository implements INodeRepository {
  private async assertNodeOwnership(
    nodeId: output<typeof nodeEntity.shape.internal.shape.id>,
    userId: output<typeof userEntity.shape.internal.shape.id>,
  ): Promise<void> {
    const visitedNodeIds = new Set<string>();
    let currentNodeId = nodeId;

    while (true) {
      if (visitedNodeIds.has(currentNodeId)) {
        throw new CustomError(
          `Node hierarchy cycle detected at ${currentNodeId}.`,
          'IllegalOperationError',
        );
      }

      visitedNodeIds.add(currentNodeId);

      const currentNode = await prisma.node.findUnique({
        where: {
          id: currentNodeId,
        },
        select: {
          parentNodeId: true,
          tree: {
            select: {
              project: {
                select: {
                  userId: true,
                },
              },
            },
          },
        },
      });

      if (!currentNode) {
        throw new CustomError(
          `Node with ID ${nodeId} for user ${userId} not found.`,
          'IllegalOperationError',
        );
      }

      const ownerUserId = currentNode.tree?.project?.userId;
      if (ownerUserId) {
        if (ownerUserId !== userId) {
          throw new CustomError(
            `Node with ID ${nodeId} for user ${userId} not found.`,
            'IllegalOperationError',
          );
        }

        return;
      }

      if (!currentNode.parentNodeId) {
        throw new CustomError(
          `Node with ID ${nodeId} for user ${userId} not found.`,
          'IllegalOperationError',
        );
      }

      currentNodeId = currentNode.parentNodeId;
    }
  }

  async createChildNode(
    parentNodeId: output<typeof nodeEntity.shape.internal.shape.id>,
    userId: output<typeof userEntity.shape.internal.shape.id>,
    content: output<typeof nodeEntity.shape.internal.shape.content>,
    prerequisites: output<typeof nodeEntity.shape.external.shape.prerequisites>,
    statesOfCompletion: Array<{
      content: output<
        typeof nodeEntity.shape.external.shape.statesOfCompletion.element.shape.content
      >;
      status: output<
        typeof nodeEntity.shape.external.shape.statesOfCompletion.element.shape.status
      >;
    }>,
  ): Promise<output<typeof nodeEntity>> {
    await this.assertNodeOwnership(parentNodeId, userId);

    const createdNode = await prisma.node.create({
      data: {
        content,
        prerequisites,
        parentNodeId,
        ...(statesOfCompletion.length > 0 ?
          {
            statesOfCompletion: {
              create: statesOfCompletion,
            },
          }
        : {}),
      },
      include: {
        statesOfCompletion: true,
        parentNode: {
          select: {
            id: true,
            content: true,
            createdAt: true,
          },
        },
        childNodes: {
          select: {
            id: true,
            content: true,
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
        id: createdNode.id,
        content: createdNode.content,
        createdAt: createdNode.createdAt,
      },
      external: {
        prerequisites: createdNode.prerequisites,
        statesOfCompletion: createdNode.statesOfCompletion,
        parentNode: createdNode.parentNode,
        childNodes: createdNode.childNodes,
      },
    };
  }

  async getById(
    nodeId: output<typeof nodeEntity.shape.internal.shape.id>,
    userId: output<typeof userEntity.shape.internal.shape.id>,
  ): Promise<output<typeof nodeEntity>> {
    await this.assertNodeOwnership(nodeId, userId);

    const node = await prisma.node.findUnique({
      where: {
        id: nodeId,
      },
      include: {
        statesOfCompletion: true,
        parentNode: {
          select: {
            id: true,
            content: true,
            createdAt: true,
          },
        },
        childNodes: {
          select: {
            id: true,
            content: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!node) {
      throw new CustomError(
        `Node with ID ${nodeId} for user ${userId} not found.`,
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
        prerequisites: node.prerequisites,
        statesOfCompletion: node.statesOfCompletion,
        parentNode: node.parentNode,
        childNodes: node.childNodes,
      },
    };
  }
}
