import type { projectEntityWithoutExternalEntities } from '@/entities/project.entity.js';
import {
  type userCreationInputEntity,
  type userCreationOutputEntity,
  type userEntityWithProjectCreationInputEntity,
  type userEntityWithProjectCreationOutputEntity,
} from '@/entities/user.entity.js';
import type { z } from 'zod';

export interface IUserRepository {
  register(
    userId: z.infer<typeof userCreationInputEntity>,
  ): Promise<z.infer<typeof userCreationOutputEntity>>;
  getById(
    userId: z.infer<typeof userCreationInputEntity>,
  ): Promise<z.infer<typeof userCreationOutputEntity> | undefined>;
  getPartialProjectsForPreviewByUserIdAndPage(
    userId: z.infer<typeof userCreationInputEntity>,
    page: number,
    pageSize: number,
  ): Promise<{
    projects: z.infer<typeof projectEntityWithoutExternalEntities>;
    total: number;
  }>;
  createNewProject(
    newProject: z.infer<typeof userEntityWithProjectCreationInputEntity>,
  ): Promise<z.infer<typeof userEntityWithProjectCreationOutputEntity>>;
}
