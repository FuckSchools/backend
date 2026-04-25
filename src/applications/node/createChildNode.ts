import { nodeEntity } from '@/entities/node.entity.js';
import type { INodeRepository } from '@/interfaces/repository/node.interface.js';
import type { z } from 'zod';

export const createChildNodeUseCase =
  (NodeRepository: INodeRepository) =>
  async (data: {
    parentId: z.infer<typeof nodeEntity.shape.external.shape.parentId>;
    content: z.infer<typeof nodeEntity.shape.internal.shape.content>;
  }): Promise<z.infer<typeof nodeEntity.shape.internal>> => {
    try {
      const node = await NodeRepository.createNode(data);

      return node;
    } catch (error) {
      console.error('🚀 ~ createChildNodeUseCase ~ error:', error);

      throw error;
    }
  };
