import { nodeEntity } from '@/entities/node.entity.js';
import { projectEntity } from '@/entities/project.entity.js';
import { treeEntity } from '@/entities/tree.entity.js';
import { userEntity } from '@/entities/user.entity.js';
import type { z } from 'zod';

export interface ITreeRepository {
  create(
    projectId: z.infer<typeof projectEntity.shape.internal.shape.id>,
    userId: z.infer<typeof userEntity.shape.internal.shape.id>,
    rootContent: z.infer<typeof nodeEntity.shape.internal.shape.content>,
    rootPrerequisites: z.infer<
      typeof nodeEntity.shape.external.shape.prerequisites
    >,
    rootStatesOfCompletion: Array<{
      content: z.infer<
        typeof nodeEntity.shape.external.shape.statesOfCompletion.element.shape.content
      >;
      status: z.infer<
        typeof nodeEntity.shape.external.shape.statesOfCompletion.element.shape.status
      >;
    }>,
  ): Promise<z.infer<typeof treeEntity>>;

  getById(
    treeId: z.infer<typeof treeEntity.shape.internal.shape.id>,
    userId: z.infer<typeof userEntity.shape.internal.shape.id>,
  ): Promise<z.infer<typeof treeEntity>>;
}
