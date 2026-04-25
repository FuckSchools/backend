import {
  projectEntity,
  type projectCreationEntity,
} from '@/entities/project.entity.js';
import type { z } from 'zod';

export interface IProjectRepository {
  create(
    data: z.infer<typeof projectCreationEntity>,
  ): Promise<z.infer<typeof projectEntity.shape.internal>>;

  getById(
    projectId: z.infer<typeof projectEntity.shape.internal.shape.id>,
  ): Promise<z.infer<typeof projectEntity>>;
}
