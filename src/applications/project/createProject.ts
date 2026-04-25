import { projectEntity } from '@/entities/project.entity.js';
import { userEntity } from '@/entities/user.entity.js';
import type { IProjectRepository } from '@/interfaces/repository/project.interface.js';
import type { z } from 'zod';

export const createProjectUseCase =
  (ProjectRepository: IProjectRepository) =>
  async (data: {
    userId: z.infer<typeof userEntity.shape.internal.shape.id>;
    title: z.infer<typeof projectEntity.shape.internal.shape.title>;
  }): Promise<z.infer<typeof projectEntity.shape.internal>> => {
    try {
      const project = await ProjectRepository.create(data);

      return project;
    } catch (error) {
      console.error('🚀 ~ createProjectUseCase ~ error:', error);

      throw error;
    }
  };
