import { userEntity } from '@/entities/user.entity.js';
import { CustomError } from '@/interfaces/error.interface.js';
import type { IUserRepository } from '@/interfaces/repository/user.interface.js';
import type { z } from 'zod';

export const registerUserUseCase =
  (UserRepository: IUserRepository) =>
  async (data: {
    userId: z.infer<typeof userEntity.shape.internal.shape.id>;
  }): Promise<z.infer<typeof userEntity.shape.internal>> => {
    try {
      const user = await UserRepository.register(data.userId);
      return user;
    } catch (error) {
      if (
        error instanceof CustomError &&
        error.name === 'IllegalOperationError'
      ) {
        throw new CustomError(
          `User with ID ${data.userId} already exists.`,
          'UserAlreadyExistsError',
        );
      }
      console.error('🚀 ~ registerUserUseCase ~ error:', error);

      throw error;
    }
  };
