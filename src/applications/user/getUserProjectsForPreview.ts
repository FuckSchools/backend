import type { userEntity } from '@/entities/user.entity.js';
import type { IUserRepository } from '@/interfaces/repository/user.interface.js';
import type z from 'zod';

export const getUserProjectsForPreviewUseCase =
  (UserRepository: IUserRepository) =>
  async (data: {
    userId: z.infer<typeof userEntity.shape.internal.shape.id>;
    page: number;
    pageSize: number;
  }): Promise<z.infer<typeof userEntity.shape.external>> => {
    try {
      const projects =
        await UserRepository.getPartialProjectsForPreviewByUserIdAndPage(
          data.userId,
          data.page,
          data.pageSize,
        );
      return projects.external;
    } catch (error) {
      console.error('🚀 ~ getUserProjectsForPreviewUseCase ~ error:', error);
      throw error;
    }
  };
