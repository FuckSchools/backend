import { projectEntity } from '@/entities/project.entity.js';
import { sessionEntity } from '@/entities/session.entity.js';
import { userEntity } from '@/entities/user.entity.js';
import { knownErrors } from '@/interfaces/error.interface.js';
import type { ISessionRepository } from '@/interfaces/repository/session.interface.js';
import type { z } from 'zod';

export const createSessionUseCase =
  (SessionRepository: ISessionRepository) =>
  async (
    projectId: z.infer<typeof projectEntity.shape.internal.shape.id>,
    userId: z.infer<typeof userEntity.shape.internal.shape.id>,
    owner: z.infer<typeof sessionEntity.shape.internal.shape.owner>,
  ): Promise<z.infer<typeof sessionEntity>> => {
    try {
      const session = await SessionRepository.create(
        await projectEntity.shape.internal.shape.id.parseAsync(projectId),
        await userEntity.shape.internal.shape.id.parseAsync(userId),
        await sessionEntity.shape.internal.shape.owner.parseAsync(owner),
      );

      return session;
    } catch (error) {
      if (knownErrors.some((KnownError) => error instanceof KnownError)) {
        console.error('🚀 ~ createSessionUseCase ~ error:', error);
      }

      throw error;
    }
  };
