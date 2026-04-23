import type { projectEntityWithoutTreeAndSessions } from '@/entities/project.entity.js';
import {
  userEntity,
  type userEntityForCreatingNewProject,
} from '@/entities/user.entity.js';
import type { z } from 'zod';

export interface IUserRepository {
  register(
    userId: z.infer<typeof userEntity.shape.id>,
  ): Promise<z.infer<typeof userEntity.shape.id>>;
  getById(
    userId: z.infer<typeof userEntity.shape.id>,
  ): Promise<z.infer<typeof userEntity.shape.id> | undefined>;
  getPartialProjectsForPreviewByUserIdAndPage(
    userId: z.infer<typeof userEntity.shape.id>,
    page: number,
    pageSize: number,
  ): Promise<{
    projects: z.infer<typeof projectEntityWithoutTreeAndSessions>;
    total: number;
  }>;
  createNewProject(
    newProject: z.infer<typeof userEntityForCreatingNewProject>,
  ): Promise<z.infer<typeof userEntity.shape.projects>>;
}
