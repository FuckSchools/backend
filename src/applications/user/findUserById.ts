import { userEntity } from '@/entities/user.entity.js';
import { knownErrors } from '@/interfaces/error.interface.js';
import type { IUserRepository } from '@/interfaces/repository/user.interface.js';
import type { z } from 'zod';

export const findUserByIdUseCase =
  (UserRepository: IUserRepository) =>
  async (
    userId: z.infer<typeof userEntity.shape.internal.shape.id>,
  ): Promise<
    z.infer<typeof userEntity.shape.internal.shape.id> | undefined
  > => {
    try {
      const { id } = await UserRepository.getById(
        await userEntity.shape.internal.shape.id.parseAsync(userId),
      );
      return id;
    } catch (error) {
      if (knownErrors.some((KnownError) => error instanceof KnownError)) {
        console.error('🚀 ~ findUserByIdUseCase ~ error:', error);
      }
      throw error;
    }
  };
