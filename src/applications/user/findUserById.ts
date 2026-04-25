import { userEntity } from '@/entities/user.entity.js';
import { CustomError } from '@/interfaces/error.interface.js';
import type { IUserRepository } from '@/interfaces/repository/user.interface.js';
import type { z } from 'zod';

export const findUserByIdUseCase =
  (UserRepository: IUserRepository) =>
  async (data: {
    userId: z.infer<typeof userEntity.shape.internal.shape.id>;
  }): Promise<z.infer<typeof userEntity.shape.internal.shape.id>> => {
    try {
      const { id } = await UserRepository.getById(data.userId);
      return id;
    } catch (error) {
      if (
        error instanceof CustomError &&
        error.name === 'IllegalOperationError'
      ) {
        throw new CustomError(
          `User with ID ${data.userId} not found.`,
          'UserIdNotFoundError',
        );
      }
      console.error('🚀 ~ findUserByIdUseCase ~ error:', error);
      throw error;
    }
  };
