import type { userEntity } from '@/entities/user.entity.js';
import type { IUserRepository } from '@/interfaces/repository/user.interface.js';
import type z from 'zod';
export const getAllUserProjectsUseCase =
  (UserRepository: IUserRepository) =>
  async (data: {
    userId: z.infer<typeof userEntity.shape.internal.shape.id>;
  }): Promise<z.infer<typeof userEntity.shape.external.shape.projects>> => {
    try {
      const projects = await UserRepository.getAllUserProjectsByUserId(
        data.userId,
      );
      return projects.external.projects;
    } catch (error) {
      console.error('🚀 ~ getAllUserProjectsUseCase ~ error:', error);
      throw error;
    }
  };
