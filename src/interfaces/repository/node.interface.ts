import { nodeEntity, type nodeCreationEntity } from '@/entities/node.entity.js';
import type { z } from 'zod';

export interface INodeRepository {
  createNode(
    data: z.infer<typeof nodeCreationEntity>,
    isRoot?: boolean,
  ): Promise<z.infer<typeof nodeEntity.shape.internal>>;

  getById(
    nodeId: z.infer<typeof nodeEntity.shape.internal.shape.id>,
  ): Promise<z.infer<typeof nodeEntity>>;
}
