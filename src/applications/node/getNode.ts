import { nodeEntity } from '@/entities/node.entity.js';
import { userEntity } from '@/entities/user.entity.js';
import { knownErrors } from '@/interfaces/error.interface.js';
import type { INodeRepository } from '@/interfaces/repository/node.interface.js';
import type { z } from 'zod';

export const getNodeUseCase =
  (NodeRepository: INodeRepository) =>
  async (
    nodeId: z.infer<typeof nodeEntity.shape.internal.shape.id>,
    userId: z.infer<typeof userEntity.shape.internal.shape.id>,
  ): Promise<z.infer<typeof nodeEntity>> => {
    try {
      const node = await NodeRepository.getById(
        await nodeEntity.shape.internal.shape.id.parseAsync(nodeId),
        await userEntity.shape.internal.shape.id.parseAsync(userId),
      );

      return node;
    } catch (error) {
      if (knownErrors.some((KnownError) => error instanceof KnownError)) {
        console.error('🚀 ~ getNodeUseCase ~ error:', error);
      }

      throw error;
    }
  };
