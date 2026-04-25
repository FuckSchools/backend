import { projectEntity } from '@/entities/project.entity.js';
import { treeEntity } from '@/entities/tree.entity.js';
import type { z } from 'zod';

export interface ITreeRepository {
  getByProjectId(
    projectId: z.infer<typeof projectEntity.shape.internal.shape.id>,
  ): Promise<z.infer<typeof treeEntity>>;
}
