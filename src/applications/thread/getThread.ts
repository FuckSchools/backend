import { threadEntity } from '@/entities/thread.entity.js';
import { userEntity } from '@/entities/user.entity.js';
import { knownErrors } from '@/interfaces/error.interface.js';
import type { IThreadRepository } from '@/interfaces/repository/thread.interface.js';
import type { z } from 'zod';

export const getThreadUseCase =
  (ThreadRepository: IThreadRepository) =>
  async (
    threadId: z.infer<typeof threadEntity.shape.internal.shape.id>,
    userId: z.infer<typeof userEntity.shape.internal.shape.id>,
  ): Promise<z.infer<typeof threadEntity>> => {
    try {
      const thread = await ThreadRepository.getById(
        await threadEntity.shape.internal.shape.id.parseAsync(threadId),
        await userEntity.shape.internal.shape.id.parseAsync(userId),
      );

      return thread;
    } catch (error) {
      if (knownErrors.some((KnownError) => error instanceof KnownError)) {
        console.error('🚀 ~ getThreadUseCase ~ error:', error);
      }

      throw error;
    }
  };
