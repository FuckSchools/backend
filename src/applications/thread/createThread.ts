import type { threadEntity } from '@/entities/thread.entity.js';
import type { IThreadRepository } from '@/interfaces/repository/thread.interface.js';
import type { z } from 'zod';

export const createThreadUseCase =
  (ThreadRepository: IThreadRepository) =>
  async (data: {
    sessionId: z.infer<typeof threadEntity.shape.external.shape.sessionId>;
  }): Promise<z.infer<typeof threadEntity.shape.internal>> => {
    try {
      const thread = await ThreadRepository.create(data);

      return thread;
    } catch (error) {
      console.error('🚀 ~ createThreadUseCase ~ error:', error);

      throw error;
    }
  };
