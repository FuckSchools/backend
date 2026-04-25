import { sessionEntity } from '@/entities/session.entity.js';
import type { ISessionRepository } from '@/interfaces/repository/session.interface.js';
import type { z } from 'zod';

export const createSessionUseCase =
  (SessionRepository: ISessionRepository) =>
  async (data: {
    projectId: z.infer<typeof sessionEntity.shape.external.shape.projectId>;
    owner: z.infer<typeof sessionEntity.shape.internal.shape.owner>;
  }): Promise<z.infer<typeof sessionEntity.shape.internal>> => {
    try {
      const session = await SessionRepository.create(data);

      return session;
    } catch (error) {
      console.error('🚀 ~ createSessionUseCase ~ error:', error);

      throw error;
    }
  };
