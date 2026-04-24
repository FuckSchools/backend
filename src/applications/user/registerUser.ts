import { userEntity } from '@/entities/user.entity.js';
import { knownErrors } from '@/interfaces/error.interface.js';
import type { IUserRepository } from '@/interfaces/repository/user.interface.js';
import type { z } from 'zod';

export const registerUserUseCase =
  (UserRepository: IUserRepository) =>
  async (
    userId: z.infer<typeof userEntity.shape.internal.shape.id>,
  ): Promise<z.infer<typeof userEntity.shape.internal>> => {
    try {
      const user = await UserRepository.register(
        await userEntity.shape.internal.shape.id.parseAsync(userId),
      );
      return user;
    } catch (error) {
      if (knownErrors.some((KnownError) => error instanceof KnownError)) {
        console.error('🚀 ~ registerUserUseCase ~ error:', error);
      }
      throw error;
    }
  };
