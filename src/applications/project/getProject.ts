import { projectEntity } from '@/entities/project.entity.js';
import { userEntity } from '@/entities/user.entity.js';
import { knownErrors } from '@/interfaces/error.interface.js';
import type { IProjectRepository } from '@/interfaces/repository/project.interface.js';
import type { z } from 'zod';

export const getProjectUseCase =
  (ProjectRepository: IProjectRepository) =>
  async (
    projectId: z.infer<typeof projectEntity.shape.internal.shape.id>,
    userId: z.infer<typeof userEntity.shape.internal.shape.id>,
  ): Promise<z.infer<typeof projectEntity>> => {
    try {
      const project = await ProjectRepository.getById(
        await projectEntity.shape.internal.shape.id.parseAsync(projectId),
        await userEntity.shape.internal.shape.id.parseAsync(userId),
      );

      return project;
    } catch (error) {
      if (knownErrors.some((KnownError) => error instanceof KnownError)) {
        console.error('🚀 ~ getProjectUseCase ~ error:', error);
      }

      throw error;
    }
  };
