import type { stateOfCompletionEntity } from '@/entities/soc.entity.js';
import type { IStateOfCompletionRepository } from '@/interfaces/repository/soc.interface.js';
import type z from 'zod';

export const createStateOfCompletionUseCase =
  (StateOfCompletionRepository: IStateOfCompletionRepository) =>
  async (data: {
    nodeId: z.infer<typeof stateOfCompletionEntity.shape.external.shape.nodeId>;
    status: z.infer<typeof stateOfCompletionEntity.shape.internal.shape.status>;
    content: z.infer<
      typeof stateOfCompletionEntity.shape.internal.shape.content
    >;
  }) => {
    try {
      const soc = await StateOfCompletionRepository.create(data);

      return soc;
    } catch (error) {
      console.error('🚀 ~ createStateOfCompletionUseCase ~ error:', error);
      throw error;
    }
  };
