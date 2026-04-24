import { projectEntity } from '@/entities/project.entity.js';
import { userEntity } from '@/entities/user.entity.js';
import { knownErrors } from '@/interfaces/error.interface.js';
import type { IProjectRepository } from '@/interfaces/repository/project.interface.js';
import type { z } from 'zod';

export const createProjectUseCase =
  (ProjectRepository: IProjectRepository) =>
  async (
    userId: z.infer<typeof userEntity.shape.internal.shape.id>,
    title: z.infer<typeof projectEntity.shape.internal.shape.title>,
  ): Promise<z.infer<typeof projectEntity>> => {
    try {
      const project = await ProjectRepository.create(
        await userEntity.shape.internal.shape.id.parseAsync(userId),
        await projectEntity.shape.internal.shape.title.parseAsync(title),
      );

      return project;
    } catch (error) {
      if (knownErrors.some((KnownError) => error instanceof KnownError)) {
        console.error('🚀 ~ createProjectUseCase ~ error:', error);
      }

      throw error;
    }
  };
