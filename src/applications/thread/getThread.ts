import { threadEntity } from '@/entities/thread.entity.js';
import type { IThreadRepository } from '@/interfaces/repository/thread.interface.js';
import type { z } from 'zod';

export const getThreadUseCase =
  (ThreadRepository: IThreadRepository) =>
  async (data: {
    threadId: z.infer<typeof threadEntity.shape.internal.shape.id>;
  }): Promise<z.infer<typeof threadEntity>> => {
    try {
      const thread = await ThreadRepository.getById(data.threadId);

      return thread;
    } catch (error) {
      console.error('🚀 ~ getThreadUseCase ~ error:', error);

      throw error;
    }
  };
