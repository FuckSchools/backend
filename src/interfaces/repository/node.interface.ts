import { nodeEntity } from '@/entities/node.entity.js';
import { userEntity } from '@/entities/user.entity.js';
import type { z } from 'zod';

export interface INodeRepository {
  createChildNode(
    parentNodeId: z.infer<typeof nodeEntity.shape.internal.shape.id>,
    userId: z.infer<typeof userEntity.shape.internal.shape.id>,
    content: z.infer<typeof nodeEntity.shape.internal.shape.content>,
    prerequisites: z.infer<
      typeof nodeEntity.shape.external.shape.prerequisites
    >,
    statesOfCompletion: Array<{
      content: z.infer<
        typeof nodeEntity.shape.external.shape.statesOfCompletion.element.shape.content
      >;
      status: z.infer<
        typeof nodeEntity.shape.external.shape.statesOfCompletion.element.shape.status
      >;
    }>,
  ): Promise<z.infer<typeof nodeEntity>>;

  getById(
    nodeId: z.infer<typeof nodeEntity.shape.internal.shape.id>,
    userId: z.infer<typeof userEntity.shape.internal.shape.id>,
  ): Promise<z.infer<typeof nodeEntity>>;
}
