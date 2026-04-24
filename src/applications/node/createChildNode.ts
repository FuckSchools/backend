import { nodeEntity } from '@/entities/node.entity.js';
import { userEntity } from '@/entities/user.entity.js';
import { knownErrors } from '@/interfaces/error.interface.js';
import type { INodeRepository } from '@/interfaces/repository/node.interface.js';
import type { z } from 'zod';

export const createChildNodeUseCase =
  (NodeRepository: INodeRepository) =>
  async (
    parentNodeId: z.infer<typeof nodeEntity.shape.internal.shape.id>,
    userId: z.infer<typeof userEntity.shape.internal.shape.id>,
    content: z.infer<typeof nodeEntity.shape.internal.shape.content>,
    prerequisites: z.infer<
      typeof nodeEntity.shape.external.shape.prerequisites
    >,
    statesOfCompletion: Array<{
      content: z.infer<
        typeof nodeEntity.shape.external.shape.statesOfCompletion.element.shape.content
      >;
      status: z.infer<
        typeof nodeEntity.shape.external.shape.statesOfCompletion.element.shape.status
      >;
    }>,
  ): Promise<z.infer<typeof nodeEntity>> => {
    try {
      const node = await NodeRepository.createChildNode(
        await nodeEntity.shape.internal.shape.id.parseAsync(parentNodeId),
        await userEntity.shape.internal.shape.id.parseAsync(userId),
        await nodeEntity.shape.internal.shape.content.parseAsync(content),
        await nodeEntity.shape.external.shape.prerequisites.parseAsync(
          prerequisites,
        ),
        await Promise.all(
          statesOfCompletion.map(async (stateOfCompletion) => ({
            content:
              await nodeEntity.shape.external.shape.statesOfCompletion.element.shape.content.parseAsync(
                stateOfCompletion.content,
              ),
            status:
              await nodeEntity.shape.external.shape.statesOfCompletion.element.shape.status.parseAsync(
                stateOfCompletion.status,
              ),
          })),
        ),
      );

      return node;
    } catch (error) {
      if (knownErrors.some((KnownError) => error instanceof KnownError)) {
        console.error('🚀 ~ createChildNodeUseCase ~ error:', error);
      }

      throw error;
    }
  };
