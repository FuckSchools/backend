import { sessionEntity } from '@/entities/session.entity.js';
import type { ISessionRepository } from '@/interfaces/repository/session.interface.js';
import type { z } from 'zod';

export const getSessionUseCase =
  (SessionRepository: ISessionRepository) =>
  async (data: {
    sessionId: z.infer<typeof sessionEntity.shape.internal.shape.id>;
  }): Promise<z.infer<typeof sessionEntity>> => {
    try {
      const session = await SessionRepository.getById(data.sessionId);

      return session;
    } catch (error) {
      console.error('🚀 ~ getSessionUseCase ~ error:', error);

      throw error;
    }
  };
