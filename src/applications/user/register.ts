import { userEntity } from '@/entities/user.js';
import type { IUserRepository } from '@/interfaces/repository/user.js';
import type z from 'zod';

export const registerUserUseCase =
  (UserRepository: IUserRepository) =>
  async (userId: z.infer<typeof userEntity.shape.id>): Promise<string> => {
    try {
      const result = userEntity.shape.id.parseAsync(
        await UserRepository.register(userId),
      );
      return result;
    } catch (error) {
      console.error(
        `Error occurred while registering user with id ${userId}:`,
        error,
      );
      throw error;
    }
  };
