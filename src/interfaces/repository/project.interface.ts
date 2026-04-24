import { projectEntity } from '@/entities/project.entity.js';
import { userEntity } from '@/entities/user.entity.js';
import type { z } from 'zod';

export interface IProjectRepository {
  create(
    userId: z.infer<typeof userEntity.shape.internal.shape.id>,
    title: z.infer<typeof projectEntity.shape.internal.shape.title>,
  ): Promise<z.infer<typeof projectEntity>>;

  getById(
    projectId: z.infer<typeof projectEntity.shape.internal.shape.id>,
    userId: z.infer<typeof userEntity.shape.internal.shape.id>,
  ): Promise<z.infer<typeof projectEntity>>;
}
