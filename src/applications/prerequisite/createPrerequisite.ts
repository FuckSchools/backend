import type { prerequisiteEntity } from '@/entities/prerequisite.entity.js';
import type { IPrerequisiteRepository } from '@/interfaces/repository/prerequisite.interface.js';
import type z from 'zod';
export const createPrerequisiteUseCase =
  (PrerequisiteRepository: IPrerequisiteRepository) =>
  async (data: {
    nodeId: z.infer<typeof prerequisiteEntity.shape.external.shape.nodeId>;
    content: z.infer<typeof prerequisiteEntity.shape.internal.shape.content>;
    status: z.infer<typeof prerequisiteEntity.shape.internal.shape.status>;
  }) => {
    try {
      const prerequisite = await PrerequisiteRepository.create(data);

      return prerequisite;
    } catch (error) {
      console.error('🚀 ~ createPrerequisiteUseCase ~ error:', error);
      throw error;
    }
  };
