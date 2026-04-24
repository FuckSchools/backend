import { sessionEntity } from '@/entities/session.entity.js';
import { userEntity } from '@/entities/user.entity.js';
import { knownErrors } from '@/interfaces/error.interface.js';
import type { ISessionRepository } from '@/interfaces/repository/session.interface.js';
import type { z } from 'zod';

export const getSessionUseCase =
  (SessionRepository: ISessionRepository) =>
  async (
    sessionId: z.infer<typeof sessionEntity.shape.internal.shape.id>,
    userId: z.infer<typeof userEntity.shape.internal.shape.id>,
  ): Promise<z.infer<typeof sessionEntity>> => {
    try {
      const session = await SessionRepository.getById(
        await sessionEntity.shape.internal.shape.id.parseAsync(sessionId),
        await userEntity.shape.internal.shape.id.parseAsync(userId),
      );

      return session;
    } catch (error) {
      if (knownErrors.some((KnownError) => error instanceof KnownError)) {
        console.error('🚀 ~ getSessionUseCase ~ error:', error);
      }

      throw error;
    }
  };
