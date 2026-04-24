import { userEntity } from '@/entities/user.entity.js';
import type { z } from 'zod';

// const keyOfProjects = userEntity.shape.external.shape.projects.element.shape.internal.keyof();

export interface IUserRepository {
  register(
    userId: z.infer<typeof userEntity.shape.internal.shape.id>,
  ): Promise<z.infer<typeof userEntity.shape.internal>>;
  getById(
    userId: z.infer<typeof userEntity.shape.internal.shape.id>,
  ): Promise<z.infer<typeof userEntity.shape.internal>>;
  getPartialProjectsForPreviewByUserIdAndPage(
    userId: z.infer<typeof userEntity.shape.internal.shape.id>,
    page: number,
    pageSize: number,
    // includes: z.infer<typeof keyOfProjects>[]
  ): Promise<z.infer<typeof userEntity>>;
  createNewProject(
    userId: z.infer<typeof userEntity.shape.internal.shape.id>,
    projectTitle: z.infer<
      typeof userEntity.shape.external.shape.projects.element.shape.title
    >,
  ): Promise<z.infer<typeof userEntity.shape.external.shape.projects>>;
}
