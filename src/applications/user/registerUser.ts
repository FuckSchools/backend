import { userEntity } from '@/entities/user.entity.js';
import { knownErrors } from '@/interfaces/error.interface.js';
import type { IUserRepository } from '@/interfaces/repository/user.interface.js';
import type z from 'zod';

export const registerUserUseCase =
  (UserRepository: IUserRepository) =>
  async (
    userId: z.infer<typeof userEntity.shape.id>,
  ): Promise<z.infer<typeof userEntity.shape.id>> => {
    try {
      return await UserRepository.register(
        await userEntity.shape.id.parseAsync(userId),
      );
    } catch (error) {
      if (knownErrors.some((KnownError) => error instanceof KnownError)) {
        console.error('🚀 ~ registerUserUseCase ~ error:', error);
      }
      throw error;
    }
  };
