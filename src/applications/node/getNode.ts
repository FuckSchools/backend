import { nodeEntity } from '@/entities/node.entity.js';
import type { INodeRepository } from '@/interfaces/repository/node.interface.js';
import type { z } from 'zod';

export const getNodeUseCase =
  (NodeRepository: INodeRepository) =>
  async (data: {
    nodeId: z.infer<typeof nodeEntity.shape.internal.shape.id>;
  }): Promise<z.infer<typeof nodeEntity>> => {
    try {
      const node = await NodeRepository.getById(data.nodeId);

      return node;
    } catch (error) {
      console.error('🚀 ~ getNodeUseCase ~ error:', error);

      throw error;
    }
  };
