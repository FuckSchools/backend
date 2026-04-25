import { projectEntity } from '@/entities/project.entity.js';
import type { IProjectRepository } from '@/interfaces/repository/project.interface.js';
import type { z } from 'zod';

export const getProjectUseCase =
  (ProjectRepository: IProjectRepository) =>
  async (data: {
    projectId: z.infer<typeof projectEntity.shape.internal.shape.id>;
  }): Promise<z.infer<typeof projectEntity>> => {
    try {
      const project = await ProjectRepository.getById(data.projectId);

      return project;
    } catch (error) {
      console.error('🚀 ~ getProjectUseCase ~ error:', error);

      throw error;
    }
  };
